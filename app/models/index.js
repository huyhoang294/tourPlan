import mongoose, { Promise } from "mongoose";
import * as dotenv from 'dotenv';
import user from './user.js';
import plan from './plan.js';
import * as passportLocalMongoose from "passport-local-mongoose";

const promise = global.Promise;
mongoose.Promise = promise;
dotenv.config();

const db = {
    mongoose: mongoose,
    url: process.env.MONGO_URI,
    user: user(mongoose),
    plan: plan(mongoose)
};

export default db;
