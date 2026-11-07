import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
export const GO_PROVIDER = 'opencode-go'
export const GO_DEFAULT_MODEL = 'deepseek-v4.1-flash'
export function providerOverrides(provider, codexHome) {
  return provider === GO_PROVIDER
    ? { modelProvider: provider, config: { model_catalog_json: join(codexHome, 'model-catalogs', 'opencode-go.json') } }
    : { modelProvider: provider || 'openai' }
}
export async function goModels(codexHome) {
  const catalog = JSON.parse(await readFile(join(codexHome, 'model-catalogs', 'opencode-go.json'), 'utf8'))
  if (!Array.isArray(catalog.models)) throw new Error('OpenCode Go 模型目录格式无效')
  return catalog.models.map(model => ({
    id: model.slug, displayName: (model.display_name || model.slug).replace(/^\[OpenCode Go\]\s*/, ''),
    description: model.description || null,
    defaultReasoningEffort: model.default_reasoning_level || null,
    supportedReasoningEfforts: (model.supported_reasoning_levels || []).map(e => ({reasoningEffort:e.effort,description:e.description})),
  })).filter(m => typeof m.id === 'string')
}
export async function resumeProvider(rpc, threadId, codexHome) {
  const read = await rpc.request('thread/read', {threadId,includeTurns:false}, {timeoutMs:20000})
  const provider = read?.thread?.modelProvider || 'openai'
  const overrides = providerOverrides(provider, codexHome)
  if (provider === GO_PROVIDER) {
    overrides.model = read?.thread?.model || GO_DEFAULT_MODEL
  }
  return overrides
}
