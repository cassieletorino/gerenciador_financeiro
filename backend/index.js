const express = require('express');
const res = require('express/lib/response');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
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
  database: 'mydb',
  user: 'root',
  password: ''
});

const getAllUsuarios = async () =>{
  const [query] = await conection.execute('select * from usuario')
  return query
}

app.get('/usuarios', async (req, res)=>{
  const resultado = await getAllUsuarios()
  return res.status(200).json(resultado)
});

app.get('/usuario/:id', async (req,res)=>{
  const {id} = req.params;
  const [query] = await conection.execute('select * from usuario where id = ?', [id]);
  if (query.length===0) return res.status(400).json({mensagem: 'nenhum usuario encontrado'});
  return res.status(200).json(query)
});
