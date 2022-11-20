import signupSchema from "../schemas/signupSchema.js";

export function signUpValidationMiddleware (req, res, next){

    
    const user = {
        name: name,
        email: email,
        password: passwordHash,
        confirmp: passwordHash,
      };

      const validation = signupSchema.validate(user, { abortEarly: false });
  
      if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        res.status(422).send("Preencha os campos corretamente");
        console.log(errors);
        return;
      }
      
      next()


}