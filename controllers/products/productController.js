const joi = require("joi");
const multer = require("multer");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const { Product } = require("../../models");
const fs = require("fs");
const path = require("path");
const { productSchema } = require("../../validators");

global.appRoot = path.resolve(__dirname);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random() * 1e9}-${
      file.originalname
    }`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({ storage, limits: 1024 * 5e6 }).single(
  "image"
);

module.exports = {
  store: async (req, res, next) => {
    try {
      handleMultipartData(req, res, async (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError());
        }
        console.log(req.file);
        if (!req.file) {
          return next(CustomErrorHandler.serverError("image not available"));
        }
        const filepath = req.file.path;

        // validation

        const { name, price, size } = req.body;
        console.log(req.body);
        const { error } = productSchema.validate({ name, price, size });
        let document = "";
        if (error) {
          // delete the uploaded image file
          console.log(path.join(appRoot, filepath));
          fs.unlink(filepath, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError());
            }
          });
          return next(error);
        }

        try {
          document = await Product.create({
            name,
            price,
            size,
            image: filepath,
          });
        } catch (error) {
          return next(error);
        }

        res.status(201).json(document);
      });
    } catch (err) {
      return next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      handleMultipartData(req, res, async (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError());
        }
        console.log(req.file);
        let filepath = "";
        if (req.file) {
          filepath = req.file.path;
        }

        // validation
        const { name, price, size } = req.body;
        console.log(req.body);
        const { error } = productSchema.validate({ name, price, size });

        let document = "";

        if (error) {
          // delete the uploaded image file
          console.log(path.join(appRoot, filepath));
          if (req.file) {
            fs.unlink(filepath, (err) => {
              if (err) {
                return next(CustomErrorHandler.serverError());
              }
            });
          }
          return next(error);
        }

        try {
          document = await Product.findOneAndUpdate(
            { _id: req.params.id },
            {
              name,
              price,
              size,
              ...(req.file && { image: filepath }),
            },
            { new: true }
          );
        } catch (error) {
          return next(error);
        }

        res.status(201).json(document);
      });
    } catch (err) {
      return next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      // delete the document
      const document = await Product.findOneAndRemove({ _id: req.params.id });
      if (!document) {
        return next(new Error("Nothing to delete"));
      }

      // delete the image
      fs.unlink(document._doc.image, (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError(err.message));
        } else {
          res.json(document);
        }
      });
    } catch (error) {
      return next(error);
    }
  },
  singleProduct: async (req, res, next) => {
    try {
      // delete the document
      const document = await Product.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
      if (!document) {
        return next(CustomErrorHandler.notFound());
      }

      res.status(200).json(document);
    } catch (error) {
      return next(error);
    }
  },
  allProducts: async (req, res, next) => {
    try {
      // delete the document
      const documents = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 });
      if (!documents) {
        return next(CustomErrorHandler.notFound());
      }

      res.status(200).json(documents);
    } catch (error) {
      return next(error);
    }
  },
};
