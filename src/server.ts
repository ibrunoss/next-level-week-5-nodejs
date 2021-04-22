import express from "express";

const PORT:number = 3333;
const app = express();

/**
 * GET    = Busca
 * POST   = Criação
 * PUT    = Alteração
 * DELETE = Exclusão
 * PATCH  = Alterar uma informação especifica 
 */

app.get("/", (request, response) => {
  //return response.send("Olá NLW 05");
  return response.json({
    message: "Olá NLW 05"
  });
});

app.post("/users", (request, response) => {
  return response.json({
    message: "Usuário salvo com sucesso!"
  });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));