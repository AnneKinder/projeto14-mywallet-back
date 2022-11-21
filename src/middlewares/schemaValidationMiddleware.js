import signupSchema from "../schemas/signupSchema.js";
import signinSchema from "../schemas/signinSchema.js";
import movementSchema from "../schemas/movementSchema.js";

export function signUpValidationMiddleware (req, res, next){
 
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmp: req.body.confirmp
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

export function signinValidationMiddleware (req,res,next){

  
    const validation = signinSchema.validate(req.body, { abortEarly: false });
  
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.status(422).send("Faltam dados para envio.");
      console.log(errors);
      return;
    }
    next()
}

export function movementValidationMiddleware (req,res,next){

  
    const validation = movementSchema.validate(req.body, { abortEarly: false });
  
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.status(422).send("Faltam dados para envio.");
      console.log(errors);
      return;
    }
    next()
}


