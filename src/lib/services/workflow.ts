import { doMutation, doQuery, parseFields, removeEmpty } from 'src/lib/query'
import { ISO8601DateTime, UUID } from 'src/types/common'
import { WorkflowModel, WorkflowDefinition, WorkflowTriggerInput, WorkflowTriggerResponse, WorkflowCreateInput, WorkflowUpdateInput } from 'src/types/workflow'

// Find a workflow by ID
export const findWorkflow = async (id: UUID): Promise<WorkflowModel> => {
  const query = `query GetWorkflow($id: ID!){
    workflow(id: $id) {  
      id
      service {
        id
      } 
      label
      summary
      settings      
      createdAt
      updatedAt
    }
  }`

  const res = await doQuery<{ workflow: WorkflowModel }>(query, { id })
  if (!res) throw new Error('Missing')

  const { service, settings, label, createdAt, updatedAt } = parseFields<{
    service: {
      id: UUID
    }, settings: WorkflowDefinition, label: string, createdAt: ISO8601DateTime, updatedAt: ISO8601DateTime
  }>(res.workflow, ['settings'])

  return { id, createdAt, updatedAt, serviceId: service.id, label, settings }
}

// Delete a workflow by ID
export const deleteWorkflow = async (id: UUID): Promise<void> => {
  const query = `mutation DeleteWorkflow($input: DeleteWorkflowInput!) { 
    deleteWorkflow(input: $input) {
     id
    }
  }`

  await doMutation(query, { input: { id } })
}

// Validate a workflow
export const validateWorkflow = async (params: WorkflowCreateInput) => {

  const query = `mutation ValidateWorkflow($input: ValidateWorkflowInput!) {
      validateWorkflow(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return !res.errors
}

// Update a workflow
export const updateWorkflow = async (params: WorkflowUpdateInput) => {

  const query = `mutation UpdateWorkflow($input: UpdateWorkflowInput!) {
      updateWorkflow(input: $input) {
        id
      }
    }`

  await doMutation(query, {
    input: removeEmpty(params)
  })

}

// Create a new workflow
export const createWorkflow = async (params: WorkflowCreateInput) => {
  const query = `mutation CreateWorkflow($input: CreateWorkflowInput!) {
      createWorkflow(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return res.data.createWorkflow
}

// List workflows
export const listWorkflows = async (): Promise<Partial<WorkflowModel>[]> => {
  const query = `query Workflows($after: String, $limit: Int) {
    workflows(limit: $limit, after: $after) {
      nodes {
        id
        label
        createdAt
      }
    }
  }`

  const res = await doQuery<{ workflows: { nodes: WorkflowModel[] } }>(query)

  return res.workflows.nodes.map(workflow => parseFields<{ id: UUID, label: string, createdAt: ISO8601DateTime }>(workflow, ['settings']))
}

// Trigger a workflow
export const triggerWorkflow = async (params: WorkflowTriggerInput): Promise<WorkflowTriggerResponse> => {
  const query = `mutation TriggerWorkflow($input: TriggerWorkflowInput!) {
      triggerWorkflow(input: $input) {
        status
        result
        errors
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return res.data.triggerWorkflow
}