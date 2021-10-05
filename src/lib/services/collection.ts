import { doMutation, doQuery, parseFields, removeEmpty } from 'src/lib/query'
import { ISO8601DateTime, UUID } from 'src/types/common'
import {
  CollectionModel,
  CollectionMapping,
  CollectionCreateInput,
  CollectionUpdateInput,
  CollectionOptions,
  CollectionQueries,
  CollectionTriggers
} from 'src/types/collection'

// Find a collection by ID
export const findCollection = async (id: UUID): Promise<CollectionModel> => {
  const query = `query GetCollection($id: ID!){
    collection(id: $id) {  
      id
      service {
        id
      } 
      label
      summary
      options
      mapping
      queries
      triggers
      createdAt
      updatedAt
    }
  }`

  const res = await doQuery<{ collection: CollectionModel }>(query, { id })
  if (!res) throw new Error('Missing')

  const {
    service,
    options,
    mapping,
    queries,
    triggers,
    label,
    createdAt,
    updatedAt
  } = parseFields<{
    service: {
      id: UUID
    }
    options: CollectionOptions
    queries: CollectionQueries
    triggers: CollectionTriggers
    mapping: CollectionMapping
    label: string
    createdAt: ISO8601DateTime
    updatedAt: ISO8601DateTime
  }>(res.collection, ['options', 'mapping', 'queries', 'triggers'])

  return {
    id,
    createdAt,
    updatedAt,
    serviceId: service.id,
    label,
    options,
    mapping,
    queries,
    triggers
  }
}

// Delete a collection by ID
export const deleteCollection = async (id: UUID): Promise<void> => {
  const query = `mutation DeleteCollection($input: DeleteCollectionInput!) { 
    deleteCollection(input: $input) {
     id
    }
  }`

  await doMutation(query, { input: { id } })
}

// Validate a collection
export const validateCollection = async (params: CollectionCreateInput) => {
  const query = `mutation ValidateCollection($input: ValidateCollectionInput!) {
      validateCollection(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return !res.errors
}

// Update a collection
export const updateCollection = async (params: CollectionUpdateInput) => {
  const query = `mutation UpdateCollection($input: UpdateCollectionInput!) {
      updateCollection(input: $input) {
        id
      }
    }`

  await doMutation(query, {
    input: removeEmpty(params)
  })
}

// Create a new collection
export const createCollection = async (params: CollectionCreateInput) => {
  const query = `mutation CreateCollection($input: CreateCollectionInput!) {
      createCollection(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(params)
  })

  return res.data.createCollection
}

// List collections
export const listCollections = async (): Promise<
  Partial<CollectionModel>[]
> => {
  const query = `query Collections($after: String, $limit: Int) {
    collections(limit: $limit, after: $after) {
      nodes {
        id
        label
        createdAt
      }
    }
  }`

  const res = await doQuery<{ collections: { nodes: CollectionModel[] } }>(
    query
  )

  return res.collections.nodes.map((collection) =>
    parseFields<{ id: UUID; label: string; createdAt: ISO8601DateTime }>(
      collection,
      ['options', 'mapping', 'queries', 'triggers']
    )
  )
}
