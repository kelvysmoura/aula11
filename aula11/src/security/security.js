const User = require("../entity/User");
const jwt = require('jsonwebtoken')
const secret = "secret"

async function tokenIsValid(req) {
    // let tokens = [
    //     'jordana01',
    //     'niely_gold',
    //     'beatriz_09',
    // ];

    console.log(req.headers)

    let user = await User.findAll({
        where: {
            token: req.headers.token || null
        }
    });

    if (user.length === 0) {
        return false;
    }

    return user;

    // return tokens.includes(req.headers.token);
}

function errorPermission(res) {
    res.status(401).send({
        error: 'Sem permissao'
    });
}

async function validSecurity(req, res, next) {

    let user = await User.findOne({
        where: {
            token: req.headers.token || null
        }
    })

    if (!await tokenIsValid(req)) {
        errorPermission(res);
        return;
    }

    console.log('------------------------------------------------');
    console.log(`${user.name} acessou a URL ${req.url} no dia 2023-10-03`);
    console.log('------------------------------------------------');


    next();
}

async function generateJwt(req, res, next) {
    let user = await User.findOne({
        where: {
            email: req.body.email || null
        }
    })

    if(!user.id) {
        res.status(400).send({
            error: 'Usuario não encontrado'
        });
        return
    }

    const token = await jwt.sign({
        user_id: user.id
    }, secret)

    req.token = token;

    next()
}

async function validateJwt(req, res, next) {
    
    const token = req.headers.token

    if(!token) {
        errorPermission(res);
        return
    }

    jwt.verify(token, secret, function(err, decoded) {
        if(err) {
            errorPermission(res);
            return
        }
    });

    next()
}

module.exports = {
    validSecurity,
    generateJwt,
    validateJwt
};