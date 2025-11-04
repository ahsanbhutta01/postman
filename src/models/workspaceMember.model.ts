import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
   {
      role: {
         type: String,
         enum: ["ADMIN", "MEMBER", "VIEWER"],
         default: "ADMIN",
         required: true,
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      workspaceId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Workspace",
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

workspaceMemberSchema.index(
   { userId: 1, workspaceId: 1 },
   { unique: true }
);

const WorkspaceMember =
   mongoose.models.WorkspaceMember ||
   mongoose.model("WorkspaceMember", workspaceMemberSchema);

export default WorkspaceMember;
