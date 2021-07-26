import path from 'path'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './errors-ts' or its correspond... Remove this comment to see the full error message
import { CantParseJSONFile } from './errors-ts'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './read-json-file' or its corre... Remove this comment to see the full error message
import readJSONFile from './read-json-file'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../types' or its corresponding... Remove this comment to see the full error message
import { Config } from '../types'

export default async (file: any) => {
  const pkgFilePath = file || path.resolve(process.cwd(), 'package.json')
  const result = await readJSONFile(pkgFilePath)

  if (result instanceof CantParseJSONFile) {
    return result
  }

  if (result) {
    return result
  }

  return null
};
