const { Schema, model } = require("mongoose");
const refreshTokenSchema = new Schema(
  {
    token: { type: String, required: true,unique:true },
  },
  {
    timestamps: false,
  }
);

module.exports = model("Refreshtokens", refreshTokenSchema);
