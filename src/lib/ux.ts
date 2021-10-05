
import chalk from "chalk"
import ux from "cli-ux"
import { table as t } from "cli-ux/lib/styled/table"
import ww from 'word-wrap'
import terminalSize from 'term-size'
import { render } from 'prettyjson'
import { ObjectLiteral } from "typings/common"


const MAX_FIELD_WIDTH = 15


export const typeCheck = (value: unknown): string => {
  const res = Object.prototype.toString.call(value)
  // we can also use regex to do this...
  const type = res.substring(
    res.indexOf(' ') + 1,
    res.indexOf(']')
  )

  return type.toLowerCase()
}

const wrap = (text: string, params: { indent: number, width: number }) => {
  const { indent, width } = params
  return ww(text, { indent: ' '.repeat(indent), width }).trim()
}

const title = (s: string) => {
  spacer()
  ux.styledHeader(`${chalk.cyan(s.toUpperCase())}`)
}

const header = (s: string) => {
  spacer()
  ux.info(`${s.toUpperCase()}`)
}


const spacer = () => {
  console.log(" ")
}

const table = <T extends ObjectLiteral>(data: T[], columns: t.Columns<T>, options?: t.Options) => {

  const entries: ObjectLiteral[] = [...data]

  entries.map(entry => {
    for (const field in entry) {
      const t = typeCheck(entry[field])

      if (entry[field] === 'null' || t === 'null' || t === 'undefined')
        entry[field] = chalk.italic('fix null')
    }
  })


  spacer()
  ux.table(entries.map(field => {
    console.log(field)
    return field
  }), columns, options)
  spacer()
}

const success = (s: string) => {
  ux.info(`${chalk.cyan('Success!')} ${s}`)
}


export const pad = (string: string, width: number) => {
  const n = width - string.length
  return ' '.repeat(n)
}

// Print a definition list
export const specs = (entries: Record<string, unknown> = {}) => {
  spacer()
  const dims = terminalSize()

  const spacing = 2
  const width = dims.columns - (MAX_FIELD_WIDTH + spacing)
  for (const key in entries) {
    let value = ''

    const type = typeCheck(entries[key])
    switch (type) {
      case 'string':
        value = wrap(entries[key] as string, { indent: MAX_FIELD_WIDTH + 2, width })
        break
      case 'array':
      case 'object': {
        const j = render(entries[key], {
          keysColor: 'cyan',
          dashColor: 'grey',
        })
        value = j.replace(/\n/g, "\n" + ' '.repeat(17))
      }
        break;
      case 'null': {
        value = chalk.italic('null')
      }
        break;
      case 'undefined': {
        value = chalk.italic('undefined')
      }
        break;
      default:
        value = `No handler defined for ${type}`
    }


    ux.info(`${pad(key, MAX_FIELD_WIDTH)}${chalk.bold(key)}${' '.repeat(spacing)}${value}`)


  }

  spacer()

}


const ui = { ...ux, spacer, wrap, title, header, table, success, specs }

export default ui
