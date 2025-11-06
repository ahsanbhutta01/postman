"use server";

import { dbConnection } from "@/lib/db";
import Collection from "@/models/collection.models";
import Workspace from "@/models/workspace.model";

export async function createCollection(workspaceId: string, name: string) {
   try {
      await dbConnection();

      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) throw new Error("Workspace not found");

      const collection = await Collection.create({
         name,
         workspaceId: workspace._id,
      });
      workspace.collections.push(collection._id);
      await workspace.save();

      
      return JSON.parse(JSON.stringify(collection));
   } catch (error) {
      console.error("Error creating collection:", error);
      throw error;
   }
}

export async function getCollections(workspaceId: string){
   try {
      await dbConnection();
      const collection = await Collection.find({workspaceId})

      return JSON.parse(JSON.stringify(collection))
   } catch (error) {
      console.error("Error in getting collections")
   }
   
}

export async function editCollection(collectionId: string, name:string){
   try {
      await dbConnection();
      await Collection.findByIdAndUpdate(collectionId, {name}, {new:true})
   } catch (error) {
      console.error("Error in updating collection")
   }
}

export async function deleteCollection(collectionId: string){
   try {
      await dbConnection();
      await Collection.findByIdAndDelete(collectionId)

   } catch (error) {
      console.error("Error in deleting collection")
   }
}
