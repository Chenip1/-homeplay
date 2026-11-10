import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { stripTypeScriptTypes } from 'node:module'
import { Script } from 'node:vm'

const source = new URL('../miniprogram/', import.meta.url)
const output = new URL('./dist/', import.meta.url)
const read = path => readFileSync(new URL(path, source), 'utf8')
const relativeAssets = content => content.replace(/(["'])\/assets\//g, '$1./assets/')
const config = JSON.parse(read('app.json'))
const modules = new Map()

function bundle(path) {
  if (modules.has(path)) return
  const url = new URL(path + '.js', source)
  const code = existsSync(url)
    ? readFileSync(url, 'utf8')
    : stripTypeScriptTypes(read(path + '.ts'))
  const adapted = path === 'utils/pk-client'
    ? code.replace('当前微信版本不支持在线 PK', '此网页地址未连接在线 PK 服务')
    : code
  const browserCode = relativeAssets(adapted)
  modules.set(path, browserCode.replace(/require\((['"])(\.[^'"]+)\1\)/g, (_, quote, relative) => {
    const dependency = posix.normalize(posix.join(posix.dirname(path), relative))
    bundle(dependency)
    return 'require(' + JSON.stringify(dependency) + ')'
  }))
}

function expression(value) {
  if (!value.includes('{{')) return JSON.stringify(value)
  const parts = value.split(/{{([\s\S]*?)}}/)
  const body = parts.length === 3 && !parts[0] && !parts[2]
    ? '(' + parts[1] + ')'
    : parts.map((part, index) => index % 2 ? 'String((' + part + ') ?? "")' : JSON.stringify(part)).join('+')
  return 'scope => { with(scope) { return ' + body + ' } }'
}

function template(markup) {
  const root = []
  const stack = [{ children: root }]
  const tokens = markup.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][\w-]*(?:"[^"]*"|'[^']*'|[^'"<>])*?>|{{[\s\S]*?}}|[^<{]+|[<{]/g)
  for (const [token] of tokens) {
    const parent = stack.at(-1)
    if (token.startsWith('<!--')) continue
    if (token.startsWith('</')) {
      if (parent.tag !== token.slice(2, -1).trim()) throw new Error('Unexpected closing tag ' + token)
      stack.pop()
    } else if (/^<[a-z]/.test(token)) {
      const [, tag, attributes] = /^<([\w-]+)([\s\S]*?)\/?\s*>$/.exec(token)
      const attrs = Array.from(attributes.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g),
        ([, name, double, single]) => [name, double ?? single ?? true])
      const node = { tag, attrs, children: [] }
      parent.children.push(node)
      if (!token.endsWith('/>')) stack.push(node)
    } else {
      const last = parent.children.at(-1)
      if (typeof last === 'string') parent.children[parent.children.length - 1] += token
      else parent.children.push(token)
    }
  }
  if (stack.length !== 1) throw new Error('Unclosed WXML tag: ' + stack.at(-1).tag)
  function compile(nodes) {
    return nodes.filter(node => typeof node !== 'string' || node.trim()).map(node => {
      if (typeof node === 'string') return '{text:' + expression(node.trim()) + '}'
      const attrs = node.attrs.map(([name, value]) =>
        JSON.stringify(name) + ':' + (value === true ? 'true' : expression(value)))
      return '{tag:' + JSON.stringify(node.tag) + ',attrs:{' + attrs.join(',') + '},children:[' + compile(node.children) + ']}'
    }).join(',')
  }
  return '[' + compile(root) + ']'
}

function css(path) {
  const file = ['.wxss', '.less'].map(ext => path + ext).find(name => existsSync(new URL(name, source)))
  if (!file) return ''
  return read(file)
    .replace(/@import\s+"([^"]+)";/g, (_, name) => css(posix.join(posix.dirname(path), name.replace(/\.wxss$/, ''))))
    .replace(/(-?(?:\d*\.)?\d+)rpx/g, 'calc($1 * var(--rpx))')
    .replace(/([^{}]+)\{/g, (_, selector) => selector
      .replace(/(^|[\s,>+~])page(?=\W|$)/g, '$1.page')
      .replace(/(^|[\s,>+~])image(?=\W|$)/g, '$1img') + '{')
}

function copyTree(from, to) {
  mkdirSync(to, { recursive: true })
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const name = entry.name + (entry.isDirectory() ? '/' : '')
    const input = new URL(name, from), target = new URL(name, to)
    if (entry.isDirectory()) copyTree(input, target)
    else writeFileSync(target, readFileSync(input))
  }
}

mkdirSync(output, { recursive: true })
writeFileSync(new URL('pk-config.js', output), 'window.homePlayOnline = false;\n')
copyTree(new URL('assets/', source), new URL('assets/', output))
for (const file of ['index.html', 'browser.js', 'browser.css']) {
  writeFileSync(new URL(file, output), readFileSync(new URL(file, import.meta.url)))
}
const pages = config.pages.map(path => {
  bundle(path)
  writeFileSync(new URL(path.split('/').at(-1) + '.css', output), css('app') + css(path))
  return JSON.stringify(path) + ':' + template(relativeAssets(read(path + '.wxml')))
})
const bundleCode = 'boot({tabs:' + JSON.stringify(config.tabBar.list) + ', templates:{' + pages.join(',') +
  '}, modules:{' + [...modules].map(([path, code]) =>
    JSON.stringify(path) + ':function(require,module,exports,Page,wx){\n' + code + '\n}').join(',') + '}});\n'
new Script(bundleCode, { filename: 'homeplay.js' })
writeFileSync(new URL('homeplay.js', output), bundleCode)
console.log('Built ' + pages.length + ' pages in ' + fileURLToPath(output))
