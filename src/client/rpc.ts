/** 宿主 RPC 的浏览器侧封装：把信封收敛成值或异常。 */

export type Api = <T = any>(endpoint: string, payload?: any) => Promise<T>

export type Envelope =
  | { ok: true, value: any }
  | { ok: false, error: { code: string, message: string, details?: any } }

export type Call = (channel: string, endpoint: string, payload: any) => Promise<Envelope | null | undefined>

export const CHANNEL = '/codex-cli'

export function createApi(call: Call): Api {
  return async <T = any>(endpoint: string, payload: any = {}): Promise<T> => {
    const envelope = await call(CHANNEL, endpoint, payload)
    if (envelope === null || envelope === undefined || typeof envelope !== 'object') {
      throw new Error('宿主返回了空响应')
    }
    if (envelope.ok === false) {
      const error = envelope.error ?? { code: 'codex-cli/unknown', message: '请求失败' }
      const failure = new Error(error.message)
      ;(failure as any).code = error.code
      ;(failure as any).details = error.details
      throw failure
    }
    return envelope.value as T
  }
}
