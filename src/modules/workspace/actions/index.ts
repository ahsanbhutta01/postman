"use server";

import { dbConnection } from "@/lib/db";
import { currentUser } from "@/modules/authentication/actions";
import Workspace from "@/models/workspace.model";
import WorkspaceMember from "@/models/workspaceMember.model";




export const initializeWorkspace = async () => {
   const user = await currentUser();
   if (!user) {
      return { success: false, error: "User not found" };
   }

   try {
      await dbConnection();

      let workspace = await Workspace.findOne({
         name: "Personal Workspace",
         ownerId: user._id,
      });

      if (!workspace) {
         workspace = new Workspace({
            name: "Personal Workspace",
            description:
               "Default workspace for personal use",
            ownerId: user._id,
         });

         await workspace.save();

         const member = new WorkspaceMember({
            userId: user._id,
            workspaceId: workspace._id,
            role: "ADMIN",
         });

         await member.save();

         workspace.members.push(member._id);
         await workspace.save();
      }

      const populatedWorkspace = await Workspace.findById(
         workspace._id
      ).populate("members");

      return {
         success: true,
         workspace: populatedWorkspace,
      };
   } catch (error) {
      console.error("Error initializing workspace:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Unknown error",
      };
   }
};

export async function getWorkspaces() {
   const user = await currentUser();
   if (!user) throw new Error("Unauthorized");

   try {
      await dbConnection();
      const workspaces = await Workspace.find({
         $or: [
            { ownerId: user._id },
            { members: user._id },
         ],
      })
         .populate("members")
         .populate("ownerId")
         .lean()
         .exec()

      return JSON.parse(JSON.stringify(workspaces));
   } catch (error) {
      console.error("Error getting workspaces:", error);
      throw error;
   }
}

export async function createWorkspaces(name: string) {
   const user = await currentUser();
   if (!user) throw new Error("Unathorized");

   try {
      await dbConnection()
      const workspace = new Workspace({
         name,
         ownerId: user._id,
      });
      await workspace.save();

      // Create workspacemember
      const member = new WorkspaceMember({
         userId: user._id,
         workspaceId: workspace._id,
         role: "ADMIN",
      });
      await member.save();

      // Add member to workspace
      workspace.members.push(member._id);
      await workspace.save();

      return JSON.parse(JSON.stringify(workspace));
   } catch (error) {
      console.error("Error getting workspaces:", error);
      throw error;
   }
}


export async function getWorkspaceById(id: string) {
   try {
      await dbConnection();
      
      const workspace = await Workspace.findById(id)
         .populate("members")

      return workspace;
   } catch (error) {
      console.error("Error getting workspace by id:", error);
      throw error;
   }
}

