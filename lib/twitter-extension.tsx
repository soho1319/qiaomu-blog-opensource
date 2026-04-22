'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          tweetId: string,
          element: HTMLElement,
          options?: {
            align?: 'left' | 'center' | 'right'
            conversation?: 'all' | 'none'
            dnt?: boolean
          }
        ) => Promise<HTMLElement>
      }
    }
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    twitter: {
      setTweet: (options: { src: string }) => ReturnType
    }
  }
}

// ── 提取推文 ID ──
function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
  return match?.[1] ?? null
}

// ── 加载 Twitter widgets.js（全局单例） ──
let widgetScriptLoaded = false
function loadTwitterWidgets(): Promise<void> {
  if (widgetScriptLoaded && typeof window !== 'undefined' && window.twttr?.widgets) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(); return }
    const existing = document.getElementById('twitter-widgets-js')
    if (existing) {
      const check = () => {
        if (window.twttr?.widgets) resolve()
        else setTimeout(check, 100)
      }
      check()
      return
    }
    const script = document.createElement('script')
    script.id = 'twitter-widgets-js'
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.onload = () => {
      widgetScriptLoaded = true
      const check = () => {
        if (window.twttr?.widgets) resolve()
        else setTimeout(check, 100)
      }
      check()
    }
    document.head.appendChild(script)
  })
}

// ── React 组件：渲染推文 ──
function TweetComponent(props: ReactNodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const src = props.node.attrs.src as string
  const tweetId = extractTweetId(src)

  const renderTweet = useCallback(async () => {
    if (!tweetId || !containerRef.current) return
    containerRef.current.innerHTML = ''
    await loadTwitterWidgets()
    try {
      await window.twttr?.widgets.createTweet(tweetId, containerRef.current, {
        align: 'center',
        conversation: 'none',
        dnt: true,
      })
    } catch {
      if (containerRef.current) {
        containerRef.current.innerHTML = `<a href="${src}" target="_blank" rel="noopener noreferrer" style="color:#1da1f2">${src}</a>`
      }
    }
  }, [tweetId, src])

  useEffect(() => { renderTweet() }, [renderTweet])

  return (
    <NodeViewWrapper data-type="twitter" className="twitter-node-view">
      <div ref={containerRef} style={{ minHeight: 100 }}>
        {!tweetId && (
          <p style={{ color: '#999', fontSize: 14 }}>
            无效的推文链接：<a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
          </p>
        )}
      </div>
    </NodeViewWrapper>
  )
}

// ── Tiptap Node 扩展 ──
export const TwitterNode = Node.create({
  name: 'twitter',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-twitter-src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ 'data-twitter-src': HTMLAttributes.src }, HTMLAttributes),
      ['a', { href: HTMLAttributes.src, target: '_blank', rel: 'noopener noreferrer' }, HTMLAttributes.src],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TweetComponent)
  },

  addCommands() {
    return {
      setTweet:
        (options: { src: string }) =>
        ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { src: options.src },
        })
      },
    }
  },
})
