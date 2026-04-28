import type { NextRequest } from 'next/server'
import { ensureAuthenticatedRequest, getRouteEnvWithDb, jsonError, jsonOk, parseJsonBody } from '@/lib/server/route-helpers'
import { assertWechatBridgeReady, fetchWechatBridgeJson, getWechatBridgeConfig } from '@/lib/wechat-bridge-config'

interface PublishWechatBody {
  account_id?: string
  title?: string
  content_html?: string
  author?: string
  digest?: string
  content_source_url?: string
  cover_image_url?: string
  publish_now?: boolean
  need_open_comment?: boolean
  only_fans_can_comment?: boolean
}

export async function POST(req: NextRequest) {
  const route = await getRouteEnvWithDb('DB unavailable')
  if (!route.ok) return route.response

  const unauthorized = await ensureAuthenticatedRequest(req, route.db)
  if (unauthorized) return unauthorized

  try {
    const body = await parseJsonBody<PublishWechatBody>(req)
    const accountId = (body.account_id || '').trim()
    const title = (body.title || '').trim()
    const contentHtml = (body.content_html || '').trim()

    if (!accountId) return jsonError('请选择公众号账号', 400)
    if (!title) return jsonError('文章标题不能为空', 400)
    if (!contentHtml) return jsonError('文章内容不能为空', 400)

    const config = assertWechatBridgeReady(await getWechatBridgeConfig(route.db, route.env))
    const result = await fetchWechatBridgeJson<Record<string, unknown>>(config, '/v1/wechat/publish', {
      method: 'POST',
      body: JSON.stringify({
        account_id: accountId,
        title,
        content_html: contentHtml,
        author: (body.author || '').trim(),
        digest: (body.digest || '').trim(),
        content_source_url: (body.content_source_url || '').trim(),
        cover_image_url: (body.cover_image_url || '').trim(),
        publish_now: Boolean(body.publish_now),
        need_open_comment: Boolean(body.need_open_comment),
        only_fans_can_comment: Boolean(body.only_fans_can_comment),
      }),
    })

    return jsonOk(result)
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : '提交公众号发布失败', 500)
  }
}
