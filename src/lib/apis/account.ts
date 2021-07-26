import { doQuery } from '../../lib/query'

const options = {
  apiKey: process.env.LOTUS_ADMIN_API_KEY,
  apiUrl: process.env.LOTUS_ADMIN_API_URL
}

export const listAccounts = async () => {
  const query = `query Accounts($after: String, $limit: Int) {
    accounts(limit: $limit, after: $after) {
      nodes {
        id
        label        
      }
      nextToken
    }
  }  
`
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'accounts' does not exist on type 'unknow... Remove this comment to see the full error message
  const { accounts } = await doQuery(query)

  return accounts.nodes
}

export const findAccount = async (id: any) => {
  const query = `query Account($id: ID!) {
    account(id: $id) {
      id    
      label
      isActive
      createdAt
      permissions {
        userId
        permission
      }
    }
  }`

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'account' does not exist on type 'unknown... Remove this comment to see the full error message
  const { account } = await doQuery(query, { id }, options)
  return account
}
