const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const conexao = require('./dbconfig');

const path = require('path');
const multer = require('multer');
 
const app = express();
 
app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload =  multer({storage});

app.use(express.static('public'));
app.use('uploads', express.static('uploads'));

app.post('/upload', upload.single('arquivo'), (req, res) => {
    const {nome_original, nome_arquivo} = req.file;

    const sql = 'INSERT INTO imagem (nome_original, nome_arquivo) VALUES (?, ?)';
    conexao.query(sql, [nome_original, nome_arquivo], (err) => {
        if(err){
            console.error('Erro ao salvar no banco' , err);
            return res.status(500).json({erro: 'Erro ao salvar no banco'});
        }
        res.json({mensagem: 'Upload realizado com sucesso'})
    })
})

app.get('/imagems', (req, res) => {
    const sql = 'SELECT * FROM imagem ORDER BY id DESC';
    conexao.query(sql , (err, result) => {
        if(err){
            console.error('Erro ao buscar imagens' , err);
            return res.status(500).json({erro: 'Erro ao buscar imagens'});
        }

        res.json(result);
    })
})


 
 
app.post('/usuarios', async (req, res) => {
    const {nome, email, senha} = req.body;
 
    const sql = `INSERT INTO usuarios
    (nome, email, senha) VALUES (?, ?, ?)`;
 
    const senhaCriptografada = await bcrypt.hash(senha, 10);
 
    conexao.query(
        sql,
        [nome, email, senhaCriptografada],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    mensagem: 'Erro ao cadastrar usuário',
                });
            }
            res.json({
                mensagem: 'Usuário cadastrado com sucesso',
            });
        }
    )
});
 
 
app.get('/usuarios', (req, res) => {
    const sql = "SELECT * FROM usuarios";
 
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({
                mensagem: 'Erro ao buscar usuários',
            });
        }
        res.json(resultado);
    })
});
 
 
app.post('/login', (req, res) => {
    const {email, senha} = req.body;
 
    const query = `SELECT * FROM usuarios WHERE email = ?`;
   
    conexao.query(query, [email], async (erro, resultado) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({
                mensagem: 'Erro ao buscar usuário',
            });
        }
 
        const usuario = resultado[0];
 
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
 
        if(senhaCorreta){
            return res.json({
                sucesso: true,
                mensagem: 'Login bem-sucedido',
                data: usuario
            });
        }
    });
});


 
 
 
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});