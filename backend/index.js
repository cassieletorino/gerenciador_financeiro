const express = require('express');

const app = express();

app.listen(5587,()=> console.log("Deu certo!"));

app.get('/',(req,res)=>{res.send('Aí sim!!')});
app.get('/cachorro',(req,res)=>{res.send('Auau')});
app.get('/fim', (req,res) =>{res.end()});
const dados = ['Cassi'];
app.get('/j', (req,res)=>{res.json({dados})});
