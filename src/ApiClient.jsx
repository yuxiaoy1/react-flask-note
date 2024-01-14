let BASE_API_URL = import.meta.env.VITE_BASE_API_URL

export default class ApiClient {
  constructor() {
    this.base_url = BASE_API_URL + '/api'
  }

  async request(options) {
    let response = await this._request(options)
    if (response.status === 401 && options.url !== '/tokens') {
      const refreshResponse = await this.put('/tokens', {
        token: localStorage.getItem('token'),
      })
      if (refreshResponse.ok) {
        localStorage.setItem('token', refreshResponse.body.token)
        response = await this._request(options)
      }
    }
    return response
  }

  async _request(options) {
    let { url, method, headers, body, query } = options

    query = new URLSearchParams(query || {}).toString()
    if (query !== '') {
      query = '?' + query
    }

    let response
    try {
      response = await fetch(this.base_url + url + query, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          ...headers,
        },
        credentials: url === '/tokens' ? 'include' : 'omit',
        body: body ? JSON.stringify(body) : null,
      })
    } catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => ({
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        }),
      }
    }

    let { ok, status } = response

    return { ok, status, body: status !== 204 ? await response.json() : null }
  }

  async get(url, query, options) {
    return this.request({ method: 'GET', url, query, ...options })
  }

  async post(url, body, options) {
    return this.request({ method: 'POST', url, body, ...options })
  }

  async put(url, body, options) {
    return this.request({ method: 'PUT', url, body, ...options })
  }

  async delete(url, options) {
    return this.request({ method: 'DELETE', url, ...options })
  }

  async login(username, password) {
    let response = await this.post('/tokens', null, {
      headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password),
      },
    })
    if (!response.ok) {
      return response.status === 401 ? 'fail' : 'error'
    }
    localStorage.setItem('token', response.body.token)
    return 'ok'
  }

  async logout() {
    await this.delete('/tokens')
    localStorage.removeItem('token')
  }

  isAuthenticated() {
    return localStorage.getItem('token') !== null
  }
}
