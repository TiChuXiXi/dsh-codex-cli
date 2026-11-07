import type { Attachment } from './page/Composer'
export function readDraft(threadId: string | null): {
  text: string
  attachments: Attachment[]
} {
  try {
    const parsed = threadId
      ? JSON.parse(
          sessionStorage.getItem('dsh-codex-draft:' + threadId) || 'null',
        )
      : null
    if (
      parsed &&
      typeof parsed.text === 'string' &&
      parsed.text.length <= 200000 &&
      Array.isArray(parsed.attachments)
    )
      return {
        text: parsed.text,
        attachments: parsed.attachments
          .slice(0, 100)
          .filter(
            (a: any) =>
              a &&
              typeof a.name === 'string' &&
              typeof a.path === 'string' &&
              ['file', 'image'].includes(a.kind),
          ),
      }
  } catch {}
  return { text: '', attachments: [] }
}
export function saveDraft(
  threadId: string | null,
  text: string,
  attachments: Attachment[],
) {
  if (!threadId) return
  try {
    const key = 'dsh-codex-draft:' + threadId
    if (!text && !attachments.length) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, JSON.stringify({ text, attachments }))
  } catch {}
}
