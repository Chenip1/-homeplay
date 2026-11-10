import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { compileFunction } from 'node:vm'
import { AsyncLocalStorage } from 'node:async_hooks'

// The same PK handler runs against process-local storage for web previews.
const nests = new Map(), rooms = new Map()
const context = new AsyncLocalStorage()
const matches = (row, filter) => typeof filter === 'function' ? filter(row) :
  Object.entries(filter).every(([key, value]) => typeof value === 'function' ? value(row[key]) : row[key] === value)
const command = {
  in: values => value => values.includes(value),
  neq: expected => value => value !== expected,
  gt: threshold => value => value > threshold,
  and: filters => row => filters.every(filter => matches(row, filter)),
  or: filters => row => filters.some(filter => matches(row, filter))
}
let pending = Promise.resolve()
const db = {
  command,
  collection(name) {
    const table = name === 'pet_pk_nests' ? nests : rooms
    return {
      doc(id) {
        return {
          async get() {
            if (!table.has(id)) throw Object.assign(new Error('房间不存在或已过期'), { game: true })
            return { data: structuredClone(table.get(id)) }
          },
          async set({ data }) { table.set(id, structuredClone({ ...data, _id: id })) }
        }
      },
      async add({ data }) {
        const id = randomUUID()
        await this.doc(id).set({ data })
        return { _id: id }
      },
      where(filter) {
        let sort, limit = Infinity
        return {
          orderBy(key) { sort = key; return this },
          limit(count) { limit = count; return this },
          async get() {
            const rows = [...table.values()].filter(row => matches(row, filter))
            if (sort) rows.sort((a, b) => b[sort] - a[sort])
            return { data: structuredClone(rows.slice(0, limit)) }
          }
        }
      }
    }
  },
  runTransaction(action) {
    const result = pending.then(() => action(db))
    pending = result.catch(() => {})
    return result
  }
}
const cloud = { init() {}, database: () => db, getWXContext: () => ({ OPENID: context.getStore() }) }
const source = new URL('../cloudfunctions/petPk/index.js', import.meta.url)
const require = createRequire(source)
const exports = {}
compileFunction(readFileSync(source, 'utf8'), ['require', 'exports'], { filename: source.pathname })(
  name => name === 'wx-server-sdk' ? cloud : require(name), exports
)

export function play(identity, event) {
  const now = Date.now()
  for (const [id, nest] of nests) if (nest.seen < now - 45000) nests.delete(id)
  for (const [id, room] of rooms) if (room.updated < now - 7200000) rooms.delete(id)
  return context.run(identity, () => exports.main(event))
}
