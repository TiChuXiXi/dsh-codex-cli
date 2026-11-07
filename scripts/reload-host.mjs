/** Trigger a DSH profile recomposition. This is a config event, not proof of a code swap. */
import { stat, utimes } from 'node:fs/promises'
import { resolve } from 'node:path'
const filename = resolve(
  process.env.DSH_PROFILE_DIR || '/root/.dsh/profiles/web',
  'cordis.patch.yml',
)
await stat(filename)
const now = new Date()
await utimes(filename, now, now)
console.log(
  'Profile recomposition requested. Verify status.runtime.hostInstanceId and hostBuildId; the DSH PID must stay unchanged.',
)
