export function validate(schema) { 
    
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(406).send({

                message: error.message
            });
        } else {
            next();
        }
    };
}