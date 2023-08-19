import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, seller } = req.body;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }

    //checking if theres a user with the same email

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered please login!",
      });
    }

    //hashing password
    const hashedPassword = await hashPassword(password);

    //creating user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      seller,
      claimed: false,
    }).save();
    // user.save();

    res.status(201).send({
      success: true,
      message: "user registered succesfully ",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    });
  }
};

//login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(200).send({
        success: false,
        flag: 2,
        message: "Invalid username or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        falg: 1,
        message: "user not found!",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        flag: 2,
        message: "Invalid username or password",
      });
    }
    console.log("hello");
    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Succesful login",
      flag: 0,
      user: {
        name: user.name,
        email: user.email,
        seller: user.seller,
        claimed: user.claimed,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};


export const claimController = async (req, res) => {
  try{
    const {email} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
      res.status(200).send({
        success: false,
        message: "User not found"
      });
    }
    else{
      user.claimed = true;
      user.save();
      res.status(200).send({
        success:true,
        message:"Claimed successfully",
        user
      });
    }
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success: false,
      message:"Error in claiming"
    })
  }
};