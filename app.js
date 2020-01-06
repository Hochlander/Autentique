const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res)=>{
    res.json({
        message: 'Bem-vindo à API'
    });
});

app.post('/api/posts', verifyToken, (req, res)=>{
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if(err){
            res.sendStatus(403);
        }else{

            res.json({
                message: 'Post criado',
                authData
            });            
        }
    })
});

app.post('/api/login', (req, res)=>{
    //Mock user
    const user={
        id:1,
        username:'brad',
        email:'brad@gmail.com'
    }

    jwt.sign({user}, 'secretkey', {expiresIn:'60s'}, (err, token)=>{
        res.json({
            token
        });
    });
});

// Criando a função Verify Token
// A função verifyToken visa estabelecer um filtro para usuários que querem acessar tal ou qual conteúdo.
// com o token, o acesso é liberado.
function verifyToken (req, res, next){

    // Get auth header value
    const bearerHeader = req.headers['authorization'];

    // Check if bearer is undefined
    if(typeof bearerHeader !=='undefined'){
        //Split at the space. Split converts a String to an array
        const bearer = bearerHeader.split(' ');
        // Get token from array. Array was built in the previous line of code
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next middleware
        next();

    }else{
       //Forbidden 
       res.sendStatus(403);
    }
}

app.listen(5000, ()=> console.log('Servidor iniciado na porta 5000'));