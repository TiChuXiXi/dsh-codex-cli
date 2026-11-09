/**
 * 事件总线：全局 seq、环形缓冲、SSE 订阅、增量合并。
 *
 * 设计目标：
 *   1. 浏览器断线重连只补差量；缺口超出缓冲时让它整页重拉（返回 null）。
 *   2. 文本/输出增量按 key 合并后批量发布，避免每个 token 一个 SSE 包。
 *   3. 事件本身是纯 JSON，可安全穿过 SSE。
 */

const DELTA_FLUSH_MS = 40

export class EventBus {
  /** @type {object[]} */
  #buffer = []
  /** @type {Set<(event: object) => void>} */
  #subscribers = new Set()
  /** @type {Map<string, { event: object, text: string }>} */
  #pendingDeltas = new Map()
  #deltaTimer = null
  #seq = 0
  #capacity

  constructor({ capacity = 5000 } = {}) {
    this.#capacity = capacity
  }

  /**
   * 发布一条事件。
   * @param {string} type
   * @param {any} payload
   * @param {object} [meta] threadId / turnId / itemId 等定位字段
   */
  publish(type, payload = null, meta = {}) {
    // A full item snapshot must never overtake its buffered text/output deltas.
    if (type !== 'item/delta') this.flushDeltas()
    const event = { seq: ++this.#seq, ts: Date.now(), type, ...meta, payload }
    this.#buffer.push(event)
    if (this.#buffer.length > this.#capacity) {
      this.#buffer.splice(0, this.#buffer.length - this.#capacity)
    }
    for (const subscriber of this.#subscribers) {
      try {
        subscriber(event)
      } catch {
        // 单个订阅者异常不影响其它订阅者
      }
    }
    return event
  }

  /**
   * 合并一段增量：同一 key 在 40ms 窗口内的文本拼起来只发一条。
   * @param {string} key 例如 `${threadId}:${itemId}:agentMessage`
   * @param {string} text
   * @param {object} meta 事件定位字段
   */
  publishDelta(key, text, meta = {}) {
    if (text === '') return
    const pending = this.#pendingDeltas.get(key)
    if (pending === undefined) {
      this.#pendingDeltas.set(key, { meta, text })
    } else {
      pending.text += text
    }
    if (this.#deltaTimer === null) {
      this.#deltaTimer = setTimeout(() => {
        this.#deltaTimer = null
        this.flushDeltas()
      }, DELTA_FLUSH_MS)
      this.#deltaTimer.unref?.()
    }
  }

  /** 立即把待合并的增量发出去。 */
  flushDeltas() {
    if (this.#pendingDeltas.size === 0) return
    const pending = [...this.#pendingDeltas.values()]
    this.#pendingDeltas.clear()
    for (const { meta, text } of pending) {
      this.publish('item/delta', { delta: text }, meta)
    }
  }

  /**
   * 取 seq 之后的事件。
   * @param {number} seq
   * @returns {object[] | null} null 表示缺口已滚出缓冲或 seq 超前，需要全量重拉
   */
  since(seq) {
    if (!Number.isFinite(seq) || seq < 0) return null
    if (seq > this.#seq) return null
    if (seq === this.#seq) return []
    const oldest = this.#buffer.length === 0 ? this.#seq + 1 : this.#buffer[0].seq
    if (seq < oldest - 1) return null
    return this.#buffer.filter((event) => event.seq > seq)
  }

  /** 订阅所有新事件；返回取消函数。 */
  subscribe(subscriber) {
    this.#subscribers.add(subscriber)
    return () => this.#subscribers.delete(subscriber)
  }

  get seq() {
    return this.#seq
  }

  get size() {
    return this.#buffer.length
  }

  /** 关闭：清空定时器与订阅者。 */
  dispose() {
    if (this.#deltaTimer !== null) {
      clearTimeout(this.#deltaTimer)
      this.#deltaTimer = null
    }
    this.#pendingDeltas.clear()
    this.#subscribers.clear()
    this.#buffer.length = 0
  }
}
