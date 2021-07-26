import { issue } from './styles'
import handleError from './handle-error'

const responseError = async (res: any, fallbackMessage = null, parsedBody = {}) => {
  let message
  let bodyError

  if (res.status >= 400 && res.status < 500) {
    let body

    try {
      body = await res.json()
    } catch (err) {
      body = parsedBody
    }

    // Some APIs wrongly return `err` instead of `error`
    bodyError = body.error || body.err || {}
    message = bodyError.message
  }

  if (message == null) {
    message = fallbackMessage === null ? 'Response Error' : fallbackMessage
  }

  const err = new Error(`${message} (${res.status})`)

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Error'.
  err.status = res.status
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverMessage' does not exist on type 'E... Remove this comment to see the full error message
  err.serverMessage = message

  // Copy every field that was added manually to the error
  if (bodyError) {
    for (const field of Object.keys(bodyError)) {
      if (field !== 'message') {
        // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
        err[field] = bodyError[field]
      }
    }
  }

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After')

    if (retryAfter) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'retryAfter' does not exist on type 'Erro... Remove this comment to see the full error message
      err.retryAfter = parseInt(retryAfter, 10)
    }
  }

  return err
}

const responseErrorMessage = async (res: any, fallbackMessage = null) => {
  let message

  if (res.status >= 400 && res.status < 500) {
    let body

    try {
      body = await res.json()
    } catch (err) {
      body = {}
    }

    // Some APIs wrongly return `err` instead of `error`
    message = (body.error || body.err || {}).message
  }

  if (message == null) {
    message = fallbackMessage === null ? 'Response Error' : fallbackMessage
  }

  return `${message} (${res.status})`
}
export { handleError, issue, responseErrorMessage, responseError }
