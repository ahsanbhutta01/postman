import mongoose from "mongoose";

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
   },
   {
      timestamps: true, 
   }
);

workspaceSchema.index({ name: 1, ownerId: 1 }, { unique: true })

const Workspace =
   mongoose.models.Workspace ||
   mongoose.model("Workspace", workspaceSchema);

export default Workspace;