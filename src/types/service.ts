
import { ObjectHash, ISO8601DateTime, UUID, JSONData } from './common'
import { DynamicForm } from './form'

export interface ServiceSettings {
  [k: string]: string
}

export type ServiceDefinition = DynamicForm

export type ServiceDomain = string

export interface ServiceStackData {
  deployedAt?: ISO8601DateTime
  hash: ObjectHash
}

export type ServiceModel = {
  id: UUID
  createdAt?: ISO8601DateTime
  updatedAt?: ISO8601DateTime
  label?: string
  summary?: string
  description?: string
  settings: ServiceSettings
  definition?: ServiceDefinition
  domain?: ServiceDomain
}

export type ServiceUpsertInput = ServiceCreateInput | ServiceUpdateInput

export type ServiceCreateInput = {
  label?: string
  summary?: string
  description?: string
  settings: JSONData
  definition?: JSONData
  domain?: ServiceDomain
}

export type ServiceUpdateInput = {
  id?: UUID
  label?: string
  summary?: string
  description?: string
  settings: JSONData
  definition?: JSONData
  domain?: ServiceDomain
}
