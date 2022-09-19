import { registerOrLoginUser , whoami, updateProfile, activeAccount} from "../controllers/user.js";
import express from 'express';

const router = express.Router();

export default app => {
    router.post("/login", registerOrLoginUser);
    router.get("/whoami", whoami)
    router.post("/updateProfile", updateProfile);
    router.get("/active", activeAccount);

    app.use('/user', router);
}