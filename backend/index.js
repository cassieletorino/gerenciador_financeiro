const express = require('express');
const res = require('express/lib/response');

const app = express();
app.use(express.json());

app.listen(5587,()=> console.log("Deu certo!"));

// app.get('/',(req,res)=>{res.send('Aí sim!!')});
// app.get('/cachorro',(req,res)=>{res.send('Auau')});
// app.get('/fim', (req,res) =>{res.end()});
// const dados = ['Cassi'];
// app.get('/j', (req,res)=>{res.json({dados})});

const mysql = require('mysql2/promise');
const conection = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'testepessoa',
  user: 'root',
  password: ''
});

const getAllPessoas = async () =>{
  const [query] = await conection.execute('select * from pessoa')
  return query
}

app.get('/pessoa', async (req, res)=>{
  const resultado = await getAllPessoas()
  return res.status(200).json(resultado)
});