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
    return res.status(200).json({ mensagem: "Nenhuma categoria-receita encontrada no database!" });
  }
  return res.status(200).json(resultado);
});

app.post("/salvar/categoriareceita", async (req, res) => {
  const { nome } = req.body;
  const [query] = await conection.execute(
    "insert into categoria_receita (nome) values (?)",
    [nome]
  );
  return res.json(query);
});

app.get("/obter/categoriareceita/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_receita where id = ?",
    [id]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem:"Nenhuma categoria-receita encontrada com este id no database!",});
  return res.status(200).json(query);
});

app.get("/categoriareceita/buscarcategoria/:nome", async (req, res) => {
  const { nome } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_receita where nome like ?",
    ["%" + nome + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma categoria-receita encontrada por este nome!",});
  return res.status(200).json(query);
});

app.delete("/categoriareceita/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute("delete from categoria_receita where id = ?",
    [id]
  );
  return res.json(query);
});

app.put("/atualizar/categoriareceita/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const [query] = await conection.execute(
    "update categoria_receita set nome = ? where id = ?",
    [nome ]
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
    return res.status(200).json({ mensagem: "Nenhuma categoria-despesa encontrada no database!" });
  }
  return res.status(200).json(resultado);
});

app.post("/salvar/categoriadespesa", async (req, res) => {
  const { nome } = req.body;
  const [query] = await conection.execute(
    "insert into categoria_despesa (nome) values (?)",
    [nome]
  );
  return res.json(query);
});

app.get("/obter/categoriadespesa/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_despesa where id = ?",
    [id]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma categoria-despesa encontrada com este id no database!",});
  return res.status(200).json(query);
});

app.get("/buscar/categoriadespesa/:nome", async (req, res) => {
  const { nome } = req.params;
  const [query] = await conection.execute(
    "select * from categoria_despesa where nome like ?",
    ["%" + nome + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({ mensagem: "Nenhuma categoria-despesa encontrada por este nome!",});
  return res.status(200).json(query);
});

app.delete("/apagar/categoriadespesa/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "delete from categoria_despesa where id = ?",
    [id]
  );
  return res.json(query);
});

app.put("/atualizar/categoriadespesa/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const [query] = await conection.execute(
    "update categoria_despesa set nome = ?  where id = ?",
    [nome]
  );
  return res.json(query);
});

// Funções Receita
const getAllReceita = async () => {
  const [query] = await conection.execute("select * from receita");
  return query;
};

app.get("/receita", async (req, res) => {
  const resultado = await getAllReceita();

  if (resultado.length === 0) {
    return res.status(200).json({ mensagem: "Nenhuma receita encontrada no database!" });
  }
  return res.status(200).json(resultado);
});

app.post("/salvar/receita", async (req, res) => {
  const { nome } = req.body;
  const [query] = await conection.execute(
    "insert into receita (nome, descricao, valor, data) values (?, ?, ?, ?)",
    [nome, descricao, valor, data]
  );
  return res.json(query);
});

app.get("/obter/receita/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "select * from receita where id = ?",
    [id]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem:"Nenhuma receita encontrada com este id.",});
  return res.status(200).json(query);
});

app.get("/receita/buscar/:descricao", async (req, res) => {
  const { descricao } = req.params;
  const [query] = await conection.execute(
    "select * from receita where descricao like ?",
    ["%" + descricao + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma receita encontrada por este nome!",});
  return res.status(200).json(query);
});

app.get("/receita/buscarcategoria/:CategoriaReceita", async (req, res) => {
  const { CategoriaReceita } = req.params;
  const [query] = await conection.execute(
    "select * from receita where CategoriaReceita like ?",
    ["%" + CategoriaReceita + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma receita encontrada com esta categoria!",});
  return res.status(200).json(query);
});

app.get("/receita/buscardata/:data", async (req, res) => {
  const { data } = req.params;
  const [query] = await conection.execute(
    "select * from receita where data like ?",
    ["%" + data + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma receita encontrada com esta data!",});
  return res.status(200).json(query);
});

app.delete("/apagar/receita/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "delete from receita where id = ?",
    [id]
  );
  return res.json(query);
});

app.put("/atualizar/receita/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const [query] = await conection.execute(
    "update receita set nome = ?, descricao = ?, valor = ?, data = ? where id = ?",
    [nome, descricao, valor, data]
  );
  return res.json(query);
});

// Funções Despesa
const getAllDespesa = async () => {
  const [query] = await conection.execute("select * from despesa");
  return query;
};

app.get("/despesa", async (req, res) => {
  const resultado = await getAllDespesa();

  if (resultado.length === 0) {
    return res.status(200).json({ mensagem: "Nenhuma despesa encontrada no database!" });
  }
  return res.status(200).json(resultado);
});

app.post("/salvar/despesa", async (req, res) => {
  const { nome } = req.body;
  const [query] = await conection.execute(
    "insert into despesa (nome, descricao, valor, data) values (?, ?, ?, ?)",
    [nome, descricao, valor, data]
  );
  return res.json(query);
});

app.get("/obter/despesa/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "select * from despesa where id = ?",
    [id]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem:"Nenhuma despesa encontrada com este id.",});
  return res.status(200).json(query);
});

app.get("/despesa/buscar/:descricao", async (req, res) => {
  const { descricao } = req.params;
  const [query] = await conection.execute(
    "select * from despesa where descricao like ?",
    ["%" + descricao + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma despesa encontrada por este nome!",});
  return res.status(200).json(query);
});

app.get("/despesa/buscarcategoria/:CategoriaDespesa", async (req, res) => {
  const { CategoriaDespesa } = req.params;
  const [query] = await conection.execute(
    "select * from despesa where CategoriaDespesa like ?",
    ["%" + CategoriaDespesa + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma despesa encontrada com esta categoria!",});
  return res.status(200).json(query);
});

app.get("/despesa/buscardata/:data", async (req, res) => {
  const { data } = req.params;
  const [query] = await conection.execute(
    "select * from despesa where data like ?",
    ["%" + data + "%"]
  );
  if (query.length === 0)
    return res.status(400).json({mensagem: "Nenhuma despesa encontrada com esta data!",});
  return res.status(200).json(query);
});

app.delete("/apagar/despesa/:id", async (req, res) => {
  const { id } = req.params;
  const [query] = await conection.execute(
    "delete from despesa where id = ?",
    [id]
  );
  return res.json(query);
});

app.put("/atualizar/despesa/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const [query] = await conection.execute(
    "update despesa set nome = ?, descricao = ?, valor = ?, data = ? where id = ?",
    [nome, descricao, valor, data]
  );
  return res.json(query);
});