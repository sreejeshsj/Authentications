const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const { uploadImageController, fetchImageController, deleteImageController } = require("../controllers/image-controller");
const router = express.Router();
//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

//get all images

router.get('/fetch-image',authMiddleware,adminMiddleware,fetchImageController)

//delete an image using id
router.delete('/delete/:id',authMiddleware,adminMiddleware,deleteImageController)

module.exports = router;
