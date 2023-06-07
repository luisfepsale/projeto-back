const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Rota para listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao obter os usuários" });
  }
});

// Rota para criar um novo usuário
router.post("/create", async (req, res) => {
  const { name, email, phone, dateOfBirth, cpf, password } = req.body;
  try {
    const user = await User.create({ name, email, phone, dateOfBirth, cpf, password });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar o usuário" });
  }
});

// Rota para obter um usuário específico
router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao obter o usuário" });
  }
});

// Rota para atualizar um usuário
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.name = name;
      user.email = email;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar o usuário" });
  }
});

// Rota para excluir um usuário
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir o usuário" });
  }
});

module.exports = router;
