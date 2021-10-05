import { ISO8601DateTime, Meta, OptionsSchema, URL, UUID } from './common'

export enum ModuleScope {
  PRIVATE = 'private',
  SECRET = 'secret',
  PUBLIC = 'public'
}

export type ModuleModel = {
  id: UUID
  updatedAt?: ISO8601DateTime
  createdAt?: ISO8601DateTime
  deployedAt?: ISO8601DateTime
  scope: ModuleScope
  label?: string
  summary?: string
  description?: string
  repository?: URL
  hash?: string // Commit hash
  meta?: Meta
  options?: OptionsSchema
  events?: ModuleEvents
}

// Custom error codes returned { some_event: 'Some description', ... }
export interface ModuleEvents {
  [key: string]: {
    description?: string
  }
}

export type ModuleUpsertInput = ModuleCreateInput | ModuleUpdateInput

export type ModuleCreateInput = {
  scope: ModuleScope
  label?: string
  summary?: string
  description?: string
  repository?: URL
  meta?: Meta
  options?: OptionsSchema
  events?: ModuleEvents
}


export type ModuleUpdateInput = {
  id: UUID
  scope?: ModuleScope
  label?: string
  summary?: string
  description?: string
  repository?: URL
  meta?: Meta
  options?: OptionsSchema
  events?: ModuleEvents
}

export type ModuleUpsertResult = void

export interface ModuleDeployParameters {
  moduleId: UUID
}
