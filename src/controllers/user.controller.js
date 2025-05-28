import asyncHandler from "../utils/asynHandler.js";

const registerUser = asyncHandler(async(req, res )=>{
    res.status(200).json({
        message:"User registered successfully",
    })
})      

export default registerUser;
// This is a controller function for registering a user.
// It uses asyncHandler to handle asynchronous operations and errors.
// When the function is called, it sends a JSON response with a success message.
// The response has a status code of 200, indicating that the request was successful.
// This function can be extended to include user registration logic, such as saving user data to a database or validating input data.