import { doQuery, removeEmpty } from '../../../lib/query'
import { readJSONFile } from '../../../lib/json'

export const findWorkflow = async (id: any) => {
  const query = `query GetWorkflow($id: ID!){
    workflow(id: $id) {  
      id
      description
      label
      createdAt
      updatedAt
      definition
    }
  }`

  const res = await doQuery(query, { id })
  // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
  return res.workflow
}

export const deleteWorkflow = async (id: any) => {
  const query = `mutation DeleteWorkflow($input: DeleteWorkflowInput!) { 
    deleteWorkflow(input: $input) {
     id
    }
  }`

  await doQuery(query, { input: { id } })
}

export const triggerWorkflow = async (params: any) => {
  let { payload, id } = params
  const query = `mutation TriggerWorkflow($input: TriggerWorkflowInput!) {
      triggerWorkflow(input: $input) {
       data
       status
       message
       code
      }
    }`

  if (payload) {
    payload = await readJSONFile(payload)
  }

  const res = await doQuery(query, {
    input: removeEmpty({ payload, id })
  })

  // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
  return res.triggerWorkflow
}

export const validateWorkflow = async (params: any) => {
  let { label, description, definition, id } = params
  const query = `mutation ValidateWorkflow($input: ValidateWorkflowInput!) {
      validateWorkflow(input: $input) {
        id
      }
    }`

  if (definition) {
    definition = await readJSONFile(definition)
  }

  const res = await doQuery(query, {
    input: removeEmpty({ label, description, definition, id })
  })
  // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
  return !res.errors
}

export const updateWorkflow = async (id: any, params: any) => {
  let { label, description, definition } = params
  const query = `mutation UpdateWorkflow($input: UpdateWorkflowInput!) {
      updateWorkflow(input: $input) {
        id
      }
    }`

  if (definition) {
    definition = await readJSONFile(definition)
  }

  await doQuery(query, {
    input: removeEmpty({ label, description, definition, id })
  })
}

export const createWorkflow = async (params: any) => {
  let { label, description, definition, serviceId } = params
  const query = `mutation CreateWorkflow($input: CreateWorkflowInput!) {
      createWorkflow(input: $input) {
        id
      }
    }`

  if (definition) {
    definition = await readJSONFile(definition)
  }

  const res = await doQuery(query, {
    input: removeEmpty({ serviceId, label, description, definition })
  })

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'createWorkflow' does not exist on type '... Remove this comment to see the full error message
  const { createWorkflow } = res

  return createWorkflow
}

export const listWorkflows = async () => {
  const query = `query Workflows($after: String, $limit: Int) {
    workflows(limit: $limit, after: $after) {
      nodes {
        id
        label
        createdAt
      }
    }
  }`
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type 'unkno... Remove this comment to see the full error message
  const { workflows } = await doQuery(query)

  return workflows.nodes
}

export const fetchLogs = async (params = {}) => {
  const {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type '{}'.
    status,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflowId' does not exist on type '{}'.
    workflowId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'processId' does not exist on type '{}'.
    processId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type '{}'.
    query: term,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'scope' does not exist on type '{}'.
    scope,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'startDate' does not exist on type '{}'.
    startDate,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'endDate' does not exist on type '{}'.
    endDate,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'limit' does not exist on type '{}'.
    limit
  } = params

  const query = `query Logs($workflowId: ID, $filter: LogFilter, $search: LogSearch, $limit: Int) {
  logs(workflowId: $workflowId, filter: $filter, search: $search, limit: $limit) {
    nodes {
      processId
      workflowId
      triggeredAt
      status
      entries  
    }
  }
}`
  const variables = {
    workflowId,
    filter: {
      startDate,
      endDate,
      processId,
      status
    },
    search: {
      query: term,
      scope
    },
    limit
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'logs' does not exist on type 'unknown'.
  const { logs } = await doQuery(query, variables)
  return logs.nodes
}
