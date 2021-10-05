import { doMutation, doQuery, parseFields, removeEmpty } from 'src/lib/query'
import { ISO8601DateTime, OptionsSchema, UUID } from 'src/types/common'
import { ModuleCreateInput, ModuleEvents, ModuleModel, ModuleScope, ModuleUpdateInput } from 'src/types/module'

// Find a module by ID
export const findModule = async (id: UUID): Promise<ModuleModel> => {
  const query = `query GetModule($id: ID!){
    module(id: $id) {  
      id
      label
      summary
      description
      repository
      options
      scope
      meta
      hash
      events
      createdAt
      updatedAt
      deployedAt
    }
  }`

  const res = await doQuery<{ module: ModuleModel }>(query, { id })
  if (!res) throw new Error('Missing')

  const {
    label, summary, description, repository, events, createdAt, updatedAt, deployedAt, scope, hash, meta, options } = res.module


  return parseFields<{ id: UUID, createdAt: ISO8601DateTime, updatedAt: ISO8601DateTime, deployedAt: ISO8601DateTime, label: string, summary: string, scope: ModuleScope, description: string, options: OptionsSchema, events: ModuleEvents }>({ label, summary, description, repository, events, createdAt, updatedAt, deployedAt, scope, hash, meta, options }, ['options', 'events', 'meta'])
}

// Delete a module by ID
export const deleteModule = async (id: UUID): Promise<void> => {
  const query = `mutation DeleteModule($input: DeleteModuleInput!) { 
    deleteModule(input: $input) {
     id
    }
  }`

  await doMutation(query, { input: { id } })
}

// Validate a module
export const validateModule = async (params: ModuleCreateInput) => {

  const query = `mutation ValidateModule($input: ValidateModuleInput!) {
      validateModule(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return !res.errors
}

// Update a module
export const updateModule = async (params: ModuleUpdateInput) => {

  const query = `mutation UpdateModule($input: UpdateModuleInput!) {
      updateModule(input: $input) {
        id
      }
    }`

  await doMutation(query, {
    input: removeEmpty(params)
  })

}

// Create a new module
export const createModule = async (params: ModuleCreateInput) => {
  const query = `mutation CreateModule($input: CreateModuleInput!) {
      createModule(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return res.data.createModule
}

// List modules
export const listModules = async (): Promise<Partial<ModuleModel>[]> => {
  const query = `query Modules($after: String, $limit: Int) {
    modules(limit: $limit, after: $after) {
      nodes {
        id
        label
        createdAt
      }
    }
  }`

  const res = await doQuery<{ modules: { nodes: ModuleModel[] } }>(query)

  return res.modules.nodes.map(({ id, label, createdAt }) => ({ id, label, createdAt } as ModuleModel))
}
