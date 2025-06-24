
const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')
//register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from out req body
    const { username, email, password, role } = req.body;

    //check if user is already exists in our database
    const checkExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExist) {
      return res.status(400).json({
        success: false,
        message: "User is already exists with either same username or email",
      });
    }

    //hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save it in out database
    const createUser = new userModel({
      username, //username get from req.boy
      email, //email get from req.body
      password: hashedPassword, //hashed password
      role: role || "user",
    });

    //we can also use userModel.create method to create new user so we dont need to save() function
    await createUser.save();
    if (createUser) {
      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: createUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User is already exists with either same username or email",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Erro! Please try again",
    });
  }
};

//login controller

const loginUser = async (req, res) => {
  try {
    const {username,password}=req.body

    //check user is exist or not
    const user=await userModel.findOne({username})
    if (!user){
      return res.status(400).json({
        success:false,
        message:"User doest exist"
      })
    }
   
    //if the password is correct or not
    const isPasswordMatch=await bcrypt.compare(password,user.password)
    
    
    if (!isPasswordMatch){
      res.status(400).json({
        success:false,
        message:"Invalid credentials"
      })
    }
    //create user token(JWT)
    const accessToken = jwt.sign({
      userId : user._id,
      username:user.username,
      role:user.role
    },process.env.JWT_SECRET_KEY,{
      expiresIn:'15m'
    })
 
    res.status(200).json({
      success:true,
      message:"Loged in Successfully",
      accessToken

    })
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Erro! Please try again",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
