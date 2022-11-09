const Client = require("pg").Client;
const connectionData = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASS,
    port: +(process.env.POSTGRES_PORT || "5432"),
};
console.log("connectionData", connectionData);
const client = new Client(connectionData);
module.exports = {
    init: async function () {
        await client.connect();
        console.log("conexion postgres inicializada");
    },
    close: async function () {
        await client.end();
        console.log("conexion postgres finalizada");
    },
    methods: {
        // AFILIADO
        // CREATE - CREAR
        "afiliado.create": async function (
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
        ) {
            const sql =
                "insert into afiliado (afl_tipoidentidad, afl_nroidentidad, afl_nombre, afl_nomcomercial,afl_direccion,afl_ubigeo,afl_nombrecontacto,afl_telefonocontacto,afl_emailcontacto,afl_estado,afl_fechaactivo,afl_fechainactivo) " +
                "values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)";
            const result = await client.query(sql, [
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
            ]);
            return result;
        },
        // GET ALL - LISTAR
        "afiliado.getall": async function () {
            try {
                const sql = 'select * from "afiliado"';
                const result = await client.query(sql);
                return result.rows;
            } catch (error) {
                console.error(error);
            }
        },
        // UPDATE - EDITAR
        "afiliado.update": async function (
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
            afl_fechainzactivo,
            afl_id,
        ) {
            try {
                const sql = 'UPDATE afiliado set afl_tipoidentidad=$1, afl_nroidentidad=$2, afl_nombre=$3, afl_nomcomercial=$4 ,afl_direccion=$5, afl_ubigeo=$6, afl_nombrecontacto=$7, afl_telefonocontacto=$8,afl_emailcontacto=$9,afl_estado=$10,afl_fechaactivo=$11,afl_fechainactivo=$12' +
                    "where afl_id=$13";
                const result = await client.query(sql, [
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
                    afl_fechainzactivo,
                    afl_id,
                ]);
                return result;
            } catch (error) {
                console.error("chale");
            }
        },
        // GET BY ID - obtener
        "afiliado.getbyid": async function (afl_id) {
            const sql = "Select * from afiliado where afl_id = $1";
            const result = await client.query(sql, [afl_id]);
            return result.rows;
        },
        // DELETE BY ID - ELIMINAR
        "afiliado.delete": async function (afl_id) {
            const sql = "DELETE FROM afiliado WHERE afl_id = $1";
            const result = await client.query(sql, [afl_id]);
            return result;
        },

 //   /*
            // USUARIOS
        // CREATE - CREAR
        "usuario.create": async function (
            usr_afl_id,
            usr_login,
            usr_password,
            usr_estado
        ) {
            const sql =
                "insert into usuario (usr_afl_id, usr_login, usr_password, usr_estado) " +
                "values ($1,$2,$3,$4)";
            const result = await client.query(sql, [
                usr_afl_id,
                usr_login,
                usr_password,
                usr_estado
            ]);
            return result;
        },
        // GET BY ID - obtener
        "usuario.getbyid": async function (usr_id) {
            const sql = "Select * from usuario where usr_id = $1";
            const result = await client.query(sql, [usr_id]);
            return result.rows;
        },
        // GET ALL - LISTAR
        "usuario.getall": async function () {
            try {
                const sql = 'select * from "usuario"';
                const result = await client.query(sql);
                return result.rows;
            } catch (error) {
                console.error(error);
            }
        },
 //       */
    },
    
};

/*
{
    "afl_tipoidentidad": "DNI",
    "afl_nroidentidad": "76576545",
    "afl_nombre": "BancoI",
    "afl_nomcomercial": "BI", 
    "afl_direccion": "Av.Central", 
    "afl_ubigeo": "543765" ,
    "afl_nombrecontacto": "Arentado", 
    "afl_telefonocontacto": "987876765", 
    "afl_emailcontacto": "Bi@Bi.com",
    "afl_estado": "activo", 
    "afl_fechaactivo": "2022-10-11", 
    "afl_fechainzactivo": "2022-10-11", 
}
*/