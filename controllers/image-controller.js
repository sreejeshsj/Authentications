const Image = require("../model/image");
const { uploadToCloudinary } = require("../helpers/cloudinary-helper");
const cloudinary  = require("../config/cloudinary");
const uploadImageController = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        sucess: false,
        message: "File is required. Please upload and image",
      });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //store the image url and publicId along with uploaded user into db
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userinfo.userId,
    });
    await newlyUploadedImage.save();

    res.status(200).json({
      sucess: true,
      message: "Image uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong ! Please try again",
    });
  }
};

const fetchImageController=async (req,res)=>{
  try{
    const userId=req.userinfo.userId
    console.log(userId)
    const fetchedImage=await Image.find({
uploadedBy:userId
}) 
   
    return res.status(200).json({
      success:true,
      message:"Image fetched successfully",
      fetchedImage
    })
  }catch(err){
    res.status(400).json({
      success:false,
      message:"Something went wrong while trying to fetchig image!",
      err
    })
  }
  
}

const deleteImageController=async (req,res)=>{
  try{
    const imageId=req.params.id
    const userId=req.userinfo.userId
    const image=await Image.findById(imageId)

    if(!image){
      return res.status(400).json({
        success:false,
        message:"Image with the give id not found!"
      })
    }

    if(image.uploadedBy != userId){
      return res.status(400).json({
        success:true,
        message:"You cant delete others post"

      })
    }

    const delImage = await cloudinary.uploader.destroy(image.publicId)
    await Image.findByIdAndDelete(imageId)
    res.status(200).json({
      success:true,
      message:"Image deleted successfully",
      delImage
    })
  }catch(err){
    res.status(400).json({
      success:false,
      message:"Something went wrong while trying to fetchig image!",
      err
    })
  }
}

module.exports = { uploadImageController, fetchImageController, deleteImageController };
