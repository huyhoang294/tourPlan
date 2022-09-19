import jsonwebtoken from 'jsonwebtoken';
import db from "../models/index.js";
import * as dotenv from 'dotenv';
import crypto from "crypto";
import bcrypt from "bcrypt";
import { send } from "../helpers/Mailer.js"
import moment from "moment";
dotenv.config();
const User = db.user;
const { Secret, decode, verify, sign } = jsonwebtoken;
const genToken = (id) => {
    return sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

export const registerOrLoginUser = async (req, res, next) => {
    const {email, password} = req.body;
    const userExists = await User.findOne({ email })

    if (userExists) {
        var isCorrectPassword = await bcrypt.compare(password, userExists.password);
        if (isCorrectPassword)
            res.status(200).json({
                success: true,
                token: userExists._id,
                active: userExists.active,
                isCompleteProfile: userExists.firstName !== undefined || userExists.firstName !== undefined
            });
        else
        res.status(403).json({
            success: false,
            msg: "Wrong Passwords"
        });
    } else {
        const salt = await bcrypt.genSalt(10);

        var encryptPassword = await bcrypt.hash(password, salt)
        const user = new User({
        email, password: encryptPassword
    });

    crypto.randomBytes(20, function (err, buff) {
        user.activeToken = user._id + buff.toString('hex');

        user.activeExpires = Date.now() + 24 * 3600 * 1000;

        var link = process.env.HOST + '/user/active?token=' + user.activeToken;

        send({
            to: email,
            subject: 'Welcome',
            html: 'Please Click <a href="' + link + '"> here </a> to activate your account.'
        })

        user.save(function (err, user) {
            if (err) return next(err);
            res.status(200).json({
                success: true,
                token: user._id,
                msg: "Please check you email to activate account!"
            })
        })
    })
    }
}

export const whoami = async(req, res) => {
    const userExists = await User.findOne({ _id: req.query.access_token})

    if (userExists) {
        res.status(200).json({
            last_name: userExists.lastName,
            first_name: userExists.firstName,
            email: userExists.email,
            active: userExists.active
        })
    }
}

export const activeAccount = async(req, res) => {
    const userExists = await User.findOne({ activeToken: req.query.token})

    if (userExists) {
        if ((moment(userExists.activeExpires).valueOf() > moment.now())) {
            userExists.active = true;
            userExists.save();
            res.status(200).json({success: true});
        }
        else {
            res.json({
                success: false,
                msg: "Link expired please log in to your account and resend active link"
            })
        }
    }
}

export const updateProfile = async (req, res) => {
    const {userId, firstName, lastName} = req.body;
    const user = await User.findOne({ _id: userId})

    user.firstName = firstName;
    user.lastName = lastName;

    user.save();
    res.status(200).json({success: true});
}