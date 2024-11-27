import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/germiniService.js";

/**
 * Lista todos os posts do banco de dados.
 * 
 * @param {Object} req Objeto de requisição HTTP.
 * @param {Object} res Objeto de resposta HTTP.
 */
export async function listarPosts(req, res) {
  // Chama a função do modelo para buscar todos os posts
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON com status 200 (OK)
  res.status(200).json(posts);
}

/**
 * Cria um novo post no banco de dados com base nos dados enviados no corpo da requisição.
 * 
 * @param {Object} req Objeto de requisição HTTP.
 * @param {Object} res Objeto de resposta HTTP.
 */
export async function postarNovoPost(req, res) {
  // Obtém os dados do novo post do corpo da requisição
  const novoPost = req.body;
  try {
    // Chama a função do modelo para criar o novo post e retorna o post criado
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta em formato JSON com status 200 (OK)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma mensagem de erro ao cliente com status 500 (Internal Server Error)
    res.status(500).json({ "Erro": "Falha ao criar post" });
  }
}

/**
 * Cria um novo post com uma imagem e salva a imagem no servidor.
 * 
 * @param {Object} req Objeto de requisição HTTP.
 * @param {Object} res Objeto de resposta HTTP.
 */
export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome original da imagem
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };

  try {
    // Cria o post no banco de dados e obtém o ID do post criado
    const postCriado = await criarPost(novoPost);
    // Constrói o novo nome da imagem com base no ID do post
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Move a imagem para a pasta de uploads com o novo nome
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta em formato JSON com status 200 (OK)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma mensagem de erro ao cliente com status 500 (Internal Server Error)
    res.status(500).json({ "Erro": "Falha ao criar post" });
  }
}

export async function atualizarNovoPost(req, res) {
  // Obtém os dados do novo post do corpo da requisição
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`
  
  try {
    const imgBufffer = fs.readFileSync(`uploads/${id}.png`)
    const descricao = await gerarDescricaoComGemini(imgBufffer)
    // Chama a função do modelo para criar o novo post e retorna o post criado
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postCriado = await atualizarPost(id, post);
    // Envia o post criado como resposta em formato JSON com status 200 (OK)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma mensagem de erro ao cliente com status 500 (Internal Server Error)
    res.status(500).json({ "Erro": "Falha ao criar post" });
  }
}