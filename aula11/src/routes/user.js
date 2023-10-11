const express = require('express');
const {validSecurity, generateJwt, validateJwt} = require('../security/security');
const User = require('../entity/User');
const jwt = require('jsonwebtoken')

const secret = "secret"

const router = express.Router();

const validateEmail = async(req, res, next) => {
    const body = req.body
    if(!body.email) {
        res.status('400').send({
            "error": "Email é obrigatorio!"
        })
        return
    }
    next()
}

router.post('/user', validateEmail, async(req, res) => {
    const body = req.body
    
    const user = await User.create(body)

    res.status(200).send(user);
});

router.get('/users', validateJwt, async (req, res) => {
    let data = await User.findAll();
    res.send(data);
});

router.post('/user/login', validateEmail, generateJwt, async (req, res) => {
    const token = req.token;
    res.send({token});
}); 

module.exports = router;