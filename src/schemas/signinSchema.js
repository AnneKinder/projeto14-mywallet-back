import joi from 'joi'

const signinSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: joi.required(),
  });


  export default signinSchema