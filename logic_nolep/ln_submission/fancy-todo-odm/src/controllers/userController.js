import * as userService from "../services/userService.js";
import { createUserSchema, updateUserSchema } from "../validations/userValidation.js";
import { handleError } from "../../utils/errorHandler.js";

export const createUser = async (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await userService.createUser(validatedData);
    res.status(201).json({ data: user });
 } catch (error) {
  handleError(res, error);
}
};

export const updateUser = async (req, res) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(req.params.id, validatedData);
    res.status(200).json({ data: user });
  } catch (error) {
  handleError(res, error);
}
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await userService.getAllUsers();
    res.status(200).json({ data: user });
  } catch (error) {
  handleError(res, error);
}
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id); 
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: user });
  } catch (error) {
  handleError(res, error);
}
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id); 
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
  handleError(res, error);
}
};