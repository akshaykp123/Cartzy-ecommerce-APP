const express = require("express");

const {
  addProductReview,
  getProductReviews,
  deleteProductReview
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);
router.delete("/delete", deleteProductReview);

module.exports = router;