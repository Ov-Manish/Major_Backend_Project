import { Router } from "express";
import { loggedInUser, loggedOutUser, userRegistration, refreshAccessTokens } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { userlogOutJwt } from "../middlewares/auth.middleware.js";
const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount:1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),
    userRegistration
);

router.route("/login").post(loggedInUser);


router.route("/logout").post(userlogOutJwt ,loggedOutUser)

// Cretting an End point for Refresh Tokens :

router.route('/refreshToken').post(refreshAccessTokens)

export default router;