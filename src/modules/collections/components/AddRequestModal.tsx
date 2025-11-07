"use client";

import { useWorkspaceStore } from "@/modules/layout/store";
import { useEffect, useState } from "react";
import { useToGetCollections } from "../hooks/collection";
import { useAddRequestToCollection } from "@/modules/request/hooks/request";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Folder, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
   isModalOpen: boolean;
   setIsModalOpen: (open: boolean) => void;
   requestData?: {
      name: string;
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      url: string;
   };
   initialName?: string;
   collectionId?: string;
}

const AddRequestModal = ({
   isModalOpen,
   setIsModalOpen,
   requestData = {
      name: "Untitled",
      url: "https://echo.hoppscotch.io",
      method: "GET",
   },
   initialName = "Untitled",
   collectionId,
}: Props) => {
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

   useEffect(() => {
      if (isModalOpen) {
         setRequestName(requestData?.name || initialName);
         setSelectedCollectionId(collectionId || "");
         setSearchTerm("");
      }
   }, [isModalOpen, requestData.name, initialName]);

   useEffect(() => {
      if (!isModalOpen) return;
      if (collectionId) return;

      if (!selectedCollectionId && collections && collections.length > 0) {
         setSelectedCollectionId(collections[0]?._id);
      }
   }, [isModalOpen, collections, collectionId, selectedCollectionId]);

   const filteredCollections =
      collections?.filter((collection: any) =>
         collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
   const selectedCollection = collections?.find(
      (c: any) => c?._id === selectedCollectionId
   );

   async function handleSubmit() {
      if (!requestName.trim()) {
         toast.error("Please enter a request name");
         return;
      }
      if (!selectedCollectionId) {
         toast.error("Please selected a collection");
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
      } catch (error) {
         toast.error("Failed to save request to collection");
         console.error("Failed to save request to collection", error);
      }
   }

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
            <section>
               <label className="block text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-200">
                  Request Name
               </label>
               <div className="relative">
                  <Input
                     type="text"
                     className="w-full p-3 bg-zinc-800 border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500"
                     value={requestName}
                     onChange={(e) => setRequestName(e.target.value)}
                     autoFocus
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                     <span
                        className={cn(
                           "text-xs font-bold px-2 py-1 rounded bg-zinc-700",
                           requestColorMap[requestData.method]
                        )}>
                        {requestData.method}
                     </span>
                  </div>
               </div>
            </section>

            <section>
               <label
                  htmlFor=""
                  className="block text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-200">
                  Select location
               </label>
               <span>{selectedWorkspace?.name}</span>
               <span className="text-yellow-500 font-bold text-3xl mx-1.5 relative top-1">
                  &#8594;
               </span>
               <span>Collections</span>

               <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-zinc-300" />
                  <Input
                     type="text"
                     placeholder="Search..."
                     className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>

               <div className="space-y-1 max-h-48 overflow-y-auto">
                  {isLoading ? (
                     <div className="flex items-center justify-center py-8">
                        <div className="size-5 border-2 border-zinc-600 border-t-indigo-500 rounded-full animate-spin" />
                        <span className="ml-2 text-sm text-zinc-400">
                           Loading Collections...
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
                           key={collection?._id}
                           onClick={() =>
                              setSelectedCollectionId(collection?._id)
                           }
                           className={cn(
                              "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200",
                              selectedCollectionId === collection?._id
                                 ? "bg-indigo-600/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                 : "hover:bg-zinc-800 border border-transparent"
                           )}>
                           <div className="flex items-center space-x-3">
                              {selectedCollectionId === collection?._id ? (
                                 <div className="size-4 rounded-full bg-indigo-500 flex items-center justify-center">
                                    <div className="size-2 rounded-full bg-white" />
                                 </div>
                              ) : (
                                 <Folder className="size-4 text-zinc-400" />
                              )}
                              <span
                                 className={cn(
                                    "text-sm font-medium",
                                    selectedCollectionId === collection?._id
                                       ? "dark:text-indigo-200"
                                       : "dark:text-zinc-200 "
                                 )}>
                                 {collection?.name}
                              </span>
                           </div>

                           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="size-6 p-0">
                                 <span className="text-zinc-590">...</span>
                              </Button>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </section>

            {selectedCollection && (
               <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <div className="flex items-center space-x-2 text-sm">
                     <span className="dark:text-zinc-400 text-indigo-800 font-bold text-md">
                        Saving to:
                     </span>
                     <Folder className="size-5 dark:text-indigo-400 text-indigo-700" />
                     <span className="dark:text-indigo-400 font-medium text-indigo-700 text-[15px]">
                        {selectedCollection.name}
                     </span>
                  </div>
               </div>
            )}

            <section className="p-2 bg-zinc-900 rounded border border-zinc-700">
               <div className="flex items-center space-x-2 text-xs">
                  <span className="dark:text-zinc-500 text-zinc-300 font-bold">
                     URL:
                  </span>
                  <span className="text-zinc-300 truncate">
                     {requestData?.url}
                  </span>
               </div>
            </section>
         </div>
      </Modal>
   );
};

export default AddRequestModal;
