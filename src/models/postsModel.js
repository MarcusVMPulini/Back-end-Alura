import 'dotenv/config';
import conectarAoBanco from '../config/dbconfig.js'; //tem q colocar o .js ao final
import { MongoClient, ObjectId } from 'mongodb'; 

// Cria uma conexão com o banco de dados usando a string de conexão do ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para buscar todos os posts do banco de dados
export async function getTodosPosts() {
    // Obtém o banco de dados "alura-instabyte" da conexão
    const db = conexao.db("alura-instabyte");
    // Obtém a coleção "posts" do banco de dados
    const colecao = db.collection("posts");
    // Retorna todos os documentos da coleção como um array
    return colecao.find().toArray();
  }

export async function criarPost(novoPost) {
     // Obtém o banco de dados "alura-instabyte" da conexão
     const db = conexao.db("alura-instabyte");
     // Obtém a coleção "posts" do banco de dados
     const colecao = db.collection("posts");
     // Retorna todos os documentos da coleção como um array
     return colecao.insertOne(novoPost)
}

export async function atualizarPost(id, novoPost) {
  // Obtém o banco de dados "alura-instabyte" da conexão
  const db = conexao.db("alura-instabyte");
  // Obtém a coleção "posts" do banco de dados
  const colecao = db.collection("posts");
  const objID = ObjectId.createFromHexString(id)
  return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost})
}