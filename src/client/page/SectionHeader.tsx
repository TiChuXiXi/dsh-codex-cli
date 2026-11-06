/** 侧栏分区头：标题 + 搜索框 + 收起/展开按钮。 */

import * as React from 'react'
import { useT } from '../i18n'

export interface SectionHeaderProps {
  title: string
  search: string
  placeholder: string
  collapsed: boolean
  onSearch: (value: string) => void
  onToggle: () => void
}

export function SectionHeader({
  title,
  search,
  placeholder,
  collapsed,
  onSearch,
  onToggle,
}: SectionHeaderProps) {
  const t = useT()
  return (
    <div className="dsh-codex-section-head">
      <span className="dsh-codex-section-title">{title}</span>
      <input
        className="dsh-codex-search compact"
        type="search"
        value={search}
        placeholder={placeholder}
        onChange={(event) => onSearch(event.target.value)}
      />
      <button
        type="button"
        className={`dsh-codex-collapse ${collapsed ? 'collapsed' : ''}`}
        aria-expanded={!collapsed}
        title={collapsed ? t('common.expand') : t('common.collapse')}
        onClick={onToggle}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M4 6l3.3 3.3a1 1 0 0 0 1.4 0L12 6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
