import { UUID, ISO8601DateTime } from "./common"

export type ParameterModel = {
  id: UUID
  createdAt?: ISO8601DateTime
  updatedAt?: ISO8601DateTime
  key: string
  value: string
  summary?: string
}

export type ParameterInput = {
  id?: UUID
  createdAt?: ISO8601DateTime
  updatedAt?: ISO8601DateTime
  key: string
  value: string
  summary?: string
}
