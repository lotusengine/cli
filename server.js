/* eslint-disable no-undef */
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    //console.log(JSON.stringify(message, null, 2))
    const { data, action } = JSON.parse(message)

    console.log('received: %s', action)

    switch (action) {
      case 'logout':
        {
          ws.send(
            JSON.stringify({
              type: 'logout',
              params: {}
            })
          )
        }
        break

      case 'login':
        {
          console.log('Sending login action')
          ws.send(
            JSON.stringify({
              type: 'init',
              params: {
                token: '123',
                url: 'https://duckduckgo.com'
              }
            })
          )

          setTimeout(() => {
            ws.send(
              JSON.stringify({
                type: 'auth',
                params: {
                  email: 'foo@here.com',
                  token: '7a76d290-8101-11eb-b385-95f111bd6448'
                }
              })
            )
          }, 2000)
        }
        break
    }
  })

  // ws.send(
  //   JSON.stringify({
  //     token: '123',
  //     url: 'https://duckduckgo.com'
  //   })
  // )

  // setTimeout(() => {
  //   ws.send(
  //     JSON.stringify({
  //       type: 'auth',
  //       data: {
  //         token: 'asdsadas'
  //       }
  //     })
  //   )
  // }, 4000)
})
