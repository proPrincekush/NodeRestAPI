const { Schema, model } = require("mongoose");
const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
