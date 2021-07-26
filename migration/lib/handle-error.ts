// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/bytes` if it exists or add... Remove this comment to see the full error message
import bytes from 'bytes'
import { info, issue } from './styles'

export default (error: any, { debug = false } = {}) => {
  // Coerce Strings to Error instances
  if (typeof error === 'string') {
    error = new Error(error)
  }

  if (debug) {
    console.log(`> [debug] handling error: ${error.stack}`)
  }

  if (error.status === 403) {
    console.error(
      error(
        error.message ||
          'Authentication error. Run `now login` to log-in again.'
      )
    )
  } else if (error.status === 429) {
    // Rate limited: display the message from the server-side,
    // which contains more details
    console.error(issue(error.message))
  } else if (error.code === 'size_limit_exceeded') {
    const { sizeLimit = 0 } = error
    console.error(issue(`File size limit exceeded (${bytes(sizeLimit)})`))
  } else if (error.message) {
    console.error(issue(error.message))
  } else if (error.status === 500) {
    console.error(issue('Unexpected server error. Please retry.'))
  } else if (error.code === 'USER_ABORT') {
    info('Aborted')
  } else {
    console.error(
      issue(`Unexpected error. Please try again later. (${error.message})`)
    )
  }
}
