import joi from "joi";

const signupSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: joi.required(),
  confirmp: joi.required(),
});

export default signupSchema;
