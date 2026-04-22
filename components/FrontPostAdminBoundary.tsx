'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { InlineArticleEditorClient } from '@/components/InlineArticleEditorClient'
import { useAdminSession } from '@/lib/admin-session-client'

interface FrontPostAdminBoundaryProps {
  slug: string
  title: string
  html: string
  category?: string | null
  coverImage?: string | null
  password?: string | null
  publishedAt?: number
  viewCount?: number
  content?: string
  children: ReactNode
}

export function FrontPostAdminBoundary({
  slug,
  title,
  html,
  category,
  coverImage,
  password,
  publishedAt,
  viewCount,
  content,
  children,
}: FrontPostAdminBoundaryProps) {
  const { authenticated } = useAdminSession()
  const [editing, setEditing] = useState(false)

  if (authenticated && editing) {
    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--editor-line)] bg-[var(--editor-panel)] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--editor-ink)]">管理员编辑模式</p>
            <p className="text-xs text-[var(--editor-muted)]">当前修改只对你自己加载，不影响公开页缓存。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-[var(--editor-line)] px-3 py-2 text-sm text-[var(--editor-muted)] transition hover:bg-[var(--editor-soft)] hover:text-[var(--editor-ink)]"
            >
              返回阅读
            </button>
            <Link
              href="/admin"
              className="rounded-lg bg-[var(--editor-accent)] px-3 py-2 text-sm font-medium text-white transition hover:brightness-105"
            >
              后台管理
            </Link>
          </div>
        </div>
        <InlineArticleEditorClient
          slug={slug}
          title={title}
          html={html}
          category={category}
          coverImage={coverImage}
          password={password}
          publishedAt={publishedAt}
          viewCount={viewCount}
          content={content}
        />
      </section>
    )
  }

  return (
    <>
      {authenticated ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--editor-line)] bg-[var(--editor-panel)] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--editor-ink)]">管理员已登录</p>
            <p className="text-xs text-[var(--editor-muted)]">需要修改本文时再加载编辑器，普通阅读保持公开页最快路径。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-lg bg-[var(--editor-accent)] px-3 py-2 text-sm font-medium text-white transition hover:brightness-105"
            >
              编辑本文
            </button>
            <Link
              href={`/editor?edit=${encodeURIComponent(slug)}`}
              className="rounded-lg border border-[var(--editor-line)] px-3 py-2 text-sm text-[var(--editor-muted)] transition hover:bg-[var(--editor-soft)] hover:text-[var(--editor-ink)]"
            >
              完整编辑器
            </Link>
          </div>
        </div>
      ) : null}
      {children}
    </>
  )
}
