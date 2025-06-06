import { Router } from "express";
import  {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, updateUserAvatar, updateUserCover, getCurrentUser, updateAccountDetails, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
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
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-avatar").put(verifyJWT, upload.single('avatar'),updateUserAvatar)
router.route("/update-coverimage").put(verifyJWT,upload.single('coverImage'),updateUserCover)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account-details").put(verifyJWT,updateAccountDetails)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)
export default router;