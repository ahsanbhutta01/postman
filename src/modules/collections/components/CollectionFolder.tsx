"use client";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
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
   Trash,
} from "lucide-react";
import React, { useState } from "react";
import EditCollectionModal from "./EditCollectionModal";
import DeleteCollectionModal from "./DeleteCollectionModal";

interface Props {
   collection: {
      _id: string;
      name: string;
      updatedAt: Date;
      createdAt: Date;
      workspaceId: string;
   };
}

const CollectionFolder = ({ collection }: Props) => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);

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
                     <FilePlus className="size-4 text-zinc-400 hover:text-indigo-400" />

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
            </section>
         </Collapsible>

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
