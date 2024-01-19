const Joi = require ('joi')

const produtosSchema = Joi.object({
        usuario: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        administrador: Joi.string(),
    })
export default produtosSchema;