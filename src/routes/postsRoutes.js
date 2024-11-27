import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento de arquivos usando o multer
const storage = multer.diskStorage({
  // Define o diretório de destino para os arquivos
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define a pasta "uploads" como destino
  },
  // Define o nome do arquivo a ser salvo
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa o nome original do arquivo
  }
});

// Cria uma instância do multer com as configurações de armazenamento
const upload = multer({ storage });

// Função para configurar as rotas do aplicativo Express
const routes = (app) => {
  // Habilita o parsing de JSON no corpo das requisições HTTP
  app.use(express.json());

  app.use(cors(corsOptions))
  // Rota GET para buscar todos os posts
  app.get('/posts', listarPosts);

  // Rota POST para criar um novo post
  app.post("/posts", postarNovoPost);

  // Rota POST para fazer upload de uma imagem
  // O parâmetro "imagem" indica o nome do campo no formulário HTML
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost)
};

export default routes;