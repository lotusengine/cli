//import { GraphQLClient, request } from 'graphql-request'
import { GraphQLClient } from 'kikstart-graphql-client'
import { API_URL, WS_API_URL } from './constants'
import { GraphQLAPIError } from './errors'
export { default as gql } from 'graphql-tag'
import { Agent } from 'https'
import ux from 'cli-ux'

export const UPLOAD_BATCH_SIZE = 25

let client
// Useful for local testing - disables SSL cert errors
const agent = new Agent({
  rejectUnauthorized: false
})

// Create client instance
export const getClient = () => {
  if (!client) {
    client = new GraphQLClient({
      headers: {},

      url: API_URL,
      wsUrl: WS_API_URL
    })
  }
  return client
}

// Perform a GraphQL query
export const doQuery = async (query: any, variables = {}, options = {}) => {
  // const { accountId, apiKey, apiUrl } = options
  const params = {
    agent,
    headers: {
      //   //Authorization
      //   // 'x-api-key': apiKey || process.env.LOTUS_API_KEY,
      //   // 'x-lotus-account-id': accountId || process.env.LOTUS_ACCOUNT_ID
    }
  }

  const client = new GraphQLClient(API_URL, params)

  try {
    const res = await client.request(query, variables)
    // console.log(res)
    // if (res.errors) {
    //   ux.error(res.errors)

    //   //throw new GraphQLAPIError(res.errors)
    // }

    return res
  } catch (e) {
    // ux.error(e.response.errors[0].message)
    if (e.response) throw new GraphQLAPIError(e.response)
    else throw new Error(e)
  }
}

export const flattenNodes = (edges: any) =>
  edges.map(({ node }: any) => ({ ...node }))

// Remove undefined values from params
export const removeEmpty = (fields: any) => {
  const obj = {}
  for (const f in fields) {
    if (fields[f] !== undefined) obj[f] = fields[f]
  }
  return obj
}
