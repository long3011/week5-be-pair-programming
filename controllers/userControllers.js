const User = require("../models/userModel");
const mongoose = require('mongoose');

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "failed to deliver", error: error.message })
  }
};

// POST /users
const createUser = async (req, res) => {
  try {
    const newUser = await User.create({ ...req.body });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "faile to create a user", error: error.message })
  }
};

// GET /users/:userId
const getUserById = async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "user id not correct" })
  }
  try {
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message })
    }
  } catch (error) {
    res.status(500).json({ message: "failed to retrieve user" })
  }

};

// PUT /users/:userId
const updateUser = async (req, res) => {

  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "user id not correct" })
  }

  try {
    const updatedUser = await User.updateOneById({ _id: userId },
      { ...req.body },
      { new: true });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      // Handle update failure (e.g., user not found)
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to connect to server" })
  }
};

// DELETE /users/:userId
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "user id not correct" })
  }
  try {
    const isDeleted = await User.findOneAndDelete({ _id: userId })
    if (isDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" }); // Handle deletion failure (e.g., user not found)
    }
  } catch (error) {
    res.status(500).json({ message: " failed to connect to server" })
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
