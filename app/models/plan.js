import shortid from "shortid"
export default mongoose => {
  var schema = mongoose.Schema(
    {
      _id: {
        type: String,
        default: shortid.generate
      },
      title: String,
      location: String,
      budget: Number,
      numberOfParticipants: Number,
      details: String,
      author: {
        type: String,
        ref: 'User'
      }
    },
    { timestamps: true }
  );
  const Plan = mongoose.model("Plan", schema);

  return Plan;
};