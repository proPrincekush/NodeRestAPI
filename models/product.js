const { Schema, model } = require("mongoose");
const { BASE_URL } = require("../config");
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: {
      type: String,
      required: true,
      get: (image) => {
        // return image;
        return `${BASE_URL + image}`;
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    id: false,
  }
);

module.exports = model("Product", ProductSchema);
