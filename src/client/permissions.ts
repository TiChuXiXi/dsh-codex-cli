import type { PermissionMode } from './page/Composer'

/** Shared by manual submission and updates to host-owned queued messages. */
export function permissionPayload(permission: PermissionMode) {
  const workspaceWrite = (networkAccess: boolean) => ({
    type: 'workspaceWrite',
    writableRoots: [],
    networkAccess,
    excludeTmpdirEnvVar: false,
    excludeSlashTmp: false,
  })
  if (permission === 'full') {
    return { approvalPolicy: 'never', approvalsReviewer: 'user', sandboxPolicy: { type: 'dangerFullAccess' } }
  }
  if (permission === 'read') {
    return { approvalPolicy: 'on-request', approvalsReviewer: 'user', sandboxPolicy: { type: 'readOnly', networkAccess: false } }
  }
  return {
    approvalPolicy: 'on-request',
    approvalsReviewer: permission === 'approve' ? 'auto_review' : 'user',
    sandboxPolicy: workspaceWrite(permission === 'approve'),
  }
}
