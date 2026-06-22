import Product from "../models/Product.js";

export async function createProduct(req, res) {
  try {
    const photos = req.files.map((file) => file.filename);
    const data = {
      name: req.body.name,
      owner: req.body.owner,
      photos,
    };
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getProducts(req, res) {
  try {
    const array = await Product.find();
    res.status(200).json(array);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getProductByID(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const productToUpdate = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (productToUpdate) {
      res.status(200).json(productToUpdate);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const productToDelete = await Product.findByIdAndDelete(id);
    if (productToDelete) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
