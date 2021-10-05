import { Interval, ISO8601DateTime, JSONQuery, UUID } from './common'

export enum CollectionMappingFieldType {
  KEYWORD = 'keyword',
  TEXT = 'text',
  BOOLEAN = 'boolean',
  FLOAT = 'float',
  INTEGER = 'integer'
}

export type CollectionMappingFieldTypes = {
  keyword: string
  text: string
  boolean: boolean
  float: number
  integer: number
}

export type CollectionMappingFieldRequired = boolean

export type CollectionMappingFieldParams =
  | CollectionMappingFieldKeywordParams
  | CollectionMappingFieldTextParams
  | CollectionMappingFieldBooleanParams
  | CollectionMappingFieldFloatParams
  | CollectionMappingFieldIntegerParams

export interface CollectionMappingFieldBaseParams<
  TType extends CollectionMappingFieldType
  > {
  enum?: CollectionMappingFieldTypes[TType][]
  type: `${TType}`
  default?: CollectionMappingFieldTypes[TType]
  required?: CollectionMappingFieldRequired
}

export type CollectionMappingFieldKeywordParams =
  CollectionMappingFieldBaseParams<CollectionMappingFieldType.KEYWORD>

export type CollectionMappingFieldTextParams =
  CollectionMappingFieldBaseParams<CollectionMappingFieldType.TEXT>

export type CollectionMappingFieldIntegerParams =
  CollectionMappingFieldBaseParams<CollectionMappingFieldType.INTEGER>

export type CollectionMappingFieldFloatParams =
  CollectionMappingFieldBaseParams<CollectionMappingFieldType.FLOAT>

export type CollectionMappingFieldBooleanParams =
  CollectionMappingFieldBaseParams<CollectionMappingFieldType.BOOLEAN>

export type CollectionMappingFieldValue = string | boolean | number

export type CollectionMappingParams =
  | CollectionMappingFieldParams
  | [CollectionMappingFieldParams]
  | [CollectionMapping]
  | CollectionMapping

export interface CollectionMapping {
  [key: string]: CollectionMappingParams
}

export interface CollectionTrigger {
  query: JSONQuery
  ttl?: number // How long before we allow repeat firing - seconds
  range?: Interval // "34 days", "2 h" - none means stream data (i.e. now)
}

export type CollectionQuery = {
  query: JSONQuery
  description?: string
}

export interface CollectionOptions {
  strict?: boolean // What happens to extra data not specified in mapping? strict = strip - default
  // errors?: 'reject' | 'ignore' not in effect yet TODO
}
export interface CollectionQueries {
  [key: string]: CollectionQuery
}

export interface CollectionTriggers {
  [key: string]: CollectionTrigger
}


export type CollectionKeys = 'accountId' | 'collectionId'

export type CollectionModel = {
  id: UUID
  serviceId: UUID
  createdAt?: ISO8601DateTime
  updatedAt?: ISO8601DateTime
  label?: string
  summary?: string
  options: CollectionOptions
  mapping: CollectionMapping
  triggers: CollectionTriggers
  queries: CollectionQueries
}

export type CollectionUpsertInput = CollectionCreateInput | CollectionUpdateInput

export type CollectionStackInput = {
  label?: string
  summary?: string
  options?: CollectionOptions
  mapping?: CollectionMapping
  triggers?: CollectionTriggers
  queries?: CollectionQueries
}


export type CollectionCreateInput = {
  serviceId: UUID
  label?: string
  summary?: string
  options?: CollectionOptions
  mapping?: CollectionMapping
  triggers?: CollectionTriggers
  queries?: CollectionQueries
}

export type CollectionUpdateInput = {
  id: UUID
  serviceId?: UUID
  label?: string
  summary?: string
  options?: CollectionOptions
  mapping?: CollectionMapping
  triggers?: CollectionTriggers
  queries?: CollectionQueries
}

export type CollectionUpsertResult = void

export interface CollectionDeployInput {
  label?: string
  summary?: string
  options?: CollectionOptions
  mapping: CollectionMapping
  triggers: CollectionTriggers
  queries: CollectionQueries
}
