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
    //page number
    const page=parseInt(req.query.page) || 1
    //number of image per each page
    const limit=parseInt(req.query.limit) || 2
    const skip=(page - 1)*limit
    //sort based on specific field
    const sortBy=req.query.sortBy || 'createdAt'
    //asc or dec
    const sortOrder=req.query.sortOrder=='asc' ? 1 : -1
    //total number of image
    const totalImage=await Image.countDocuments()
    //total number of pages
    const totalPages=Math.ceil(totalImage/limit)
    
    const sortObj={}
    sortObj[sortBy]=sortOrder

    
    const fetchedImage=await Image.find().sort(sortObj).skip(skip).limit(limit)
   
    return res.status(200).json({
      success:true,
      message:"Image fetched successfully",
      currentPage:page,
      totalPages:totalPages,
      totalImage:totalImage,
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
