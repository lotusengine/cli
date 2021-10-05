//import { GraphQLClient, request } from 'graphql-request'
import {
  GRAPHQL_API_URL,
  LOTUSENGINE_ACCOUNT_ID,
  LOTUSENGINE_API_KEY
} from './constants'
import fetch from 'cross-fetch'
//export { default as gql } from 'graphql-tag'
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client/core'
import { typeCheck } from './ux'
import { InvalidJsonError } from './errors'

export const UPLOAD_BATCH_SIZE = 25

let client: ApolloClient<unknown>

// Create client instance
export const getClient = () => {
  if (!client) {
    client = new ApolloClient({
      uri: GRAPHQL_API_URL,
      //wsUrl: WS_API_URL
      link: new HttpLink({
        uri: `${GRAPHQL_API_URL}/graphql`,
        fetch,
        headers: {
          'X-Api-Key': LOTUSENGINE_API_KEY as string,
          'X-Account-Id': LOTUSENGINE_ACCOUNT_ID as string
        }
      }),
      cache: new InMemoryCache()
    })
  }
  return client
}

// Perform a GraphQL query
export const doQuery = async <TResult>(
  query: string,
  variables: Record<string, unknown> = {}
) => {
  const { data } = await getClient().query<TResult>({
    query: gql`
      ${query}
    `,
    variables
  })
  return data
}

// Perform a GraphQL mutation
export const doMutation = async (
  mutation: string,
  variables: Record<string, unknown> = {}
) =>
  await getClient().mutate({
    mutation: gql`
      ${mutation}
    `,
    variables
  })

// Remove undefined values from params
export const removeEmpty = (variables: Record<string, unknown>) => {
  const obj: any = {}
  for (const f in variables) {
    if (variables[f] !== undefined) obj[f] = variables[f]
  }
  return obj
}

// JSON stringify selected fields
export const stringifyFields = <T>(
  variables: Record<string, unknown>,
  fields: string[]
): T => {
  try {
    const obj: any = {}
    for (const f in variables) {
      obj[f] = fields.includes(f) ? stringifyJson(variables[f]) : variables[f]
    }
    return obj
  } catch (e) {
    console.log(e)
  }
}

// JSON parse selected fields
export const parseFields = <T>(
  variables: Record<string, unknown>,
  fields: string[]
): T => {
  const obj: any = {}
  for (const f in variables) {
    obj[f] =
      fields.includes(f) && typeCheck(variables[f]) === 'string'
        ? parseJson(variables[f] as string)
        : variables[f]
  }
  return obj
}

// Parse JSON w error handling
export const parseJson = (data?: string): unknown => {
  try {
    return data ? JSON.parse(data) : data
  } catch (e) {
    throw new InvalidJsonError()
  }
}

// Stringify JSON w error handling
export const stringifyJson = (data: unknown): string => {
  try {
    return JSON.stringify(data)
  } catch (e) {
    throw new InvalidJsonError()
  }
}
