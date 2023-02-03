
import dotenv from 'dotenv';
import  Jwt  from 'jsonwebtoken';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = (token)=>{
    try {
        const verify = Jwt.verify(token,JWT_SECRET);
        if(verify){ return true;}
        else{return false};
    } catch (error) {
        return false;
    }
}

export default verifyToken