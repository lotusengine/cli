import { doQuery } from '../../lib/query'

const options = {
  apiKey: process.env.LOTUS_ADMIN_API_KEY,
  apiUrl: process.env.LOTUS_ADMIN_API_URL
}

export const listUsers = async () => {
  const query = `query Users($after: String, $limit: Int) {
    users(limit: $limit, after: $after) {
      nodes {
        id
        emailAddress        
      }
      nextToken
    }
  }  
`
  const { users } = await doQuery(query)

  return users.nodes
}

export const findUser = async (id: any) => {
  const query = `query User($id: ID, $emailAddress: String) {
    user(id: $id, emailAddress: $emailAddress ) {
      id    
      emailAddress
      isActive
      createdAt
     
    }
  }`
  //  userStatus
  //       accounts {
  //         accountID
  //         permission
  //         isActive
  //        }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'unknown'.
  const { user } = await doQuery(query, { id }, options)
  return user
}
