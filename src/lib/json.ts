import { CantParseJSONFileError } from './errors'
import { readFile } from './file'

// Read and validate JSON
export const readJSONFile = async (file: any) => {
  const content = await readFile(file)

  if (content === null) {
    return content
  }

  try {
    return JSON.stringify(JSON.parse(content))
  } catch (err) {
    throw new CantParseJSONFileError(file)
  }
}
