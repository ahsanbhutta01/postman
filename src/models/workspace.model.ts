import mongoose from "mongoose";
import Collection from "./collection.models";

const workspaceSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         default: "",
      },
      ownerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      members: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkspaceMember",
         },
      ],
      collections: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
         },
      ],
   },
   {
      timestamps: true,
   }
);

workspaceSchema.index({ name: 1, ownerId: 1 }, { unique: true });
workspaceSchema.pre(
   "deleteOne",
   { document: true, query: false },
   async function (next) {
      try {
         await Collection.deleteMany({ workspaceId: this._id });
         next();
      } catch (err) {
         next(err as Error);
      }
   }
);

const Workspace =
   mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);

export default Workspace;
