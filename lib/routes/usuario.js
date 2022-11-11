const Joi = require("joi");
const bcrypt = require("bcrypt");

async function register(server, options) {
    const storage = options.storage;
    // USER
    server.route([
        // GET ALL - LISTAR A TODOS
        {
            method: "GET",
            path: "/usuario/getall",
            options: {
                cors: true,
                handler: async function (request, reply) {
                    try {
                        const result = await storage.execute('usuario.getall')
                        return reply.response(result).code(200)
                    } catch (error) {
                        return reply.response(error).code(401)
                    }
                }
            }
        },
        // GET BY ID - OBTENER POR EL ID
        {
            method: "GET",
            path: "/usuario/getbyid/{usr_id}",
            options: {
                cors: {
                    maxAge: 60,
                    credentials: true,
                },
                handler: async function (request, _reply) {
                    const usr_id = request.params.usr_id;
                    const result = await storage.execute("usuario.getbyid", usr_id);
                    return result;
                },
            },
        },
        // CREATE - CREAR
        {
            method: "POST",
            path: "/usuario/create",
            options: {
                cors: true,
                handler: async function (request, reply) {
                    try {
                        const data = Joi.object({
                            usr_login: Joi.string().min(5).max(20).required().messages({
                                "string.min": `El login es de mínimo 5 caracteres`,
                                "string.empty": "El login está vacío",
                                "string.max": "La login es máximo 20 caracteres",
                            }),
                            usr_password: Joi.string()
                                .pattern(new RegExp("^[a-zA-Z0-9!@#$%&*.]{3,30}$"))
                                .required()
                                .messages({
                                    "string.empty": "El campo contraseña está vacío",
                                    "string.pattern.base":
                                        "Contraseña no cumple con los parámetros establecidos",
                                }),
                            usr_estado: Joi.string(),
                        });
                        const {
                            usr_afl_id,
                            usr_login,
                            usr_password,
                            usr_estado,
                        } = request.payload;

                        const nick = await storage.execute("usuario.getbylogin",usr_login);
                          if (nick.length > 0)
                            return reply
                              .response(`El usuario ${nick[0].usr_login} ya existe`)
                              .code(401);
                        console.log("------------");


                        await data.validateAsync({
                            usr_login: usr_login,
                            usr_password: usr_password,
                            usr_estado: usr_estado,
                        });
                        const hashedPassword = await bcrypt.hash(usr_password, 10);
                        const result = await storage.execute(
                            "usuario.create",
                            usr_afl_id,
                            usr_login,
                            usr_password,
                            usr_estado,
                        );
                        return result;
                    } catch (error) {
                        console.log(error.details[0].message);
                        return reply.response(error.details[0].message).code(401);
                    }
                }
            }
        },
        // UPDATE - EDITAR POR ID
        {
            method: "PUT",
            path: "/usuario/update/{usr_id}",
            options: {
                cors: true,
                handler: async function (request, reply) {
                    try {
                        const usr_id = request.params.usr_id;
                        const {
                            usr_afl_id,
                            usr_login,
                            usr_password,
                            usr_estado,
                        } = request.payload;

                        const result = await storage.execute(
                            "usuario.update",
                            usr_afl_id,
                            usr_login,
                            usr_password,
                            usr_estado,
                            usr_id,
                        );
                        return result;
                    } catch (error) {
                        return reply.response(error.details[0].message).code(401);
                    }
                },
            }
        },
        // DELETE - ELIMINAR POR ID
        {
            method: "DELETE",
            path: "/usuario/delete/{usr_id}",
            options: {
                handler: async function (request, _reply) {
                    const usr_id = request.params.usr_id;
                    const result = await storage.execute("usuario.delete", usr_id);
                    return result;
                },
            },
        },
    ])
}

module.exports = {
    name: "plugins.router.usuario",
    version: "1.0.0",
    register: register,
};

