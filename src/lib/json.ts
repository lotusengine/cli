import { readFile } from 'fs-extra'
import { CantParseJSONFileError } from './errors'

import { typeCheck } from './ux'

// Read and validate JSON
export const readJSONFile = async (file: any) => {
  const content = await readFile(file)

  if (content === null) {
    return content
  }

  try {
    return JSON.stringify(JSON.parse(content.toString()))
  } catch (err) {
    throw new CantParseJSONFileError(file)
  }
}

// Parse JSON safely
export const parseJson: {
  <T>(json?: string): T
  (json?: undefined): void
} = (json: string | undefined) => {

  if (!json) return

  try {
    return JSON.parse(json)
  } catch (err) {
    throw new Error()
  }
}

export const assertValidJson = (json: string, field: string): void  => {
  if (!json) return

  if (typeCheck(json) !== 'string') throw new Error(`${field} is invalid JSON`)

  try {

    JSON.stringify(JSON.parse(json))
  } catch (e) {
    throw new Error(`${field} is invalid JSON`)
  }

}