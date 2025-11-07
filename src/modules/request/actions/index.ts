"use server";

import { dbConnection } from "@/lib/db";
import Request from "@/models/request.model";

export type RequestType = {
   _id?:string;
   name: string;
   method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
   url: string;

   body?: string;
   headers?: string;
   parameters?: string;
};

export async function addRequestToCollection(
   collectionId: string,
   value: RequestType
) {
   try {
      await dbConnection();

      const request = await Request.create({
         collectionId,
         name: value?.name,
         method: value?.method,
         url: value?.url,
         body: value?.body,
         headers: value?.headers,
         parameters: value?.parameters,
      });

      return JSON.parse(JSON.stringify(request));
   } catch (error) {
      console.error("Failed to create Request", error);
   }
}

export async function saveRequest(id: string, value: RequestType) {
   try {
      await dbConnection();

      const request = await Request.findByIdAndUpdate(id, {
         name: value?.name,
         method: value?.method,
         url: value?.url,
         body: value?.body,
         headers: value?.headers,
         parameters: value?.parameters,
      });

      return JSON.parse(JSON.stringify(request))
   } catch (error) {
      console.error("Error in updating Request", error)
   }
}

export async function getAllRequestFromCollection (collectionId: string){
   try {
      await dbConnection()

      const request =await Request.find({
         collectionId
      })

      return JSON.parse(JSON.stringify(request))
   } catch (error) {
      console.error("Error getting All Request from collection", error)
   }
}