import { doQuery, removeEmpty } from '../../../lib/query'
import { readJSONFile } from '../../../lib/json'

export const findService = async (id: any) => {
  const query = `query GetService($id: ID!){
    service(id: $id) {  
      id
      description
      label
      createdAt
      updatedAt
    }
  }`

  const res = await doQuery(query, { id })
  // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
  return res.service
}

export const deleteService = async (id: any) => {
  const query = `mutation DeleteService($input: DeleteServiceInput!) { 
    deleteService(input: $input) {
     id
    }
  }`

  await doQuery(query, { input: { id } })
}

export const triggerService = async (params: any) => {
  let { payload, id } = params
  const query = `mutation TriggerService($input: TriggerServiceInput!) {
      triggerService(input: $input) {
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
  return res.triggerService
}

export const validateService = async (params: any) => {
  let { label, description, definition, id } = params
  const query = `mutation ValidateService($input: ValidateServiceInput!) {
      validateService(input: $input) {
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

export const updateService = async (id: any, params: any) => {
  let { label, description, definition } = params
  const query = `mutation UpdateService($input: UpdateServiceInput!) {
      updateService(input: $input) {
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

export const createService = async (params: any) => {
  let { label, description, definition } = params
  const query = `mutation CreateService($input: CreateServiceInput!) {
      createService(input: $input) {
        id
      }
    }`

  if (definition) {
    definition = await readJSONFile(definition)
  }

  const res = await doQuery(query, {
    input: removeEmpty({ label, description, definition })
  })

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'createService' does not exist on type 'u... Remove this comment to see the full error message
  const { createService } = res

  return createService
}

export const listServices = async () => {
  const query = `query Services($after: String, $limit: Int) {
    services(limit: $limit, after: $after) {
      nodes {
        id
        label
        createdAt
      }
    }
  }`
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type 'unknow... Remove this comment to see the full error message
  const { services } = await doQuery(query)

  return services.nodes
}

export const fetchLogs = async (params = {}) => {
  const {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
    id,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serviceId' does not exist on type '{}'.
    serviceId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'processId' does not exist on type '{}'.
    processId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type '{}'.
    status,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type '{}'.
    type,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type '{}'.
    name,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type '{}'.
    query: term,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'scope' does not exist on type '{}'.
    scope,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'until' does not exist on type '{}'.
    until,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'from' does not exist on type '{}'.
    from
  } = params

  const query = `query Logs($filter: LogFilter, $search: LogSearch, $id: ID) {
  logs(filter: $filter, search: $search, id: $id) {
    id
    timestamp
    data
    serviceId
    processId
    timestamp
    status
    type
    name    
  }
}`
  const variables = {
    filter: {
      serviceId,
      processId,
      actionId: id,
      status,
      type,
      name,
      until,
      from
    },
    search: {
      query: term,
      scope
    },
    id
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'logs' does not exist on type 'unknown'.
  const { logs } = await doQuery(query, variables)
  return logs
}
