import { Router } from "express";
import { loggedInUser, loggedOutUser, userRegistration, refreshAccessTokens, ChangesInPassword, getUser, updateUserInfo, avatarUpdation, coverImageUpdation, Channelsubcribtions, getwatchHistory } from "../controllers/user.controllers.js";
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

router.route('/refreshToken').post(refreshAccessTokens);
router.route('/changed-Password').post(userlogOutJwt,ChangesInPassword);
router.route('/current-user').get(userlogOutJwt,getUser);
router.route('/updated-user').patch(userlogOutJwt,updateUserInfo)
router.route('/updated-avatar').patch(userlogOutJwt,upload.single("avatar"),avatarUpdation);
router.route('/updated-coverImage').patch(userlogOutJwt,upload.single("coverImage"),coverImageUpdation);
router.route('/c/:username').get(userlogOutJwt,Channelsubcribtions);
router.route('/watch-History').get(userlogOutJwt,getwatchHistory);



export default router;