import Todo from "../models/todoModel.js";

export const getAllTodo = async () => await Todo.find();
export const getTodoById = async (id) => await Todo.findById(id).populate('userId');
export const createTodo = async (data) => await Todo.create(data);
export const updateTodo = async (id, data) => await Todo.findByIdAndUpdate(id, data, { new: true });
export const deleteTodo = async (id) => await Todo.findByIdAndDelete(id);