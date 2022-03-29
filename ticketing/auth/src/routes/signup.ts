import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req, res) => {
    res.send('Hi there!');
});

export { router as signupRouter}; //rename because we have many routers (they can't be the same name)