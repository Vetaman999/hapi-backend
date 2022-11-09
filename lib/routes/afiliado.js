const Joi = require("joi");
const bcrypt = require("bcrypt");

async function register(server, options) {
    const storage = options.storage;
    // AFILIADO
    server.route([
        // GET ALL - LISTAR A TODOS
        {
            method: "GET",
            path: "/afiliado/getall",
            options: {
                cors: true,
                handler: async function (request, reply) {
                    try {
                        const result = await storage.execute('afiliado.getall')
                        return reply.response(result).code(200)
                    } catch (error) {
                        return reply.response(error).code(401)
                    }
                }
            }
        },
        // GET BY ID - OBTENER
        {
            method: "GET",
            path: "/afiliado/getbyid/{afl_id}",
            options: {
                cors: {
                    maxAge: 60,
                    credentials: true,
                },
                handler: async function (request, _reply) {
                    const afl_id = request.params.afl_id;
                    const result = await storage.execute("afiliado.getbyid", afl_id);
                    return result;
                },
            },
        },
        // CREATE
        {
            method: "POST",
            path: "/afiliado/create",
            options: {
                cors: true,
                handler: async function (request, reply) {
                    try {
                        const data = Joi.object({
                            afl_tipoidentidad: Joi.string().min(1).required().messages({
                                "string.min": "El campo no puede estar vacío",
                            }),
                            afl_nroidentidad: Joi.number().required().messages({
                                number: `No es un número de identidad`,
                            }),
                            afl_nombre: Joi.string().min(1).required().messages({
                                "string.min": "El campo no puede estar vacío",
                            }),
                            afl_nomcomercial: Joi.string().min(3).max(50).required().messages({
                                "string.min": `La longitud del Nombre Comercial es de mínimo 3 caracteres`,
                                "string.empty": "El campo Nombre Comercial está vacío",
                                "string.max":
                                    "La longitud del Nombre Comercial es máximo 50 caracteres",
                            }),
                            afl_direccion: Joi.string().min(3).max(50).required().messages({
                                "string.min": `La longitud de la dirección es de mínimo 3 caracteres`,
                                "string.empty": "El campo dirección está vacío",
                                "string.max": "La longitud del dirección es máximo 50 caracteres",
                            }),
                            afl_ubigeo: Joi.string().min(3).max(50).required().messages({
                                "string.min": `La longitud del Ubigeo es de mínimo 3 caracteres`,
                                "string.empty": "El campo Ubigeo está vacío",
                                "string.max": "La longitud del Ubigeo es máximo 2 caracteres",
                            }),
                            afl_nombrecontacto: Joi.string().min(3).max(50).required().messages({
                                "string.min": `La longitud del nombre del contacto es de mínimo 3 caracteres`,
                                "string.empty": "El campo nombre del contacto está vacío",
                                "string.max": "La longitud del nombre del contacto es máximo 15 caracteres",
                            }),
                            afl_telefonocontacto: Joi.string().min(3).max(50).required().messages({
                                "string.min": `La longitud del Telefono es de mínimo 3 caracteres`,
                                "string.empty": "El campo Telefono está vacío",
                            }),
                            afl_emailcontacto: Joi.string()
                                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                                .messages({
                                    "string.email": "El formato de email no es adecuado",
                                }),
                            afl_estado: Joi.string(),
                        });
                        const {
                            afl_tipoidentidad,
                            afl_nroidentidad,
                            afl_nombre,
                            afl_nomcomercial,
                            afl_direccion,
                            afl_ubigeo,
                            afl_nombrecontacto,
                            afl_telefonocontacto,
                            afl_emailcontacto,
                            afl_estado,
                            afl_fechaactivo,
                            afl_fechainactivo,
                        } = request.payload;
                        await data.validateAsync({
                            afl_tipoidentidad: afl_tipoidentidad,
                            afl_nroidentidad: afl_nroidentidad,
                            afl_nombre: afl_nombre,
                            afl_nomcomercial: afl_nomcomercial,
                            afl_direccion: afl_direccion,
                            afl_ubigeo: afl_ubigeo,
                            afl_nombrecontacto: afl_nombrecontacto,
                            afl_telefonocontacto: afl_telefonocontacto,
                            afl_emailcontacto: afl_emailcontacto,
                            afl_estado: afl_estado,
                        });
                        const result = await storage.execute(
                            "afiliado.create",
                            afl_tipoidentidad,
                            afl_nroidentidad,
                            afl_nombre,
                            afl_nomcomercial,
                            afl_direccion,
                            afl_ubigeo,
                            afl_nombrecontacto,
                            afl_telefonocontacto,
                            afl_emailcontacto,
                            afl_estado,
                            afl_fechaactivo,
                            afl_fechainactivo,
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
            path: "/afiliado/update/{afl_id}",
            options: {
                cors: true,
                handler: async function (request, reply) {
                    try {
                        const afl_id = request.params.afl_id;
                        const {
                            afl_tipoidentidad,
                            afl_nroidentidad,
                            afl_nombre,
                            afl_nomcomercial,
                            afl_direccion,
                            afl_ubigeo,
                            afl_nombrecontacto,
                            afl_telefonocontacto,
                            afl_emailcontacto,
                            afl_estado,
                            afl_fechaactivo,
                            afl_fechainactivo,
                        } = request.payload;

                        const result = await storage.execute(
                            "afiliado.update",
                            afl_tipoidentidad,
                            afl_nroidentidad,
                            afl_nombre,
                            afl_nomcomercial,
                            afl_direccion,
                            afl_ubigeo,
                            afl_nombrecontacto,
                            afl_telefonocontacto,
                            afl_emailcontacto,
                            afl_estado,
                            afl_fechaactivo,
                            afl_fechainactivo,
                            afl_id,
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
            path: "/afiliado/delete/{afl_id}",
            options: {
                handler: async function (request, _reply) {
                    const afl_id = request.params.afl_id;
                    const result = await storage.execute("afiliado.delete", afl_id);
                    return result;
                },
            },
        }
    ])
}

module.exports = {
    name: "plugins.router.afiliado",
    version: "1.0.0",
    register: register,
};

