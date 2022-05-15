import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    if (!req.session?.jwt) { // if (!req.session || !req.session.jwt){ //if cookie session is not set OR the jwt field of the session when the session is set is null
        return res.send({currentUser: null});
    }

    try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    res.send({currentUser: payload});
    } catch (err){
        res.send({currentUser: null});
    }
});

export { router as currentUserRouter}; //rename because we have many routers (they can't be the same name)