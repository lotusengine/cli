import { doQuery, removeEmpty } from '../../lib/query'
import { readJSONFile } from '../../lib/json'

export const listModules = async () => {
  const query = `query Modules($after: String, $limit: Int) {
    modules(limit: $limit, after: $after) {
      nodes {
        id
        label
        scope
      }
      nextToken
    }
  }  
`
  const { modules } = await doQuery(query)

  return modules.nodes
}

export const createModule = async (params: any) => {
  const query = `mutation CreateModule($input: CreateModuleInput!) {
    createModule(input: $input) {      
      id
    }
  }  
`
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'createModule' does not exist on type 'un... Remove this comment to see the full error message
  const { createModule } = await doQuery(query, { input: params })
  return createModule
}

export const deleteModule = async (id: any) => {
  const query = `mutation DeleteModule($input: DeleteModuleInput!) { 
    deleteModule(input: $input) {
     id
    }
  }`

  await doQuery(query, { input: { id } })
}

export const updateModule = async (params: any) => {
  const query = `mutation UpdateModule($input: UpdateModuleInput!){
    updateModule(input: $input) {      
      id
    }
  }  `

  await doQuery(query, { input: params })
}

export const getModule = async (id: any) => {
  const query = `query GetModule($id: ID!){
    module(id: $id) {      
      id
      source
      repository
      description
      label
      summary
      isActive
      createdAt
      updatedAt
    }
  }`
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'module' does not exist on type 'unknown'... Remove this comment to see the full error message
  const { module } = await doQuery(query, { id })
  return module
}

export const invokeModule = async (params: any) => {
  let { id, parameters, payload } = params
  const query = `mutation($input: InvokeModuleInput!){
    invokeModule(input: $input){   
      id
      response
    }
  }`

  if (payload) {
    payload = await readJSONFile(payload)
  }

  if (parameters) {
    parameters = await readJSONFile(parameters)
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'invokeModule' does not exist on type 'un... Remove this comment to see the full error message
  const { invokeModule } = await doQuery(query, {
    input: removeEmpty({ id, parameters, payload })
  })
  return invokeModule
}
