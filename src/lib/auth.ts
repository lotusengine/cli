import ux from 'cli-ux'
import netrc from 'netrc-parser'
import open from 'open'
import WebSocket from 'ws'
import { HOST, WS_API_URL } from './constants'
import chalk from 'chalk'

export type Message = MessageAuth | MessageInit | MessageLogout

export interface MessageInit {
  action: 'init'
  params: {
    url: string
  }
}

export interface MessageAuth {
  action: 'auth'
  params: {
    email: string
    token: string
  }
}

export interface MessageLogout {
  action: 'logout'
  params: {
    success: boolean
  }
}

interface NetrcEntry {
  login: string
  password: string
}

interface RequestTokenParams {
  browser?: string
}

let ws: WebSocket | undefined = undefined

// Request an auth token
export async function requestToken(params: RequestTokenParams): Promise<void> {
  let loggedIn = false
  try {
    // timeout after 10 minutes
    setTimeout(() => {
      if (!loggedIn) ux.error('Timed out')
    }, 1000 * 60 * 10).unref()

    // Ensure no api key as it will take precedence
    if (process.env.LOTUSENGINE_API_KEY)
      ux.error('Cannot log in with LOTUSENGINE_API_KEY set')

    // Open connection and listen
    await doListen(params)

    // Clear previous creds if any
    await netrc.load()
    const previousEntry = netrc.machines[HOST]

    if (previousEntry && previousEntry.password)
      await revokeToken(previousEntry.password)

    try {
      await ux.anykey(
        `Press any key to open up the browser to login or ${chalk.yellow(
          'q'
        )} to exit`
      )
    } catch (_) {
      ux.info('Exiting...')
      process.exit(0)
    }

    // Request login
    await sendMessage('login')
  } catch (err) {
    throw new Error(err)
  } finally {
    loggedIn = true
  }
}

// Logout of app
export async function revokeToken(token: string) {
  if (!token) return
  await sendMessage('logout', { token })
}

// Send a WS message
export const sendMessage = async (action: string, data: any = {}) => {
  const ws = await getConnection()
  ws.send(
    JSON.stringify({
      action,
      data
    })
  )
}

// Parse WS message data
const getMessage = (data: WebSocket.Data): Message => {
  try {
    return JSON.parse(String(data))
  } catch (e) {
    throw new Error('Invalid ws message data')
  }
}

// Listen to WS messages
const doListen = async (params: RequestTokenParams): Promise<WebSocket> => {
  const { browser } = params

  const ws = await getConnection()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  ws.on('error', (err: Error): void => {
    ux.warn(err)
  })

  ws.on(
    'message',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    async (data: WebSocket.Data): Promise<void> => {
      const message = getMessage(data)

      console.log(message)

      switch (message.action) {
        case 'init':
          {
            const { url } = message.params
            ux.info(`Opening browser to ${url}`)
            const app = await open(url, {
              app: { name: browser! },
              wait: false
            })
            app.on('error', (_) => {
              ux.warn('Cannot open browser')
            })
            ux.action.start('Waiting for login', 'Intializing', {
              stdout: true
            })
          }
          break
        case 'auth':
          {
            const { token, email } = message.params

            await saveToken({ login: email, password: token })
            await closeConnection()
            ux.action.stop(`Done! You're logged in`)
          }
          break
        case 'logout': {
          ux.info('Logged out')
          ux.action.stop()
        }
      }
    }
  )
  return ws
}

// Open a web socket connection
const getConnection = async (): Promise<WebSocket> | never => {
  if (ws) return ws

  return new Promise((resolve, reject) => {
    const connection = new WebSocket(WS_API_URL)

    connection.on('open', () => {
      ws = connection
      resolve(ws)
    })
    connection.on('close', () => {})
    connection.on('error', (e) => {
      reject(e)
    })
  })
}

const closeConnection = async (): Promise<void> => {
  const c = await getConnection()
  c.close()
}

// Save creds to local machine
const saveToken = async (entry: NetrcEntry): Promise<void> => {
  const hosts = [HOST]
  hosts.forEach((host) => {
    if (!netrc.machines[host]) netrc.machines[host] = {}
    netrc.machines[host].login = entry.login
    netrc.machines[host].password = entry.password
    delete netrc.machines[host].method
    delete netrc.machines[host].org
  })
  if (netrc.machines._tokens) {
    ;(netrc.machines._tokens as any).forEach((token: any) => {
      if (hosts.includes(token.host)) {
        token.internalWhitespace = '\n  '
      }
    })
  }
  await netrc.save()
}
