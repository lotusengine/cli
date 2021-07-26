import { homedir } from 'os'
import { resolve } from 'path'
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/yaml` if it exists or add ... Remove this comment to see the full error message
import YAML from 'yaml'
import fs, { promises as fp } from 'fs'
// @ts-expect-error ts-migrate(2440) FIXME: Import declaration conflicts with local declaratio... Remove this comment to see the full error message
import { readFile } from './file'
import { extname } from 'path'
import {
  // @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'CantPa... Remove this comment to see the full error message
  CantParseYAMLFile,
  // @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'CantPa... Remove this comment to see the full error message
  CantParseJSONFile,
  // @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'Unknow... Remove this comment to see the full error message
  UnknownFileType,
  // @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'CantFi... Remove this comment to see the full error message
  CantFindFile
} from './errors'

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'file' implicitly has an 'any' type.
export async function readSchemaFile(file) {
  const content = await readFile(file)

  if (content === null) {
    return content
  }
  const type = getFileType(file)
  if (type === 'json') {
    try {
      return JSON.parse(content)
    } catch (error) {
      return new CantParseJSONFile(file)
    }
  } else {
    try {
      return YAML.parse(content)
    } catch (error) {
      return new CantParseYAMLFile(file)
    }
  }
}

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'file' implicitly has an 'any' type.
function getFileType(file) {
  const ext = extname(file)
    .toLowerCase()
    .slice(1)

  if (['yml', 'yaml'].includes(ext)) return 'yaml'
  if (['json', 'json5'].includes(ext)) return 'json'
  return new UnknownFileType(file)
}

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'path' implicitly has an 'any' type.
export function resolveHomeDir(path) {
  return resolve(path.replace('~', homedir()))
}

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'file' implicitly has an 'any' type.
async function checkFileExists(file) {
  try {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'R_OK' does not exist on type 'typeof imp... Remove this comment to see the full error message
    await fp.access(file, fs.R_OK)
  } catch (_) {
    throw new CantFindFile(file)
  }
}

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'file' implicitly has an 'any' type.
async function readFile(file) {
  const path = resolveHomeDir(file)

  await checkFileExists(path)

  const content = await fp.readFile(path)
  return content.toString()
}
