export function validate(schema) { 
    
    return (req, res, next) => {
        const validate = schema.validate(req.body);

        if (validate.error) {
            
            res.status(406).send({
                Error: validate.error.message
            });
        } else {
            next();
        }
    };
}