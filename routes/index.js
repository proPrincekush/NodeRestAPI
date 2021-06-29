const router = require("express").Router();

// controllers
const {
  registerController,
  refreshController,
  loginController,
  userController,
  productController,
} = require("../controllers");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/user", auth, userController.user);
router.post("/refreshtoken", refreshController.refresh);
router.post("/logout", auth, loginController.logout);

// add a product
router.post("/product", [auth, admin], productController.store);
// update single product
router.put("/product/:id", [auth, admin], productController.update);
// delete single product
router.delete("/product/:id", [auth, admin], productController.delete);
// get single product
router.get("/product/:id", productController.singleProduct);
// get all products
router.get("/products/", productController.allProducts);
module.exports = router;
