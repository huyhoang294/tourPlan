import { getFrontPageData, createNewPlan } from "../controllers/plan.js";
import express from 'express';

const router = express.Router();

export default app => {
    router.get("/frontPage", getFrontPageData);
    router.post("/createPlan", createNewPlan);
    app.use('/plan', router);
}