"use client";

import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   ChevronDown,
   ChevronRight,
   Edit,
   EllipsisVertical,
   FilePlus,
   Folder,
   Loader,
   Trash,
} from "lucide-react";
import React, { useState } from "react";
import EditCollectionModal from "./EditCollectionModal";
import DeleteCollectionModal from "./DeleteCollectionModal";
import AddRequestModal from "./AddRequestModal";
import { useGetAllRequestFromCollection } from "@/modules/request/hooks/request";
import { cn } from "@/lib/utils";
import { RequestType } from "@/modules/request/actions";
import { useRequestPlaygroundStore } from "@/modules/request/store/useRequestStore";

interface Props {
   collection: {
      _id: string;
      name: string;
      updatedAt: Date;
      createdAt: Date;
      workspaceId: string;
   };
}

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

const CollectionFolder = ({ collection }: Props) => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);

   const {
      data: requestData,
      isPending,
      isError,
   } = useGetAllRequestFromCollection(collection?._id);
   const {openRequestTab} = useRequestPlaygroundStore()

   const hasRequest = requestData && requestData.length > 0;

   return (
      <>
         <Collapsible
            open={isCollapsed}
            onOpenChange={setIsCollapsed}
            className="w-full">
            <section className="flex flex-col w-full">
               <div className="flex flex-row justify-between items-center p-2 flex-1 w-full hover:bg-zinc-900 rounded-md">
                  <CollapsibleTrigger className="flex flex-row justify-start items-center space-x-2 flex-1 cursor-pointer">
                     <div className="flex items-center space-x-1">
                        {isCollapsed ? (
                           <ChevronDown className="size-4 text-zinc-400" />
                        ) : (
                           <ChevronRight className="size-4 text-zinc-400" />
                        )}
                        <Folder className="size-5 text-zinc-400" />
                     </div>

                     <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-zinc-200 capitalize">
                           {collection.name}
                        </span>
                     </div>
                  </CollapsibleTrigger>

                  <div className="flex flex-row justify-center items-center space-x-2">
                     <FilePlus
                        className="size-4 text-zinc-400 hover:text-indigo-400"
                        onClick={() => setIsAddRequestOpen(true)}
                     />

                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className="p-1 hover:bg-zinc-800 rounded cursor-pointer">
                              <EllipsisVertical className="size-4 text-zinc-400  hover:text-indigo-400" />
                           </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-42">
                           <DropdownMenuItem
                              onClick={() => setIsAddRequestOpen(true)}>
                              <div className="flex flex-row justify-between items-center w-full cursor-pointer">
                                 <div className="font-semibold flex justify-center items-center">
                                    <FilePlus className="text-green-400 mr-2 size-4" />
                                    Add Request
                                 </div>
                                 <span className="text-xs text-white dark:text-zinc-700 bg-zinc-700 px-1.5 rounded">
                                    ⌘R
                                 </span>
                              </div>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => setIsEditOpen(true)}>
                              <div className="flex flex-row justify-between items-center w-full cursor-pointer">
                                 <div className="font-semibold flex justify-center items-center">
                                    <Edit className="text-blue-400 mr-2 size-4" />
                                    Edit
                                 </div>
                              </div>
                              <span className="text-xs text-white dark:text-zinc-700 bg-zinc-700 px-1.5 rounded">
                                 ⌘E
                              </span>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => setIsDeleteOpen(true)}>
                              <div className="flex flex-row justify-between items-center w-full cursor-pointer">
                                 <div className="font-semibold flex justify-center items-center">
                                    <Trash className="text-red-400 mr-2 size-4" />
                                    Delete
                                 </div>
                              </div>
                              <span className="text-xs  text-white dark:text-zinc-700 bg-zinc-700 px-1.5 rounded">
                                 ⌘D
                              </span>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>

               <CollapsibleContent className="w-full">
                  {isPending ? (
                     <div className="pl-8 py-2">
                        <div className="flex items-center space-x-2">
                           <Loader
                              size={16}
                              className="animate-spin text-indigo-500"
                           />
                           <span className="text-xs text-zinc-500">
                              Loading requests...
                           </span>
                        </div>
                     </div>
                  ) : isError ? (
                     <div className="pl-8 py-2">
                        <span className="text-sx text-red-400">
                           Failed to load requests
                        </span>
                     </div>
                  ) : hasRequest ? (
                     <div className="ml-6 border-l border-zinc-800 pl-4 space-y-1">
                        {requestData?.map((request: RequestType) => (
                           <div
                              key={request?._id}
                              className="flex items-center justify-between py-2 px-3 hover:bg-zinc-900/50 rounded-md cursor-pointer group transition-colors"
                              onClick={()=>openRequestTab(request)}
                              >
                              <div className="flex items-center space-x-3 flex-1">
                                 <div className="flex items-center space-x-2">
                                    {/* @ts-ignore */}
                                    <span
                                       className={cn(
                                          "text-xs font-bold px-2 py-1 rounded bg-zinc-800",
                                          requestColorMap[request.method]
                                       )}>
                                       {request?.method}
                                    </span>
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50" />
                                 </div>
                                 <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm text-zinc-200 truncate font-medium">
                                       {request.name || request.url}
                                    </span>
                                    {request.url && request.name && (
                                       <span className="text-xs text-zinc-500 truncate">
                                          {request.url}
                                       </span>
                                    )}
                                 </div>
                              </div>

                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <button className="p-1 hover:bg-zinc-800 rounded">
                                          <EllipsisVertical className="size-3 text-zinc-400" />
                                       </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-32">
                                       <DropdownMenuItem>
                                          <Edit className="text-blue-400 mr-2 size-3" />
                                          Edit
                                       </DropdownMenuItem>
                                       <DropdownMenuItem>
                                          <Trash className="text-blue-400 mr-2 size-3" />
                                          Delete
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="pl-8 py-2">
                        <span className="text-sx text-red-400">
                           No requests yet
                        </span>
                     </div>
                  )}
               </CollapsibleContent>
            </section>
         </Collapsible>

         <AddRequestModal
            isModalOpen={isAddRequestOpen}
            setIsModalOpen={setIsAddRequestOpen}
            collectionId={collection?._id}
         />

         <EditCollectionModal
            isModalOpen={isEditOpen}
            setIsModalOpen={setIsEditOpen}
            collectionId={collection?._id}
            initialName={collection?.name}
         />

         <DeleteCollectionModal
            isModalOpen={isDeleteOpen}
            setIsModalOpen={setIsDeleteOpen}
            collectionId={collection?._id}
         />
      </>
   );
};

export default CollectionFolder;
