
export type HTTPHeaders = NodeJS.Dict<string | string[]>

export type AllowedHeadersMap = { [key in AllowedHeaders]?: string }

export enum AllowedHeaders {
  ORIGIN = 'Origin',
  AUTH = 'Authorization',
  ACCOUNT = 'X-Account-Id',
  API = 'X-Api-Key',
  METHOD = 'X-Request-Method',
  AGENT = 'User-Agent',
  REFERER = 'X-Forwarded-For'
}

export type SimpleError = {
  code: string
  statusCode: number
  message?: string
  meta?: any
}

export type CommonKey = string



export type UUID = string
export type Email = string
export type ISO8601Date = string
export type ISO8601DateTime = string
export type URL = string
export type JSONQuery = string
export type JSONData = string
export type ObjectHash = string

export type ObjectLiteral = Record<string, unknown>

export type Scalar = string | number | boolean | null

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json }

// For API responses and general JSONish structure data (objects, arrays, etc)
export type Data = ObjectLiteral | ObjectLiteral[] | string[]

export type JsonStruture = Json[] | { [key: string]: Json }
export type JsonStructObject = JsonStruture
export type JsonStructArray = Json[]


// Range data alias (2 m, 4 hours, etc)
export type Interval = string

// Convenience types for time
export type Timestamp = number
export type Seconds = number
export type MilliSeconds = number

// export interface Payload {
//   [x: string]: string | number | boolean | Date | Payload | JsonArray
// }
// export type JsonArray = (
//   | string
//   | number
//   | boolean
//   | Date
//   | Payload
//   | JsonArray
// )[]

export type KeyValue = Record<string, number | string | boolean | null> // TODO this was changed from just string so check all usage to see if this broader def is ok

export type KeyValueAny = Record<string, string>

export interface StringMap {
  [name: string]: string
}

// Module and service input parameters
export interface OptionSchema {
  type: 'string' | 'number' | 'boolean'
  required?: boolean
}

export interface OptionsSchema {
  [key: string]: OptionSchema
}

export interface Meta {
  author?: string
  url?: string
}

