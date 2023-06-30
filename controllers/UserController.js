const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const moment = require("moment");

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


// create
router.post("/create", async (req, res) => {
  const { name, email, phone, dateOfBirth, cpf, password, photo, confirmPassword } = req.body;

  const formattedDateOfBirth = moment(dateOfBirth, "DD/MM/YYYY").format("YYYY-MM-DD");

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "A senha e a confirmação de senha não coincidem" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha com um salt de 10 rounds

    const user = await User.create({ name, email, phone, dateOfBirth: formattedDateOfBirth, cpf, password: hashedPassword, photo });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar o usuário" });
  }
});


// Rota para atualizar um usuário
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, dateOfBirth, cpf, password, photo, newPassword } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      // Verificar se a senha atual está correta
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Senha atual incorreta" });
      }
      
      user.name = name;
      user.email = email;
      user.phone = phone;
      user.dateOfBirth = dateOfBirth;
      user.cpf = cpf;
      user.password = await bcrypt.hash(newPassword, 10); // Atualizar para a nova senha
      user.photo = photo;
      await user.save();
      res.status(201).json(user);
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
