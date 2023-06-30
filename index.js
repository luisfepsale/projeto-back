const express = require("express");
const app = express();
const userRoutes = require("./controllers/UserController");
const loginRoute = require('./routes/auth'); // 
const database = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(
    cors({
      origin: "http://localhost:3001", // Defina a origem permitida (seu front-end)
      optionsSuccessStatus: 200 // Permite que o navegador envie o cabeçalho 'content-length' nas solicitações CORS
    })
  );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', loginRoute);
app.use("/users", userRoutes);



// Inicie o servidor
app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});


database.sync({ force: false })
  .then(() => {
    console.log("Tabelas sincronizadas com o banco de dados");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar as tabelas:", error);
  });

