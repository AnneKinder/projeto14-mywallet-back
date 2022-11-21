import joi from "joi";

const movementSchema = joi.object({
  valor: joi.number().required(),
  descricao: joi.required(),
  data: joi.required(),
  type: joi.required(),
  email: joi.required(),
});

export default movementSchema;
