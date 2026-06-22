import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; //user router
import productRoutes from "./routes/productRoutes.js"; //product router
import swapOrderRoutes from "./routes/swapOrderRoutes.js"; //swap order router

const app = express();
const PORT = process.env.PORT || 3000;

//global middlewares
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/swaporders", swapOrderRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello from Express");
// });

await connectDB();

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
