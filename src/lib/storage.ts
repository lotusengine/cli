import keyFileStorage from 'key-file-storage'

export const getConfig = async (key: string, path: string) => {
  const kfs = keyFileStorage(path, false)

  return kfs[key]
}

export const setConfig = async (key: string, value: string, path: string) => {
  const kfs = keyFileStorage(path, false)

  kfs[key] = value
}
