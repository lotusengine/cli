import chalk, { gray, yellow, cyan, red } from 'chalk'
import ms from 'ms'
import { format } from 'date-fns'
import ansiEscapes from 'ansi-escapes'
import ww from 'word-wrap'

const chars = {
  // in some setups now.exe crashes if we use
  // the normal tick unicode character :|
  tick: process.platform === 'win32' ? '√' : '✔',
  cross: process.platform === 'win32' ? '☓' : '✘'
}

export const wrap = (text: any, opts = {}) => {
  const params = { width: 70, indent: '    ' }
  return ww(text, { ...params, ...opts }).trim()
}

export const aborted = (msg: any) => `${red('> Aborted!')} ${msg}`

export const bold = (text: any) => `${chalk.underline.bold(text)}`

export const cmd = (text: any) =>
  `${chalk.gray('`')}${chalk.cyan(text)}${chalk.gray('`')}`

export const code = (code: any) => chalk.yellow(code)
export const concat = (words = []) => {
  if (words.length === 0) {
    return ''
  }

  if (words.length === 1) {
    return words[0]
  }

  const last = words[words.length - 1]
  const rest = words.slice(0, words.length - 1)
  return `${rest.join(', ')} and ${last}`
}

export const date = (dateStrOrNumber: any) => {
  if (!dateStrOrNumber) {
    return chalk.gray('-')
  }

  const date = new Date(dateStrOrNumber)
  const diff = date.getTime() - Date.now()

  return diff < 0
    ? `${format(date, 'dd MMMM yyyy HH:mm:ss')} ${chalk.gray(
        `[${ms(-diff)} ago]`
      )}`
    : `${format(date, 'dd MMMM yyyy HH:mm:ss')} ${chalk.gray(
        `[in ${ms(diff)}]`
      )}`
}

export const effect = (msg: any) => `${gray(`+ ${msg}`)}`

/**
 * Returns a styled string like "[30ms]" based on a number of ms
 *
 * @param time Number of ms
 * @param ago  Boolean to indicate if we should append `ago`
 */
export const elapsed = (time: any, ago = false) =>
  chalk.gray(`[${time < 1000 ? `${time}ms` : ms(time)}${ago ? ' ago' : ''}]`)

export const eraseLines = (numberOfLines: any) =>
  ansiEscapes.eraseLines(numberOfLines)

// @ts-expect-error ts-migrate(7019) FIXME: Rest parameter 'input' implicitly has an 'any[]' t... Remove this comment to see the full error message
export const issue = (...input) => {
  let messages = input
  if (typeof input[0] === 'object') {
    const { message } = input[0]
    messages = [message]
  }

  return `${chalk.red('> Error!')} ${messages.join('\n')}`
}

export const formatLogCmd = (text: any) => `▲ ${formatLogText(text)}`

export const formatLogOutput = (text: any, prefix = '') =>
  formatLogText(text)
    .split('\n')
    .map((textItem: any) => `${prefix}${textItem.replace(/^> /, '')}`)
export const formatLogText = (text: any) =>
  text.replace(/\n$/, '').replace(/^\n/, '')

export const header = (txt: any) => `\n  ${chalk.bold(txt)}\n\n`

export const highlight = (text: any) => chalk.bold.underline(text)
export const line = (length: any) => {
  const fill = '-'.repeat(length)
  return `\n${fill}\n`
}

export const indent = (input: any, level: any) => {
  const fill = ' '.repeat(level)
  return `${fill}${input.replace(/\n/g, `\n${fill}`)}`
}

export const end = () => {
  return '\n\n'
}

// info('woot') === '> woot'
// info('woot', 'yay') === 'woot\nyay'
export const info = (...msgs) => `${chalk.gray('>')} ${msgs.join('\n')}`

export const json = (data: any, indent: any) => {
  if (typeof data === 'string') data = JSON.parse(data)

  if (!data || data === {}) return `${' '.repeat(indent)}...\n`

  // return stringifyObject(
  //   data,
  //   {
  //     maxDepth: 5,
  //     noSeparator: true,
  //     colors: {
  //       keys: 'cyan',
  //       stringColor: 'green'
  //     }
  //   },
  //   indent || 0
  // )
}

export const label = (txt: any, value: any) =>
  `    ${chalk.cyan(txt)}${' '.repeat(40 - txt.length)}${value}\n`

export const link = chalk.cyan.underline

// listItem('woot') === '- woot'
// listItem('->', 'woot') === '-> woot'
// listItem(1, 'woot') === '1. woot'
export const listItem = (msg: any, n: any) => {
  if (!n) {
    n = '-'
  }
  if (Number(n)) {
    n += '.'
  }
  return `${gray(n.toString())} ${msg}`
}

export const bool = (val: any) => (val ? 'yup' : 'nope')

export const note = (msg: any) => `${yellow('> NOTE:')} ${msg}`

export const ok = (msg: any) => `${cyan(chars.tick)} ${msg}`

export const param = (text: any) =>
  `${chalk.gray('"')}${chalk.bold(text)}${chalk.gray('"')}`

export const ready = (msg: any) => `${cyan('> Ready!')} ${msg}`

export const rpad = (string: any, n = 0) => {
  n -= string.length
  return string + ' '.repeat(n > -1 ? n : 0)
}

/**
 * Starts a timer and return a function that when called returns a string
 * with the ellapsed time formatted.
 */
export const stamp =
  (start = Date.now()) =>
  () =>
    elapsed(Date.now() - start)

const printLine = (data: any, sizes: any) =>
  data.reduce(
    (line: any, col: any, i: any) => line + printf(`%-${sizes[i]}s`, col),
    ''
  )

// Print a table
export const table = (headers = [], entries = [], indent = 4, margin = 2) => {
  // Compute size of each column
  const sizes = entries
    .reduce(
      (acc, row) =>
        Object.values(row).map((col, i) => {
          const currentMaxColSize = acc[i] || 0
          // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
          const colSize = (col && col.length) || 0
          return Math.max(currentMaxColSize, colSize)
        }),

      headers.map((col) => col.length)
    )

    .map((size, i) => (i < headers.length && size + margin) || size)

  const ind = ' '.repeat(indent)

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 3.
  console.log(ind + chalk.grey(printLine(headers, sizes, indent)) + '\n')

  entries.forEach((row) =>
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 3.
    console.log(ind + printLine(Object.values(row), sizes, indent))
  )
}

// Used for including uids in the output
// example: `(dom_ji13dj2fih4fi2hf)`
export const id = (id: any) => chalk.gray(`(${id})`)
