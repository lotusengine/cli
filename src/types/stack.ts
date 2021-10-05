import { StackModel } from '@lotusengine/types'

export type StackInitLanguage = 'typescript'

export type StackInitParams = {
  language: StackInitLanguage
  targetDirectory: string
  projectName: string
}

export type StackGenerateParams = {
  projectPath: string
}

export type StackTemplate = {
  language: StackInitLanguage
}

export type StackProjectMeta = {
  name: string
  version: string
}

export type StackDeployInput = StackModel

export type StackDeployOptions = {
  app: string
}
