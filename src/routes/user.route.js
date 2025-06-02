import { Router } from "express";
import  {registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router= Router();

router.route("/register").post(
    // middleware to handle file uploads
    upload.fields(
        [
            { name: 'avatar', maxCount: 1},
            { name: 'coverImage', maxCount: 1}
        ]
    ),
    registerUser
)

router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refreshtoken").post(refreshAccessToken)

export default router;