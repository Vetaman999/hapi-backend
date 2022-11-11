const pino = require('pino')
const loggerOptions = {
  timestamp: () => `,"@timestamp":"${new Date(Date.now()).toISOString()}"`,
  messageKey: 'message',
  mixin() {
    return {
      logger: 'X-Documents',
      metadata: {}
    }
  },
  formatters: {
    level(level) {
      return { level: level.toUpperCase() }
    },
  },

  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}

const logger = pino(loggerOptions)
logger.info('NODE_ENV %s', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
  logger.info('Cargando archivo de variables de entorno DUMMY')
  require('dotenv').config({ path: './default.env' })
}


const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')



const PORT = process.argv[2];
if (!PORT) {
  logger.info('PORT es requerido')
}
const K = require('./lib/constants')
const { host } = require('pg/lib/defaults')
const fs = require('fs')
const storage = require('./lib/storage').getStorage('postgresql', K.ALLOWED_SERVICES)

init().catch(function (err) { console.log(err) })
async function init() {
  await storage.init()
  const oArgs = {
    port: PORT,
    // host:'localhost',
    state: {
      isSameSite: 'None',
      isSecure: true,
    },
    routes: {
      cors: {
        origin: ['*'],
        headers: ["Accept", "X-PINGOTHER", "Content-Type", "Authorization", "Access-Control-Allow-Credentials", 'Access-Control-Allow-Headers', 'Access-Control-Expose-Headers'], // an array of strings - 'Access-Control-Allow-Headers'
        exposedHeaders: ['Accept', 'Access-Control-Expose-Headers'],
        additionalExposedHeaders: ['Accept', "X-Requested-With"],
        maxAge: 60,
        credentials: true,

      }
    }


  }
  console.error('acabo de deshabilitar esto')
  if (process.env.NODE_ENV !== 'production') {
    oArgs.tls = {
      key: await fs.promises.readFile('./resources/95907154_localhost.key', 'utf8'),
      cert: await fs.promises.readFile('./resources/95907154_localhost.cert', 'utf8')
    }
  }
  const hapiServer = new Hapi.Server(oArgs)

  await hapiServer.register([
    Inert,
    Vision,
    {
      plugin: require('./lib/routes/afiliado.js'),
      options: {
        storage: storage,
        json: JSON
      }
    },
    {
      plugin: require('./lib/routes/usuario.js'),
      options: {
        storage: storage,
        json: JSON
      }
    },
    {
      plugin: require('./lib/routes/demo.js'),
      options: {
        storage: storage,
        json: JSON
      }
    },
  ])
  await hapiServer.start()
  logger.info(`Server running at: ${hapiServer.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})
process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})