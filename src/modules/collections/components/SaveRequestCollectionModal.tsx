"use client";

import Modal from "@/components/ui/modal";

import { Folder, Plus, Search, X } from "lucide-react";
import React, { useState, useEffect, act } from "react";
import { toast } from "sonner";
import { useAddRequestToCollection } from "@/modules/request/hooks/request";
import { useWorkspaceStore } from "@/modules/layout/store";
import { useToGetCollections } from "../hooks/collection";
import { Button } from "@/components/ui/button";

const SaveRequestToCollectionModal = ({
   isModalOpen,
   setIsModalOpen,
   requestData = {
      name: "Untitled",
      url: "https://echo.hoppscotch.io",
      method: "GET",
   },
   initialName = "Untitled",
   collectionId,
}: {
   isModalOpen: boolean;
   setIsModalOpen: (open: boolean) => void;
   requestData?: {
      name: string;
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      url: string;
   };
   initialName?: string;
   collectionId?: string;
}) => {
   const [requestName, setRequestName] = useState(initialName);
   const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
      collectionId || ""
   );
   const [searchTerm, setSearchTerm] = useState("");

   const { selectedWorkspace } = useWorkspaceStore();
   const {
      data: collections,
      isLoading,
      isError,
   } = useToGetCollections(selectedWorkspace?._id!);
   const { mutateAsync, isPending } =
      useAddRequestToCollection(selectedCollectionId);

   useEffect(() => {
      if (isModalOpen) {
         setRequestName(requestData.name || initialName);
         setSelectedCollectionId(collectionId || "");
         setSearchTerm("");
      }
   }, [isModalOpen, requestData.name, initialName]);

   useEffect(() => {
      if (!isModalOpen) return;
      if (collectionId) return;
      if (!selectedCollectionId && collections && collections.length > 0) {
         setSelectedCollectionId(collections[0].id);
      }
   }, [isModalOpen, collections, collectionId, selectedCollectionId]);

   const requestColorMap: Record<
      "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      string
   > = {
      ["GET"]: "text-green-500",
      ["POST"]: "text-indigo-500",
      ["PUT"]: "text-yellow-500",
      ["DELETE"]: "text-red-500",
      ["PATCH"]: "text-orange-500",
   };

   const filteredCollections =
      collections?.filter((collection: any) =>
         collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

   const selectedCollection = collections?.find(
      (c: any) => c._id === selectedCollectionId
   );

   const handleSubmit = async () => {
      if (!requestName.trim()) {
         toast.error("Please enter a request name");
         return;
      }

      if (!selectedCollectionId) {
         toast.error("Please select a collection");
         return;
      }

      try {
         await mutateAsync({
            url: requestData.url.trim(),
            method: requestData.method,
            name: requestName.trim(),
         });

         toast.success(
            `Request saved to "${selectedCollection?.name}" collection`
         );
         setIsModalOpen(false);
      } catch (err) {
         toast.error("Failed to save request to collection");
         console.error("Failed to save request to collection:", err);
      }
   };

   return (
      <Modal
         title="Save as"
         description=""
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSubmit={handleSubmit}
         submitText={isPending ? "Saving..." : "Save"}
         submitVariant="default">
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium mb-2 dark:text-white text-zinc-700">
                  Request name
               </label>
               <div className="relative">
                  <input
                     className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-20"
                     placeholder="Enter request name..."
                     value={requestName}
                     onChange={(e) => setRequestName(e.target.value)}
                     autoFocus
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                     <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                           requestColorMap[requestData.method]
                        } bg-zinc-700`}>
                        {requestData.method}
                     </span>
                  </div>
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium mb-2 dark:text-zinc-200 text-zinc-700">
                  Select location
               </label>

               <div className="flex items-center space-x-2 text-sm dark:text-zinc-400 text-zinc-700 mb-3">
                  <span>{selectedWorkspace?.name || "workspace"}</span>
                  <span className="font-bold text-yellow-500 text-2xl">
                     &#8594;
                  </span>
                  <span>Collections</span>
               </div>

               {/* Search */}
               <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                     type="text"
                     placeholder="Search"
                     className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>

               <div className="space-y-1 max-h-48 overflow-y-auto">
                  {isLoading ? (
                     <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-zinc-600 border-t-indigo-500 rounded-full animate-spin"></div>
                        <span className="ml-2 text-sm dark:text-zinc-400 text-zinc-700">
                           Loading collections...
                        </span>
                     </div>
                  ) : isError ? (
                     <div className="text-center py-4 text-red-400 text-sm">
                        Failed to load collections
                     </div>
                  ) : filteredCollections.length === 0 ? (
                     <div className="text-center py-4 text-zinc-500 text-sm">
                        {searchTerm
                           ? "No collections found"
                           : "No collections available"}
                     </div>
                  ) : (
                     filteredCollections.map((collection: any) => (
                        <div
                           key={collection._id}
                           onClick={() =>
                              setSelectedCollectionId(collection._id)
                           }
                           className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedCollectionId === collection._id
                                 ? "bg-indigo-600/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                 : "border border-indigo-100"
                           }`}>
                           <div className="flex items-center space-x-3">
                              {selectedCollectionId === collection._id ? (
                                 <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-zinc-700">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                 </div>
                              ) : (
                                 <Folder className="w-4 h-4 dark:text-zinc-400 text-zinc-700" />
                              )}
                              <span
                                 className={`text-sm font-medium ${
                                    selectedCollectionId === collection._id
                                       ? "dark:text-indigo-200 text-zinc-800"
                                       : "dark:text-zinc-200 text-zinc-800"
                                 }`}>
                                 {collection.name}
                              </span>
                           </div>

                           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-6 w-6 p-0">
                                 <span className="text-zinc-500">⋯</span>
                              </Button>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>

            {/* Selected Collection Preview */}
            {selectedCollection && (
               <div className="p-3 bg-zinc-500/50 rounded-lg border border-zinc-700">
                  <div className="flex items-center space-x-2 text-sm">
                     <span className="dark:text-zinc-400 text-zinc-800 font-bold">
                        Saving to:
                     </span>
                     <Folder className="size-4 dark:text-indigo-400 text-indigo-800" />
                     <span className="dark:text-indigo-400 text-indigo-800 font-semibold">
                        {selectedCollection.name}
                     </span>
                  </div>
               </div>
            )}

            {/* URL Preview (Optional) */}
            <div className="p-2 bg-zinc-900 rounded border border-zinc-700">
               <div className="flex items-center space-x-2 text-xs">
                  <span className="dark:text-zinc-500 text-zinc-200 font-bold">
                     URL:
                  </span>
                  <span className="text-indigo-400 truncate">
                     {requestData.url}
                  </span>
               </div>
            </div>
         </div>
      </Modal>
   );
};

export default SaveRequestToCollectionModal;
