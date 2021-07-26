import { homedir } from 'os'
import { resolve } from 'path'

export default (path: any) => {
  const resolved = resolve(path)
  const _homedir = homedir()
  return resolved.indexOf(_homedir) === 0
    ? `~${resolved.substr(_homedir.length)}`
    : resolved
};
