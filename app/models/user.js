import bcrypt from "bcrypt";
import * as passportLocalMongoose from "passport-local-mongoose";
import shortid from "shortid"
export default mongoose => {
  var schema = mongoose.Schema(
    {
      _id: {
        type: String,
        default: shortid.generate
      },
      firstName: String,
      lastName: String,
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        default: false
      },
      activeToken: String,
      activeExpires: Date,
      plans: [
        {type: String, ref: 'Plan'}
      ]
    },
    { timestamps: true }
  );
  schema.plugin(passportLocalMongoose.default);
  const User = mongoose.model("User", schema);

  return User;
};