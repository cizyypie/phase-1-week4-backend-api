import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'userId'
});

export default mongoose.model("User", userSchema);