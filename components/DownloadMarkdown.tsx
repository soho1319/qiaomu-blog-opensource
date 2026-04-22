'use client'

import TurndownService from 'turndown'

export function DownloadMarkdown({ title, html }: { title: string; html: string }) {
  const handleDownload = () => {
    const td = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
    })
    // 保留图片标签（turndown 默认就支持 img → ![](src)）
    const markdown = td.turndown(html)
    const blob = new Blob([`# ${title}\n\n${markdown}`], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      title="下载 Markdown"
      className="inline-flex items-center justify-center rounded p-1 text-[var(--stone-gray)] hover:text-[var(--editor-accent)] hover:bg-[var(--editor-accent)]/8 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  )
}
