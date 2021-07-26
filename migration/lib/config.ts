import path from 'path'
import {
  // @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'CantPa... Remove this comment to see the full error message
  CantParseJSONFile,
  // @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'CantFi... Remove this comment to see the full error message
  CantFindConfig,
  // @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'Workin... Remove this comment to see the full error message
  WorkingDirectoryDoesNotExist
} from './errors'
import humanizePath from './hp'
// @ts-expect-error ts-migrate(2613) FIXME: Module '"/Users/Yashua/Code/LotusEngine/Toolbelt/s... Remove this comment to see the full error message
import readJSONFile from './json'
import readPackage from './package'

// @ts-expect-error ts-migrate(2614) FIXME: Module '"./output"' has no exported member 'Output... Remove this comment to see the full error message
import { Output } from './output'

let config: any

export default async (output: any, configFile: any) => {
  // If config was already read, just return it
  if (config) {
    return config
  }

  let localPath
  try {
    localPath = process.cwd()
  } catch (err) {
    if (err.code === 'ENOENT') {
      return new WorkingDirectoryDoesNotExist()
    }
    throw err
  }

  // First try with the config supplied by the user via --local-config
  if (configFile) {
    const localFilePath = path.resolve(localPath, configFile)
    output.debug(
      `Found config in provided --local-config path ${localFilePath}`
    )
    const localConfig = await readJSONFile(localFilePath)
    if (localConfig instanceof CantParseJSONFile) {
      return localConfig
    }
    if (localConfig !== null) {
      config = localConfig
      return config
    }
  }

  // Then try with lotus.json in the same directory
  const nowFilePath = path.resolve(localPath, 'lotus.json')
  const mainConfig = await readJSONFile(nowFilePath)
  if (mainConfig instanceof CantParseJSONFile) {
    return mainConfig
  }
  if (mainConfig !== null) {
    output.debug(`Found config in file ${nowFilePath}`)
    const castedConfig = mainConfig
    config = castedConfig
    return config
  }

  // Finally try with the package
  const pkgFilePath = path.resolve(localPath, 'package.json')
  const pkgConfig = await readConfigFromPackage(pkgFilePath)
  if (pkgConfig instanceof CantParseJSONFile) {
    return pkgConfig
  }
  if (pkgConfig) {
    output.debug(`Found config in package ${nowFilePath}`)
    const castedConfig = pkgConfig
    config = castedConfig
    return config
  }

  // If we couldn't find the config anywhere return error
  return new CantFindConfig([nowFilePath, pkgFilePath].map(humanizePath))
}

const readConfigFromPackage = async (file: any) => {
  const result = await readPackage(file)
  if (result instanceof CantParseJSONFile) {
    return result
  }

  return result !== null ? result.now : null
}
