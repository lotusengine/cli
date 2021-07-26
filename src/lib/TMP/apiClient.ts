import * as Config from '@oclif/config'
import { CLIError, warn } from '@oclif/errors'
import netrc from 'netrc-parser'
import cli = require('cli-ux')
import * as url from 'url'
import axios, { AxiosInstance } from 'axios'
import { Login } from './auth'
import { RequestId, requestIdHeader } from './requestId'
import { API_HOST, API_URL } from './constants'

export namespace APIClient {
  export interface Options extends HTTPRequestOptions {
    retryAuth?: boolean
  }
}

export interface IOptions {
  required?: boolean
  preauth?: boolean
}

export interface ILotusEngineAPIErrorOptions {
  resource?: string
  app?: { id: string; name: string }
  id?: string
  message?: string
  url?: string
}

export class LotusEngineAPIError extends CLIError {
  http: HTTPError
  body: ILotusEngineAPIErrorOptions

  constructor(httpError: HTTPError) {
    if (!httpError) throw new Error('invalid error')
    let options: ILotusEngineAPIErrorOptions = httpError.body
    if (!options || !options.message) throw httpError
    let info = []
    if (options.id) info.push(`Error ID: ${options.id}`)
    if (options.app && options.app.name) info.push(`App: ${options.app.name}`)
    if (options.url) info.push(`See ${options.url} for more information.`)
    if (info.length) super([options.message, ''].concat(info).join('\n'))
    else super(options.message)
    this.http = httpError
    this.body = options
  }
}

export class APIClient {
  http: AxiosInstance
  private readonly _login = new Login(this.config, this)
  private _auth?: string

  static trackRequestIds<T>(response: any) {
    const responseRequestIdHeader = response.headers[requestIdHeader]
    if (responseRequestIdHeader) {
      const requestIds = Array.isArray(responseRequestIdHeader)
        ? responseRequestIdHeader
        : responseRequestIdHeader.split(',')
      RequestId.track(...requestIds)
    }
  }

  constructor(protected config: Config.IConfig, public options: IOptions = {}) {
    this.config = config
    if (options.required === undefined) options.required = true
    options.preauth = options.preauth !== false
    this.options = options
    let apiUrl = url.URL ? new url.URL(API_URL) : url.parse(API_URL)
    let envHeaders = JSON.parse(process.env.LOTUSENGINE_HEADERS || '{}')
    let self = this as any
    const opts = {
      host: apiUrl.hostname,
      port: apiUrl.port,
      protocol: apiUrl.protocol,
      headers: {
        accept: 'application/vnd.lotusengine+json; version=3',
        'user-agent': `lotusengine-cli/${self.config.version} ${self.config.platform}`,
        ...envHeaders
      }
    }

    this.http = axios.create({
      baseURL: 'https://some-domain.com/api/',
      timeout: 1000,
      headers: { 'X-Custom-Header': 'foobar' }
    })

    const OLDhttp = class APIHTTPClient<T> extends deps.HTTP.HTTP.create(
      opts
    )<T> {
      static trackRequestIds<T>(response: HTTP<T>) {
        const responseRequestIdHeader = response.headers[requestIdHeader]
        if (responseRequestIdHeader) {
          const requestIds = Array.isArray(responseRequestIdHeader)
            ? responseRequestIdHeader
            : responseRequestIdHeader.split(',')
          RequestId.track(...requestIds)
        }
      }

      static async request<T>(
        url: string,
        opts: APIClient.Options = {},
        retries = 3
      ): Promise<APIHTTPClient<T>> {
        opts.headers = opts.headers || {}
        opts.headers[requestIdHeader] =
          RequestId.create() && RequestId.headerValue

        if (
          !Object.keys(opts.headers).find(
            (h) => h.toLowerCase() === 'authorization'
          )
        ) {
          opts.headers.authorization = `Bearer ${self.auth}`
        }
        retries--
        try {
          const response = await super.request<T>(url, opts)
          this.trackRequestIds<T>(response)
          return response
        } catch (err) {
          if (!(err instanceof deps.HTTP.HTTPError)) throw err
          if (retries > 0) {
            if (
              opts.retryAuth !== false &&
              err.http.statusCode === 401 &&
              err.body.id === 'unauthorized'
            ) {
              if (process.env.LOTUSENGINE_API_KEY) {
                throw new Error(
                  'The token provided to LOTUSENGINE_API_KEY is invalid. Please double-check that you have the correct token, or run `lotusengine login` without LOTUSENGINE_API_KEY set.'
                )
              }
              await self.login()
              opts.headers.authorization = `Bearer ${self.auth}`
              return this.request<T>(url, opts, retries)
            }
          }
          throw new LotusEngineAPIError(err)
        }
      }
    }
  }

  get auth(): string | undefined {
    if (!this._auth) {
      if (process.env.LOTUSENGINE_API_TOKEN && !process.env.LOTUSENGINE_API_KEY)
        warn(
          'LOTUSENGINE_API_TOKEN is set but you probably meant LOTUSENGINE_API_KEY'
        )
      this._auth = process.env.LOTUSENGINE_API_KEY
      if (!this._auth) {
        netrc.loadSync()
        this._auth =
          netrc.machines[API_HOST] && netrc.machines[API_HOST].password
      }
    }
    return this._auth
  }
  set auth(token: string | undefined) {
    this._auth = token
  }

  // preauth(app: string, factor: string) {
  //   return this.put(`/apps/${app}/pre-authorizations`, {
  //     headers: { 'Lotusengine-Two-Factor-Code': factor }
  //   })
  // }
  // get<T>(url: string, options: APIClient.Options = {}) {
  //   return this.http.get<T>(url, options)
  // }
  // post<T>(url: string, options: APIClient.Options = {}) {
  //   return this.http.post<T>(url, options)
  // }
  // put<T>(url: string, options: APIClient.Options = {}) {
  //   return this.http.put<T>(url, options)
  // }
  // patch<T>(url: string, options: APIClient.Options = {}) {
  //   return this.http.patch<T>(url, options)
  // }
  // delete<T>(url: string, options: APIClient.Options = {}) {
  //   return this.http.delete<T>(url, options)
  // }
  // stream(url: string, options: APIClient.Options = {}) {
  //   return this.http.stream(url, options)
  // }
  // request<T>(url: string, options: APIClient.Options = {}) {
  //   return this.http.request<T>(url, options)
  // }
  // login(opts: Login.Options = {}) {
  //   return this._login.login(opts)
  // }
  // async logout() {
  //   try {
  //     await this._login.logout()
  //   } catch (err) {
  //     warn(err)
  //   }
  //   delete netrc.machines['api.lotusengine.com']
  //   await netrc.save()
  // }
  // get defaults(): typeof HTTP.defaults {
  //   return this.http.defaults
  // }
}
