import { doMutation, doQuery, parseFields, removeEmpty } from 'src/lib/query'
import { ViewModel, ViewCreateInput, ViewUpdateInput } from 'src/types/view'
import { ISO8601DateTime, UUID } from 'src/types/common'

// Find a view by ID
export const findView = async (id: UUID): Promise<ViewModel> => {
  const query = `query GetView($id: ID!){
    view(id: $id) {  
      id
      service {
        id
      } 
      label
      summary    
      createdAt
      updatedAt
    }
  }`

  const res = await doQuery<{ view: ViewModel }>(query, { id })
  if (!res) throw new Error('Missing')

  const { service, label, createdAt, updatedAt } = parseFields<{
    service: {
      id: UUID
    }
    label: string
    createdAt: ISO8601DateTime
    updatedAt: ISO8601DateTime
  }>(res.view, [])

  return { id, createdAt, updatedAt, serviceId: service.id, label }
}

// Delete a view by ID
export const deleteView = async (id: UUID): Promise<void> => {
  const query = `mutation DeleteView($input: DeleteViewInput!) { 
    deleteView(input: $input) {
     id
    }
  }`

  await doMutation(query, { input: { id } })
}

// Validate a view
export const validateView = async (params: ViewCreateInput) => {
  const query = `mutation ValidateView($input: ValidateViewInput!) {
      validateView(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return !res.errors
}

// Update a view
export const updateView = async (params: ViewUpdateInput) => {
  const query = `mutation UpdateView($input: UpdateViewInput!) {
      updateView(input: $input) {
        id
      }
    }`

  await doMutation(query, {
    input: removeEmpty(params)
  })
}

// Create a new view
export const createView = async (params: ViewCreateInput) => {
  const query = `mutation CreateView($input: CreateViewInput!) {
      createView(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return res.data.createView
}

// List views
export const listViews = async (): Promise<Partial<ViewModel>[]> => {
  const query = `query Views($after: String, $limit: Int) {
    views(limit: $limit, after: $after) {
      nodes {
        id
        label
        createdAt
      }
    }
  }`

  const res = await doQuery<{ views: { nodes: ViewModel[] } }>(query)

  return res.views.nodes.map((view) =>
    parseFields<{ id: UUID; label: string; createdAt: ISO8601DateTime }>(
      view,
      []
    )
  )
}
