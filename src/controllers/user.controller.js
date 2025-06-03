import asyncHandler from "../utils/asynHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// methor for access and refresh token
const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}

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



const loginUser = asyncHandler(async(req, res)=>{
    // steps for user login :-
    // get details from fontend
    // check if user exists
    // check if password is correct
    // access and refresh token
    // send cookies
    // send response to frontend

    const {email, username, password} = req.body

    if(!(email || username) ){
        throw new ApiError(400, "Email and Username are required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password")
    }

    const { accessToken,refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // cookies

    const options={
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(new ApiResponse(200,{user: loggedInUser,accessToken,refreshToken},"User logged in successfully"))
})



const logoutUser = asyncHandler(async(req, res)=>{

  await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true,
        }
    )
    const options={
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    // incomingrefreshToken from cookies or body and its encripted and aslo the refresh token in db is also encripted
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request, refresh token is required")
    }
    // verify the incoming refresh token
    // then decode the token to get user id
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token, user not found")
        }
         
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        const options={
            httpOnly: true,
            secure: true,
        }
    
       const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", newRefreshToken,options)
        .json(new ApiResponse(200,{accessToken,refreshToken: newRefreshToken},"Access token refreshed successfully"))
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassowrd, newPassword} = req.body
    const user = await User.findById(req.user._id)
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassowrd)

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid old password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res)=>{

    const {fullname, email} = req.body

    if(!fullname || !email ){
        throw new ApiError(400, "Fullname and Email are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {  
            $set:{
                fullname: fullname,
                email: email.toLowerCase(),
            }
        },
        {
            new: true, //return the information after update
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))

})


const updateUserAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(500, "Failed to upload avatar to cloudinary")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar: avatar.url,
            },
        },
        {
            new: true, // return the updated user
        }
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCover = asyncHandler(async(req, res)=>{
    const coverLocalPath = req.file?.path

    if(!coverLocalPath){
        throw new ApiError(400, "cover file is missing")
    }
    const cover = await uploadOnCloudinary(coverLocalPath)
    if(!cover.url){
        throw new ApiError(500, "Failed to upload cover to cloudinary")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage: cover.url,
            },
        },
        {
            new: true, // return the updated user
        }
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200, user, "cover image updated successfully"))
})

export {
     registerUser,
     loginUser,
     logoutUser,
     refreshAccessToken,
     changeCurrentPassword,
     getCurrentUser,
     updateAccountDetails,
     updateUserAvatar,
     updateUserCover,
     } ;
// This is a controller function for registering a user.
