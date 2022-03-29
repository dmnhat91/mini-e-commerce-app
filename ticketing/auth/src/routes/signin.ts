import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
    res.send('Hi there!');
});

export { router as signinRouter}; //rename because we have many routers (they can't be the same name)