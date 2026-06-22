import User from "../models/User.js";

export async function createUser(req, res) {
  try {
    const data = req.body;
    const profile = await User.create(data);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const array = await User.find();
    res.status(200).json(array);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getUserByID(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const userToUpdate = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (userToUpdate) {
      res.status(200).json(userToUpdate);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const userToDelete = await User.findByIdAndDelete(id);
    if (userToDelete) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
