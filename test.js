const open = require('open')

;(async () => {
  const cp = await open('https://sindresorhus.com', {
    app: 'safari',
    wait: false
  })
  cp.on('error', (err) => {
    console.log('ERROR')
    process.exit(1)
  })
  // if (process.env.LOTUSENGINE_TESTING_HEADLESS_LOGIN === '1') showUrl()
  cp.on('close', (code) => {
    if (code !== 0) console.log('ZERO')
    else console.log('OK')
  })
})()
