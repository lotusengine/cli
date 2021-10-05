import { doMutation, doQuery, removeEmpty } from 'src/lib/query'
import { UUID } from 'src/types/common'
import { ParameterModel, ParameterInput } from 'src/types/parameter'

// Find a parameter by ID
export const findParameter = async (id: UUID): Promise<ParameterModel> => {
  const query = `query GetParameter($id: ID!){
    parameter(id: $id) {  
      id
      key
      value
      summary
      createdAt
      updatedAt
    }
  }`

  const res = await doQuery<{ parameter: ParameterInput }>(query, { id })
  if (!res) throw new Error('Missing')

  const {
    key, value, summary, createdAt, updatedAt } = res.parameter


  return {
    id, key, value, summary, createdAt, updatedAt
  }
}

// Delete a parameter by ID
export const deleteParameter = async (id: UUID): Promise<void> => {
  const query = `mutation DeleteParameter($input: DeleteParameterInput!) { 
    deleteParameter(input: $input) {
     id
    }
  }`

  await doMutation(query, { input: { id } })
}

// Validate a parameter
export const validateParameter = async (params: ParameterInput) => {

  const query = `mutation ValidateParameter($input: ValidateParameterInput!) {
      validateParameter(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return !res.errors
}

// Update a parameter
export const updateParameter = async (params: ParameterInput) => {

  const query = `mutation UpdateParameter($input: UpdateParameterInput!) {
      updateParameter(input: $input) {
        id
      }
    }`

  await doMutation(query, {
    input: removeEmpty(params)
  })

}

// Create a new parameter
export const createParameter = async (params: ParameterInput) => {
  const query = `mutation CreateParameter($input: CreateParameterInput!) {
      createParameter(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return res.data.createParameter
}

// List parameters
export const listParameters = async (): Promise<Partial<ParameterModel>[]> => {
  const query = `query Parameters($after: String, $limit: Int) {
    parameters(limit: $limit, after: $after) {
      nodes {
        id
        key
        createdAt
      }
    }
  }`

  const res = await doQuery<{ parameters: { nodes: ParameterInput[] } }>(query)

  return res.parameters.nodes.map(({ id, key, createdAt }) => ({ id, key, createdAt } as ParameterModel))
}
