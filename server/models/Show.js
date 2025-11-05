import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: { type: String, required: true, ref: "Movie" },
    showDateTime: { type: Date, required: true },
    showPrice: { type: Number, required: true },
   occupiedSeats: {
  type: Map,
  of: String,
  default: {}
  },
},
  { timestamps: true } 
);

const Show = mongoose.model("Show", showSchema);
export default Show;