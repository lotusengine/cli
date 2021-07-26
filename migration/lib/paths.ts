import { homedir } from 'os'

import fs from 'fs'
import path from 'path'

// Packages
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/mri` if it exists or add a... Remove this comment to see the full error message
import mri from 'mri'
// import XDGAppPaths from 'xdg-app-paths'

// @ts-expect-error ts-migrate(2305) FIXME: Module '"./errors"' has no exported member 'Invali... Remove this comment to see the full error message
import { InvalidLocalConfig } from './errors'

// The `homeConfigPath` is the legacy configuration path located in the users home directory.
const homeConfigPath = path.join(homedir(), '.now')

// Returns whether a directory exists
export const isDirectory = (path: any) => {
  try {
    return fs.lstatSync(path).isDirectory()
  } catch (_) {
    // We don't care which kind of error occured, it isn't a directory anyway.
    return false
  }
}

// Returns in which directory the config should be present
export const getGlobalPathConfig = () => {
  const args = mri(process.argv.slice(2), {
    string: ['global-config'],
    alias: {
      'global-config': 'Q'
    }
  })

  const customPath = args['global-config']
  /// const xdgConfigPaths = XDGAppPaths('lotusengine').dataDirs()
  // const possibleConfigPaths = [homeConfigPath, ...xdgConfigPaths]

  // customPath is the preferred location
  // the legacy home directory config path is the second most wanted location
  // otherwise the first matching xdg-config-path is used which already exists
  // at last the first best xdg-config-path is used
  return (customPath && path.resolve(customPath)) || homeConfigPath
}

export const getLocalPathConfig = (prefix: any) => {
  const args = mri(process.argv.slice(2), {
    string: ['local-config'],
    alias: {
      'local-config': 'A'
    }
  })

  const customPath = args['local-config']

  if (Array.isArray(customPath)) {
    throw new InvalidLocalConfig(customPath)
  }

  if (!customPath) {
    return path.join(prefix, 'lotus.json')
  }

  return path.resolve(prefix, customPath)
}
