const oHandlers = {
  postgresql: require('./database.js')
}
function Storage (oMethods) {
  this.execute = async function (args) {
    const aArgs = Array.from(arguments)
    const sMethod = aArgs.shift()
    if (!oMethods.methods[sMethod]) {
      throw new Error('Metodo no definido => ' + sMethod)
    }
    console.log('Ejecutando metodo', sMethod)
    return oMethods.methods[sMethod].apply(null, aArgs)
  }
  this.init = async function () {
    return oMethods.init()
  }
  this.close = async function () {
    return oMethods.close()
  }
}
// yo necesito llamar a un metodo, llamar a una bd, execute('bla')
module.exports = {
  getStorage: function (db, asActions) {
    if (!oHandlers[db]) {
      throw new Error('DB no soportada => ' + db)
    }
    const oDbHandler = oHandlers[db]
    if (!oDbHandler.init) {
      throw new Error('DBHandler no implementa init()')
    }
    if (!oDbHandler.close) {
      throw new Error('DBHandler no implementa close()')
    }
    if (!oDbHandler.methods) {
      throw new Error('DBHandler no implementa methods()')
    }
    const keys = Object.keys(oDbHandler.methods)
    for (let i = 0, l = keys.length; i < l; ++i) {
      if (asActions.indexOf(keys[i]) === -1) {
        throw new Error('Metodo no soportado => ' + keys[i])
      }
    }
    return new Storage(oDbHandler)
  }
}
