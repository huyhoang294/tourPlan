import db from "../models/index.js";

const Plan = db.plan;
const User = db.user;
export const getFrontPageData = async(req, res) => {
    const frontPageData = await Plan.find().sort({ createdAt: -1 }).limit(3);

    res.status(200).json({
        data: frontPageData
    })
}

export const createNewPlan = async(req, res) => {
    const {title, location, budget, numberOfParticipant, details, author} = req.body;
    const userExists = await User.findOne({ email: author })

    if (userExists) {
        const plan = new Plan({
            title, location, budget, numberOfParticipant, details, author: userExists._id
        })

        plan.save(()=>{
            res.status(200).json({
                success: true
            })
        });
        
    }
}