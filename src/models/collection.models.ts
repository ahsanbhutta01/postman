import mongoose from "mongoose";
import Request from "./request.model";

const collectionSchema = new mongoose.Schema(
   {
      workspaceId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Workspace",
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

collectionSchema.pre(
   "deleteOne",
   { document: true, query: false },
   async function (next) {
      try {
         await Request.deleteMany({ collectionId: this._id }); // ✅ delete related requests
         next();
      } catch (err) {
         next(err as Error);
      }
   }
);
const Collection =
   mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

export default Collection;
