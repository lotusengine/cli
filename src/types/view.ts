import { ISO8601DateTime, UUID } from './common'



export type ViewModel = {
  id: UUID
  serviceId: UUID
  createdAt?: ISO8601DateTime
  updatedAt?: ISO8601DateTime
  label?: string
  summary?: string
}

export type ViewUpsertInput = ViewCreateInput | ViewUpdateInput

export type ViewStackInput = {
  label?: string
  summary?: string
}

export type ViewCreateInput = {
  serviceId: UUID
  label?: string
  summary?: string
}

export type ViewUpdateInput = {
  id: UUID
  serviceId?: UUID
  label?: string
  summary?: string
}


export interface ViewDeployInput {
  label?: string
  summary?: string
}

export type ViewUpsertResult = void