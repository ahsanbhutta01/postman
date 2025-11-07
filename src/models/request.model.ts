import mongoose, { mongo } from "mongoose";

const requestSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      method: {
         type: String,
         enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
         default: "GET",
      },
      url: {
         type: String,
         required: true,
      },
      parameters:{
         type: mongoose.Schema.Types.Mixed,
      },
      headers:{
         type: mongoose.Schema.Types.Mixed,
      },
      body: {
         type: mongoose.Schema.Types.Mixed,
      },
      response: {
         type: mongoose.Schema.Types.Mixed,
      },
      collectionId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Collection",
         required: true,
      },
   },
   { timestamps: true }
);

const Request =
   mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;
