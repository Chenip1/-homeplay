function boot({ tabs, templates, modules }) {
  const app = document.querySelector('#app')
  const outlet = document.querySelector('#page')
  const nav = document.querySelector('#tabs')
  const styles = document.querySelector('#page-style')
  const dialog = document.querySelector('#dialog')
  const toast = document.querySelector('#toast')
  const login = 'pages/login/login'
  const home = 'pages/index/index'
  const cache = new Map()
  const badges = new Map()
  let definition, current, stack = [], toastTimer

  function require(path) {
    if (cache.has(path)) return cache.get(path).exports
    const module = { exports: {} }
    cache.set(path, module)
    modules[path](require, module, module.exports, page => { definition = page }, wx)
    return module.exports
  }

  function evaluate(value, scope) {
    if (typeof value !== 'function') return value
    try { return value(scope) }
    catch (error) {
      // WXML treats missing data and nested properties as empty bindings.
      if (!(error instanceof ReferenceError || error instanceof TypeError)) throw error
      return undefined
    }
  }
  const tags = { image: 'img', picker: 'view', switch: 'input' }
  const pointerTypes = {
    touchstart: 'pointerdown', touchmove: 'pointermove', touchend: 'pointerup', touchcancel: 'pointercancel'
  }

  function expand(nodes, scope, parentKey = '') {
    const result = []
    let matched = false
    for (const [index, node] of nodes.entries()) {
      const key = parentKey + '/' + index
      if ('text' in node) {
        result.push({ key, text: String(evaluate(node.text, scope) ?? '') })
        continue
      }
      const attrs = node.attrs
      const include = data => !('wx:if' in attrs) || evaluate(attrs['wx:if'], data)
      function add(data, id) {
        const children = expand(node.children, data, id)
        if (node.tag === 'block') result.push(...children)
        else {
          const values = Object.fromEntries(Object.entries(attrs)
            .filter(([name]) => !name.startsWith('wx:')).map(([name, value]) => [name, evaluate(value, data)]))
          result.push({ key: id, tag: node.tag, attrs: values, children })
        }
      }
      if ('wx:for' in attrs) {
        matched = false
        const items = evaluate(attrs['wx:for'], scope) ?? []
        Array.from(items).forEach((item, i) => {
          const data = { ...scope, [attrs['wx:for-item'] || 'item']: item, [attrs['wx:for-index'] || 'index']: i }
          if (!include(data)) return
          const field = attrs['wx:key']
          const identity = field === '*this' ? item : item?.[field]
          add(data, key + ':' + JSON.stringify(identity ?? i))
          matched = true
        })
      } else if ('wx:elif' in attrs || 'wx:else' in attrs) {
        if (!matched && (!('wx:elif' in attrs) || evaluate(attrs['wx:elif'], scope))) {
          add(scope, key)
          matched = true
        }
      } else {
        matched = !!include(scope)
        if (matched) add(scope, key)
      }
    }
    return result
  }

  function eventFor(element, event) {
    const bounds = element.getBoundingClientRect()
    const point = {
      identifier: event.pointerId, clientX: event.clientX, clientY: event.clientY,
      x: event.clientX - bounds.left, y: event.clientY - bounds.top
    }
    return {
      currentTarget: { dataset: element.wxDataset },
      detail: { value: element.type === 'checkbox' ? element.checked : element.value },
      touches: [point], changedTouches: [point]
    }
  }

  function bind(element, type, handler) {
    element['on' + type] = event => {
      if (type === 'pointerdown') element.setPointerCapture(event.pointerId)
      if (type === 'pointermove' && !element.hasPointerCapture(event.pointerId)) return
      current?.[handler]?.(eventFor(element, event))
    }
  }

  function patchElement(element, node) {
    const attrs = node.attrs
    element.wxDataset = {}
    for (const [name, value] of Object.entries(attrs)) {
      const event = /^(?:bind|catch)(?::)?(.+)$/.exec(name)?.[1]
      if (event) {
        if (node.tag === 'picker') continue
        if (pointerTypes[event]) element.setAttribute('data-pointer', '')
        bind(element, pointerTypes[event] || (event === 'tap' ? 'click' : event), value)
        if (event === 'tap' && node.tag !== 'button') {
          element.setAttribute('role', 'button')
          element.tabIndex = 0
          element.onkeydown = e => {
            if (e.target === element && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              element.click()
            }
          }
        }
      } else if (name.startsWith('data-')) {
        const field = name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        element.wxDataset[field] = value
      } else if (name === 'value' && node.tag === 'input') {
        if (element.wxValue !== value) element.value = value ?? ''
        element.wxValue = value
      } else if (name === 'disabled' || name === 'checked') {
        element[name] = !!value
      } else if (name === 'percent') {
        element.max = 100
        element.value = value
      } else if (name === 'lazy-load') {
        if (value) element.loading = 'lazy'
      } else if (!['mode', 'range', 'aria-role'].includes(name) && !(name === 'type' && node.tag === 'canvas')) {
        if (value == null || value === false) element.removeAttribute(name)
        else if (element.getAttribute(name) !== String(value)) element.setAttribute(name, value)
      }
    }
    if (node.tag === 'switch') {
      element.type = 'checkbox'
      element.className = 'web-switch'
      element.setAttribute('aria-label', '在线时公开小窝')
    }
    if (node.tag === 'image') {
      element.draggable = false
      element.alt = attrs['aria-label'] || ''
      if (attrs.mode) element.style.objectFit = { aspectFill: 'cover', aspectFit: 'contain', scaleToFill: 'fill' }[attrs.mode]
    }
    if (node.tag === 'picker') {
      element.classList.add('web-picker')
      if (attrs.mode === 'region') {
        element.tabIndex = 0
        element.setAttribute('role', 'button')
        element.onclick = () => wx.showModal({
          title: '设置地区', editable: true, placeholderText: '省份 / 城市 / 区县',
          success: ({ confirm, content }) => {
            const value = content?.split(/[/／,，]/).map(part => part.trim()).slice(0, 3)
            if (confirm && value?.[0] && value?.[1]) current?.[attrs.bindchange]?.({ detail: { value } })
            else if (confirm) wx.showToast({ title: '请输入省份和城市，用斜线分隔' })
          }
        })
        element.onkeydown = e => { if (e.key === 'Enter') element.click() }
      } else {
        const select = {
          key: node.key + '/select', tag: 'select',
          attrs: { 'aria-label': '选择', bindchange: attrs.bindchange, disabled: attrs.disabled },
          children: Array.from(attrs.range || [], (label, index) => ({
            key: String(index), tag: 'option', attrs: { value: index },
            children: [{ key: 'label', text: String(label) }]
          }))
        }
        reconcile(element, [...node.children, select])
        element.lastChild.value = String(attrs.value ?? -1)
        return
      }
    }
    reconcile(element, node.children)
  }

  // Keep DOM identity across setData updates for canvas contexts, focus and pointer capture.
  function reconcile(parent, desired) {
    const existing = new Map(Array.from(parent.childNodes, child => [child.wxKey, child]))
    let cursor = parent.firstChild
    for (const node of desired) {
      let element = existing.get(node.key)
      if (!element) {
        element = node.tag ? document.createElement(tags[node.tag] || node.tag) : document.createTextNode('')
        element.wxKey = node.key
      }
      existing.delete(node.key)
      if (node.tag) patchElement(element, node)
      else if (element.data !== node.text) element.data = node.text
      if (element !== cursor) parent.insertBefore(element, cursor)
      cursor = element.nextSibling
    }
    for (const child of existing.values()) child.remove()
  }

  function render(page) {
    if (page === current) reconcile(outlet, expand(templates[page.route], page.data))
  }

  function selectQuery() {
    const requests = []
    let selection
    const query = {
      in() { return query },
      select(selector) { selection = { selector }; return query },
      selectAll(selector) { selection = { selector, all: true }; return query },
      boundingClientRect(callback) { return query.fields({ rect: true, size: true }, callback) },
      fields(options, callback) { requests.push({ ...selection, options, callback }); return query },
      exec(callback) {
        const results = requests.map(({ selector, all, options, callback: onField }) => {
          const read = element => {
            if (!element) return null
            const data = options.rect || options.size ? element.getBoundingClientRect().toJSON() : {}
            if (options.dataset) data.dataset = element.wxDataset || {}
            if (options.node) {
              data.node = element
              if (element instanceof HTMLCanvasElement) {
                element.createImage = () => new Image()
                element.requestAnimationFrame = requestAnimationFrame.bind(window)
                element.cancelAnimationFrame = cancelAnimationFrame.bind(window)
              }
            }
            if (options.computedStyle) {
              const style = getComputedStyle(element)
              for (const field of options.computedStyle) data[field] = style[field]
            }
            return data
          }
          const data = all ? Array.from(outlet.querySelectorAll(selector), read) : read(outlet.querySelector(selector))
          onField?.(data)
          return data
        })
        callback?.(results)
      }
    }
    return query
  }

  function showModal(options) {
    if (dialog.open) dialog.close()
    const heading = document.createElement('strong')
    heading.textContent = options.title || '提示'
    const form = document.createElement('form')
    form.method = 'dialog'
    form.append(heading)
    let input
    if (options.editable) {
      input = document.createElement('input')
      input.value = options.content || ''
      input.placeholder = options.placeholderText || ''
      form.append(input)
    } else if (options.content) {
      const body = document.createElement('p')
      body.textContent = options.content
      form.append(body)
    }
    const controls = document.createElement('div')
    controls.className = 'controls'
    for (const [value, label] of [
      ...(options.showCancel === false ? [] : [['cancel', options.cancelText || '取消']]),
      ['confirm', options.confirmText || '确定']
    ]) {
      const button = document.createElement('button')
      button.value = value
      button.textContent = label
      if (value === 'cancel') button.formNoValidate = true
      controls.append(button)
    }
    form.append(controls)
    form.addEventListener('submit', event => {
      event.preventDefault()
      const confirm = event.submitter?.value !== 'cancel'
      dialog.close()
      options.success?.({ confirm, cancel: !confirm, content: input?.value })
    })
    dialog.replaceChildren(form)
    dialog.oncancel = () => options.success?.({ confirm: false, cancel: true })
    dialog.showModal()
  }

  function updateTabs() {
    nav.hidden = !tabs.some(tab => tab.pagePath === current?.route)
    nav.replaceChildren(...tabs.map(({ pagePath, text }, index) => {
      const button = document.createElement('button')
      button.textContent = text
      if (current?.route === pagePath) button.setAttribute('aria-current', 'page')
      if (badges.has(index)) {
        const badge = document.createElement('sup')
        badge.textContent = badges.get(index)
        button.append(badge)
      }
      button.onclick = () => {
        if (current?.route === pagePath) current.onTabItemTap?.()
        else wx.switchTab({ url: '/' + pagePath })
      }
      return button
    }))
  }

  function activate(location) {
    const [route, search] = location.split('?')
    if (!Object.hasOwn(templates, route)) return
    current?.onHide?.()
    current?.onUnload?.()
    const page = { ...requirePage(route), route, createSelectorQuery: selectQuery }
    page.data = structuredClone(page.data || {})
    page.setData = (patch, callback) => {
      for (const [path, value] of Object.entries(patch)) {
        const fields = path.match(/[^.\[\]]+/g)
        const target = fields.slice(0, -1).reduce((object, field) => object[field] ??= {}, page.data)
        target[fields.at(-1)] = value
      }
      render(page)
      callback?.()
    }
    current = page
    const name = route.split('/').at(-1)
    app.dataset.route = name
    const stylesheet = './' + name + '.css'
    styles.href = stylesheet
    outlet.replaceChildren()
    outlet.scrollTop = 0
    updateTabs()
    // Canvas dimensions must be read after the route stylesheet has loaded.
    const ready = () => {
      if (current !== page || page.webReady) return
      page.webReady = true
      page.onLoad?.(Object.fromEntries(new URLSearchParams(search)))
      if (current !== page) return
      page.onShow?.()
      if (current !== page) return
      render(page)
      page.onReady?.()
    }
    styles.onload = ready
    if (styles.sheet) requestAnimationFrame(ready)
  }

  const definitions = new Map()
  function requirePage(route) {
    if (!definitions.has(route)) {
      require(route)
      definitions.set(route, definition)
    }
    return definitions.get(route)
  }

  function navigate({ url, success, fail }, mode) {
    const location = url.replace(/^\//, '')
    if (!Object.hasOwn(templates, location.split('?')[0])) return fail?.()
    if (mode === 'push') stack = [...stack, location]
    else stack = [location]
    history[mode === 'replace' ? 'replaceState' : 'pushState'](stack, '', '#' + location)
    activate(location)
    success?.()
  }

  const wx = {
    getStorageSync(key) {
      const value = localStorage.getItem('homeplay:' + key)
      return value === null ? '' : JSON.parse(value)
    },
    setStorageSync(key, value) { localStorage.setItem('homeplay:' + key, JSON.stringify(value)) },
    showToast({ title, duration = 1800 }) {
      toast.textContent = title
      toast.hidden = false
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => { toast.hidden = true }, duration)
    },
    showModal,
    createSelectorQuery: selectQuery,
    getSystemInfoSync() { return { pixelRatio: window.devicePixelRatio || 1 } },
    getFileSystemManager() {
      return { saveFile: ({ tempFilePath, success }) => success({ savedFilePath: tempFilePath }), unlink() {} }
    },
    canvasToTempFilePath({ canvas, fileType, quality, success, fail }) {
      try { success({ tempFilePath: canvas.toDataURL(fileType === 'jpg' ? 'image/jpeg' : 'image/png', quality) }) }
      catch (error) { fail(error) }
    },
    previewImage({ current: src, urls }) {
      if (dialog.open) dialog.close()
      const image = new Image()
      image.alt = '萌宠相册照片'
      const images = urls?.length ? urls : [src]
      let i = Math.max(0, images.indexOf(src))
      const display = () => { image.src = images[i] }
      const controls = document.createElement('div')
      controls.className = 'controls'
      for (const [label, action] of [
        ['上一张', () => { i = (i + images.length - 1) % images.length; display() }],
        ['关闭', () => dialog.close()],
        ['下一张', () => { i = (i + 1) % images.length; display() }]
      ]) {
        const button = document.createElement('button')
        button.textContent = label
        button.onclick = action
        controls.append(button)
      }
      display()
      dialog.oncancel = null
      dialog.replaceChildren(image, controls)
      dialog.showModal()
    },
    setTabBarBadge({ index, text }) { badges.set(index, text); updateTabs() },
    removeTabBarBadge({ index }) { badges.delete(index); updateTabs() },
    navigateTo(options) { navigate(options, 'push') },
    switchTab(options) { navigate(options, 'tab') },
    reLaunch(options) { navigate(options, 'replace') },
    navigateBack({ delta = 1, fail } = {}) {
      if (stack.length <= delta) fail?.()
      else history.go(-delta)
    }
  }

  const store = require('utils/store')
  if (window.homePlayOnline) {
    const key = 'homeplay:pk-browser-identity'
    let identity = localStorage.getItem(key)
    if (!identity) {
      identity = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('')
      localStorage.setItem(key, identity)
    }
    wx.cloud = {
      init() {},
      async callFunction({ data }) {
        const response = await fetch('/api/pk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + identity },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('PK 请求失败')
        return { result: await response.json() }
      }
    }
    const { startPresence, stopPresence } = require('utils/pk-client')
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopPresence()
      else startPresence()
    })
    startPresence()
  }
  const requested = location.hash.slice(1)
  const loggedIn = store.getState().user.loggedIn
  const initial = loggedIn
    ? (Object.hasOwn(templates, requested.split('?')[0]) && requested !== login ? requested : home)
    : login
  const loginPage = requirePage(login)
  loginPage.start = loginPage.finishFakeAuth
  addEventListener('popstate', event => {
    if (!Array.isArray(event.state)) return
    stack = event.state
    const target = stack.at(-1)
    if (target === login && store.getState().user.loggedIn) wx.reLaunch({ url: home })
    else activate(target)
  })
  addEventListener('resize', () => current?.onResize?.())
  wx.reLaunch({ url: initial })
}
