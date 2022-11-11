var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function jwtTokens({ usr_id, usr_afl_id, usr_login, usr_password, usr_estado }) {
    const user = { usr_id, usr_afl_id, usr_login, usr_password, usr_estado };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' })
    return ({ accessToken, refreshToken })
}

function authenticateToken(req, res) {

    var resp = true
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {

        resp = false
        return res.response('No se encuentra logueado').code(401).takeover()
    }
    return new Promise(function (resolve, reject) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {

            if (error) {
                console.log('Nunca entré')
                resp = false
                return resolve(res.response(null).code(403).takeover())
            }
            req.user = user;
            if (resp) return resolve('Éxito')
            else resolve(null)
        })
    })

}

async function register(server, options) {
    const storage = options.storage
    server.route([
        {
            method: 'POST',
            path: '/login',
            options: {
                handler: async function (request, reply) {
                    try {
                        const { usr_login, usr_password } = request.payload
                        const login = await storage.execute('usuario.getbylogin', usr_login)
                        console.log(usr_login)
                        if (login.length === 0) {
                            console.log('Nick incorrect')
                            const r = { error: true, error_msg: 'Nick incorrect', error_code: 'ERR_NICK_INCORRECT', data: null }
                            return reply.response('Nick incorrect').code(401).takeover()
                        }
                        console.log(usr_login)
                        console.log(login.password)
                        const validPassword = await bcrypt.compare(usr_password, login[0].password);
                        if (!validPassword) {
                            console.log('Password incorrect')
                            return reply.response('Incorrect Password').code(401)
                        }
                        let tokens = jwtTokens(login[0])
                        reply.state('refresh_token', tokens.refreshToken, {
                            httpOnly: true,
                        })
                        reply.response(tokens)
                        return reply.response(tokens)
                    } catch (error) {
                        return reply.response(error.details[0].message).code(401)
                    }
                }
            }
        },
        // REFRESH TOKEN
        {
            method: 'GET',
            path: '/refresh_token',
            options: {
                cors: {
                    maxAge: 60,
                    credentials: true
                },
                handler: async function (request, reply) {
                    // console.log(request.state)
                    // console.log(request.state.refresh_token)
                    // console.log(request.headers.cookie.split('=')[1])

                    // const refreshToken = request.state.refresh_token.split('=')[1]
                    const refreshToken = request.state.refresh_token
                    if (refreshToken === null) return reply.response({ error: 'Null refresh token' }).code(401)
                    let resp = null
                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
                        if (error) {
                            resp = 'jwt expired'
                            console.log(error)
                            return reply.response({ error: error.message }).code(403)
                        }
                        let tokens = jwtTokens(user)
                        // console.log('tokens',tokens)
                        reply.state('refresh_token', tokens.refreshToken, { httpOnly: true })
                        // console.log(request.state)
                        reply.response(tokens)
                        resp = reply.response(tokens)
                    })
                    return resp
                }
            }
        },
        // DELETE TOKEN
        {
            method: 'DELETE',
            path: '/refresh_token',
            options: {
                cors: {
                    maxAge: 60,
                    credentials: true
                },
                handler: async function (request, reply) {
                    // console.log(request.headers.cookie.split('=')[1])
                    console.log('state', request.state)
                    return reply.response({ message: 'refresh token deleted' }).unstate('refresh_token')
                }
            }
        },
    ])
}

module.exports = {
    name: "plugins.router.demo",
    version: '1.0.0',
    register: register
},
    module.exports.authenticateToken = authenticateToken
module.exports.jwtTokens = jwtTokens