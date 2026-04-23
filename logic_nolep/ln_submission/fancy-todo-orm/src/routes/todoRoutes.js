import { Router } from "express";
import { getAllTodo, getTodoById, createTodo, deleteTodo, updateTodo } from "../controllers/todoController.js";

const router = Router(); 

router.get("/", getAllTodo);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.put("/:id", updateTodo);    
router.delete("/:id", deleteTodo);

export default router;