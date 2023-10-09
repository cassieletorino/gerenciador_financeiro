const express = require('express');
const res = require('express/lib/response');
const app = express();
const PORT = 5587;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.listen(PORT,()=> console.log("Servidor rodando na porta ${PORT}"));

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

// Funções usuários

const getAllUsuarios = async () =>{
  const [query] = await conection.execute('select * from usuario')
  return query
};

app.get('/usuarios', async (req, res)=>{
  const resultado = await getAllUsuarios()

  if (resultado.length === 0) {
    return res.status(200).json({ mensagem: "Nenhum usuário encontrado no database!" });
  }
  return res.status(200).json(resultado);
});

app.post('/salvar/usuario', async (req,res) =>{
  const {nome, email} = req.body;
  const [query] = await conection.execute('insert into usuario (nome, email) values (?, ?)', [nome, email]);
  return res.json(query);
});

app.get('/obter/usuario/:id', async (req,res)=>{
  const {id} = req.params;
  const [query] = await conection.execute('select * from usuario where id = ?', [id]);
  if (query.length===0)
    return res.status(400).json({mensagem: 'nenhum usuario encontrado'});
  return res.status(200).json(query)
});

app.get('/buscarnome/usuario/:nome', async (req,res)=>{
  const {nome} = req.params;
  const [query] = await conection.execute('select * from usuario where nome like ?', ["%" + nome + "%"]);
  if (query.length===0) 
    return res.status(400).json({mensagem: 'nenhum usuario encontrado'});
  return res.status(200).json(query)
});

app.get('/buscaremail/usuario/:email', async (req,res)=>{
  const {email} = req.params;
  const [query] = await conection.execute('select * from usuario where email like ?', ["%" + email + "%"]);
  if (query.length===0) return res.status(400).json({mensagem: 'nenhum usuario encontrado'});
  return res.status(200).json(query)
});

app.delete('/usuario/:id', async (req, res) => {
  const {id} = req.params;
  const [query] = await conection.execute('delete * from usuario where id = ?', [id]);
  return res.json(query);
});

app.put('/atualizar/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  const [query] = await conection.execute('update usuario set nome = ?, email = ? where id = ?', [nome, email, id]);
  return res.json(query);
});

// Funções CategoriaReceita
const getAllCategoriaReceitas = async () => {
  const [query] = await conection.execute("select * from categoria_receita");
  return query;
};

app.get("/categoriareceita", async (req, res) => {
  const resultado = await getAllCategoriaReceitas();

  if (resultado.length === 0) {
    return res
      .status(200)
      .json({ mensagem: "Nenhuma categoria-receita encontrado no database!" });
  }
  return res.status(200).json(resultado);
});

app.get("/categoriareceita/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_receita where id = ?",
    [id]
  );
  if (query.length === 0)
    return res
      .status(400)
      .json({
        mensagem:
          "Nenhuma categoria-receita encontrado por este id no database!",
      });
  return res.status(200).json(query);
});

app.get("/categoriareceita/buscarcategoria/:nome", async (req, res) => {
  const { nome } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_receita where nome like ?",
    ["%" + nome + "%"]
  );
  if (query.length === 0)
    return res
      .status(400)
      .json({
        mensagem: "Nenhuma categoria-receita encontrado por este nome!",
      });
  return res.status(200).json(query);
});

app.get("/categoriareceita/buscarcategoria/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_receita where tipo like ?",
    ["%" + tipo + "%"]
  );
  if (query.length === 0)
    return res
      .status(400)
      .json({
        mensagem: "Nenhuma categoria-receita encontrado por este tipo!",
      });
  return res.status(200).json(query);
});

app.post("/categoriareceita", async (req, res) => {
  const { nome, tipo, usuario_id } = req.body;
  const [query] = await conection.execute(
    "insert into categoria_receita (nome, tipo, usuario_id) values (?, ?, ?)",
    [nome, tipo, usuario_id]
  );
  return res.json(query);
});

app.put("/categoriareceita/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, tipo } = req.body;
  const [query] = await conection.execute(
    "update categoria_receita set nome = ?, tipo = ? where id = ?",
    [nome, tipo]
  );
  return res.json(query);
});

app.delete("/categoriareceita/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "delete from categoria_receita where id = ?",
    [id]
  );
  return res.json(query);
});

// Funções CategoriaDespesa
const getAllCategoriaDespesa = async () => {
  const [query] = await conection.execute("select * from categoria_despesa");
  return query;
};

app.get("/categoriadespesa", async (req, res) => {
  const resultado = await getAllCategoriaDespesa();

  if (resultado.length === 0) {
    return res
      .status(200)
      .json({ mensagem: "Nenhuma categoria-despesa encontrado no database!" });
  }
  return res.status(200).json(resultado);
});

app.get("/categoriadespesa/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_despesa where id = ?",
    [id]
  );
  if (query.length === 0)
    return res
      .status(400)
      .json({
        mensagem:
          "Nenhuma categoria-despesa encontrado por este id no database!",
      });
  return res.status(200).json(query);
});

app.get("/categoriadespesa/buscarcategoria/:nome", async (req, res) => {
  const { nome } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_despesa where nome like ?",
    ["%" + nome + "%"]
  );
  if (query.length === 0)
    return res
      .status(400)
      .json({
        mensagem: "Nenhuma categoria-despesa encontrado por este nome!",
      });
  return res.status(200).json(query);
});

app.get("/categoriadespesa/buscarcategoria/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_despesa where tipo like ?",
    ["%" + tipo + "%"]
  );
  if (query.length === 0)
    return res
      .status(400)
      .json({
        mensagem: "Nenhuma categoria-despesa encontrado por este tipo!",
      });
  return res.status(200).json(query);
});

app.post("/categoriadespesa", async (req, res) => {
  const { nome, tipo, usuario_id } = req.body;
  const [query] = await conection.execute(
    "insert into categoria_despesa (nome, tipo, usuario_id) values (?, ?, ?)",
    [nome, tipo, usuario_id]
  );
  return res.json(query);
});

app.put("/categoriadespesa/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, tipo } = req.body;
  const [query] = await conection.execute(
    "update categoria_despesa set nome = ?, tipo = ? where id = ?",
    [nome, tipo]
  );
  return res.json(query);
});

app.delete("/categoriadespesa/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "delete from categoria_despesa where id = ?",
    [id]
  );
  return res.json(query);
});

// Funções Receita

// Funções Despesa