import * as todoService from "../services/todoService.js";
import { createTodoSchema, updateTodoSchema } from "../validations/todoValidation.js";
import { handleError } from "../../utils/errorHandler.js";

export const getAllTodo = async (req, res) => {
  try {
    const todo = await todoService.getAllTodo();
    res.status(200).json({ data: todo });
  } catch (error) {
    handleError(res, error);
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ data: todo });
  } catch (error) {
    handleError(res, error);
  }
};

export const createTodo = async (req, res) => {
  try {
    const validatedData = createTodoSchema.parse(req.body);
    const todo = await todoService.createTodo(validatedData);
    res.status(201).json({ data: todo });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTodo = async (req, res) => {
  try {
    const validatedData = updateTodoSchema.parse(req.body);
    const todo = await todoService.updateTodo(req.params.id, validatedData);
    res.status(200).json({ data: todo });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteTodo = async (req, res) => {
  try {
    await todoService.deleteTodo(req.params.id);
    res.status(200).json({ message: "Todo Deleted" });
  } catch (error) {
    handleError(res, error);
  }
};