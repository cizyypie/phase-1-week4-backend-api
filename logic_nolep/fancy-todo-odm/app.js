import express, { json } from "express";
import userRoutes from "./src/routes/userRoutes.js";
import todoRoutes from "./src/routes/todoRoutes.js";
const app = express();

app.use(json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

export default app;
