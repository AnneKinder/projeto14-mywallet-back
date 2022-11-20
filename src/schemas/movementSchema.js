import joi from 'joi';

 const movementSchema = joi.object({
    valor: joi.number().required(),
    descricao: joi.required(),
  });
  

  export default movementSchema
