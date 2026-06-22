import SwapOrder from "../models/SwapOrder.js";
import Product from "../models/Product.js";

export async function createSwapOrder(req, res) {
  try {
    const data = req.body;

    for (const productId of data.products) {
      const product = await Product.findById(productId);
      if (!product || !product.owner.equals(data.proposer)) {
        return res.status(400).json({
          message: "All products must belong to the proposer",
        });
      }
    }

    const order = await SwapOrder.create(data);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// export async function getSwapOrders(req, res) {
//   try {
//     const { productId, from, to } = req.query;
//     const filter = {};

//     if (productId) {
//       filter.products = productId;
//     }

//     if (from || to) {
//       filter.createdAt = {};
//       if (from) filter.createdAt.$gte = new Date(from);
//       if (to) filter.createdAt.$lte = new Date(to);
//     }

//     const array = await SwapOrder.find(filter).setOptions({
//       sanitizeFilter: false,
//     });
//     res.status(200).json(array);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// }

export async function getSwapOrders(req, res) {
  try {
    const { productId, from, to } = req.query;
    const filter = {};

    if (productId) {
      filter.products = productId;
    }

    let array = await SwapOrder.find(filter);

    if (from || to) {
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;
      if (toDate) {
        toDate.setHours(23, 59, 59, 999);
      }
      array = array.filter((order) => {
        if (fromDate && order.createdAt < fromDate) return false;
        if (toDate && order.createdAt > toDate) return false;
        return true;
      });
    }

    res.status(200).json(array);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getSwapOrderByID(req, res) {
  try {
    const { id } = req.params;
    const order = await SwapOrder.findById(id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateSwapOrder(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const orderToUpdate = await SwapOrder.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (orderToUpdate) {
      if (data.status === "accepted") {
        for (const productId of orderToUpdate.products) {
          await Product.findByIdAndUpdate(productId, {
            $inc: { swapCount: 1 },
            owner: orderToUpdate.receiver,
          });
        }
      }
      res.status(200).json(orderToUpdate);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error); //temp
    res.status(400).json({ message: error.message });
  }
}

export async function deleteSwapOrder(req, res) {
  try {
    const { id } = req.params;
    const swapOrderToDelete = await SwapOrder.findByIdAndDelete(id);
    if (swapOrderToDelete) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
