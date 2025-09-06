const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      // orderStatus: "confirmed" || "delivered",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const checkExistinfReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistinfReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;

    const review = await ProductReview.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review!",
      });
    }

    await ProductReview.findByIdAndDelete(reviewId);

    // Update product averageReview after deletion
    const reviews = await ProductReview.find({ productId: review.productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      totalReviewsLength > 0
        ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) /
          totalReviewsLength
        : 0;

    await Product.findByIdAndUpdate(review.productId, { averageReview });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
    });
  }
};


module.exports = { addProductReview, getProductReviews,deleteProductReview,};