import { promises as fs } from 'fs'
import { resolve } from 'path'
import { CantFindFileError, CantReadDirError, CantLoadModule } from './errors'

// Require module
export const requireModule = (path: any) => {
  try {
    return require(path)
  } catch (e) {
    throw new CantLoadModule(path)
  }
}

// Read file w error
export const readFile = async (file: any) => {
  try {
    const fd = await fs.open(resolve(file), 'r')

    const content = await fs.readFile(fd)

    return content.toString()
  } catch (e) {
    throw new CantFindFileError(file)
  }
}

// Read  files from dir
export const readDir = async (dir: any) => {
  try {
    return await fs.readdir(dir)
  } catch (err) {
    throw new CantReadDirError(dir)
  }
}
