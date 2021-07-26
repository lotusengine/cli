import { ApolloClient, InMemoryCache } from '@apollo/client'
import {
  API_HOST,
  API_URL,
  LOTUSENGINE_ACCOUNT_ID,
  LOTUSENGINE_API_KEY
} from './constants'
import netrc from 'netrc-parser'
import ux from 'cli-ux'

export const getHeaders = (): Record<string, string> => {
  if (!LOTUSENGINE_ACCOUNT_ID) ux.error('No account ID provided')
  const headers = {
    'X-Account-Id': LOTUSENGINE_ACCOUNT_ID
  }
  if (LOTUSENGINE_API_KEY) headers['X-Api-Key'] = LOTUSENGINE_API_KEY
  else {
    netrc.loadSync()
    const token = netrc.machines[API_HOST] && netrc.machines[API_HOST].password
    if (!token) ux.error('Please login first')
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const getClient = () => {
  return new ApolloClient({
    uri: API_URL,
    headers: getHeaders(),
    cache: new InMemoryCache()
  })
}
