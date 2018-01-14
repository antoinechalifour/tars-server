module.exports = function LoggerMiddleware (container) {
  const logging = container.resolve('logging')
  const logger = logging.getLogger('access')

  return async function (ctx, next) {
    const before = new Date()

    await next()

    const req = ctx.request
    const res = ctx.response
    const after = new Date()
    const isPost = req.method === 'POST'
    const isGql = req.url === '/graphql'
    const parts = [
      res.status,
      req.method,
      req.url,
      `(took ${after - before}ms)`
    ]

    if (isPost && isGql) {
      parts.push(`gql/${req.body.operationName}`)
    }

    logger.info(parts.join(' '))
  }
}
