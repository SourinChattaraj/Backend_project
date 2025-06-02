import asyncHandler from "../utils/asynHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async(req, res )=>{
    // steps for user registration :-
    // get user details from frontend
    // validate user details
    //check if user already exists
    //check for avatar and cover image
    // upload avatar and cover image to cloudinary
    // create a object for user
    // remove password and referesh token from user object
    // save user to database
    //return response to frontend

    // get detils from frontend
    const {fullname, username, email, password} = req.body

    // req.body came from frontend
    // req.files came from multer middleware


    // validation
    // if(fullname == ""){
    //     throw new ApiError(400, "Fullname is required")
    // } sigle use perpose validation
    if(
        [fullname, username, email, password].some((field)=>field?.trim()=== "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists
    const existsUser = await User.findOne({
        $or:[{ username },{ email }]
    })
    if(existsUser){
        if(existsUser.username === username){
            throw new ApiError(409, "Username already exists")
        }
        if(existsUser.email === email){
            throw new ApiError(409, "Email already exists")
        }
    }

    // const existsName = await User.findOne({ username })
    // if(existsName){
    //     ApiError(409, "Username already exists")
    // }
    // const existsEmail = await User.findOne({ email })
    // if(existsEmail){
    //     ApiError(409, "Email already exists")
    // }single check

    // check for avatar and cover image
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverLocalPath = req.files?.coverImage[0]?.path
    let coverLocalPath
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
        coverLocalPath=req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400, " Avatar is required")
    }
    // upload avatar and cover image to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)
    
    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar")
    }
    


    // create a object for user to save in database
   const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })
// remove password and referesh token from user object
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // check if user is created successfully
    if(!createdUser){
        throw new ApiError(500, "something went wrong, userr not created")
    }
    // return response to frontend
 
    return res.status(201).json(
        new ApiResponse(201, createdUser, "user Registered successfully")
    )


})      

export default registerUser;
// This is a controller function for registering a user.
