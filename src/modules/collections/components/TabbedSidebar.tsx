"use client";

import { useState } from "react";
import { useToGetCollections } from "../hooks/collection";
import {
   Archive,
   Clock,
   Code,
   ExternalLink,
   HelpCircle,
   Loader,
   Plus,
   Search,
   Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CreateCollection from "./CreateCollection";
import EmptyCollection from "./EmptyCollection";
import CollectionFolder from "./CollectionFolder";

interface Props {
   currentWorkspace: {
      _id: string;
      name: string;
   };
}

interface CollectionProp{
      _id: string;
      name: string;
      updatedAt: Date;
      createdAt: Date;
      workspaceId: string;
   
}

const sidebarItem = [
   { icon: Archive, label: "Collections" },
   { icon: Clock, label: "History" },
   { icon: Share2, label: "Share" },
   { icon: Code, label: "Code" },
];

const TabbedSidebar = ({ currentWorkspace }: Props) => {
   const [activeTab, setActiveTab] = useState("Collections");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { data: collections, isPending } = useToGetCollections(
      currentWorkspace?._id
   );

   function renderTabContent() {
      switch (activeTab) {
         case "Collections":
            return (
               <div className="h-full bg-zinc-950 text-zinc-100 flex flex-col">
                  <section className="flex items-center justify-between p-4 border-b border-zinc-800">
                     <div className="flex items-center space-x-2">
                        <span className="text-sm text-zinc-400">
                           {currentWorkspace?.name}
                        </span>
                        <span className="text-yellow-300">&#129058;</span>
                        <span className="text-sm font-medium">Collections</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <HelpCircle className="size-4 text-zinc-400 cursor-pointer" />
                        <ExternalLink className="size-4 text-zinc-400 cursor-pointer" />
                     </div>
                  </section>

                  <section className="p-4 border-b border-zinc-800">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4" />
                        <input
                           type="text"
                           placeholder="Search..."
                           className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                     </div>
                  </section>

                  <section className="px-3 py-2 border-b border-zinc-800">
                     <Button
                        variant="ghost"
                        onClick={() => setIsModalOpen(true)}
                        className="cursor-pointer transition-all duration-600">
                        <Plus className="size-4" />
                        <span className="text-sm font-medium">New</span>
                     </Button>
                  </section>

                  {
                     collections && collections.length > 0 ?  (
                        collections.map((collection: CollectionProp)=>(
                           <div className="flex flex-col justify-start items-start p-3 border-b border-zinc-800 w-full" key={collection?._id}>
                              <CollectionFolder collection={collection}/>
                           </div>
                        ))
                     ) : (<EmptyCollection/>)
                  }
               </div>
            );
         default:
            return (
               <div className="p-4 text-zinc-400">
                  Select a tab to view content
               </div>
            );
      }
   }

   if (isPending) {
      return (
         <div className="flex flex-col items-center justify-center h-full">
            <Loader className="animate-spin size-6 text-indigo-500" />
         </div>
      );
   }

   return (
      <div className="flex h-screen bg-zinc-900">
         <section className="w-12 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 space-y-4">
            {sidebarItem.map((item, index) => (
               <div
                  key={index}
                  onClick={() => setActiveTab(item.label)}
                  className={cn(
                     "size-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors",
                     activeTab === item.label
                        ? "bg-indigo-600 text-white"
                        : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
                  )}>
                  <item.icon className="size-4" />
               </div>
            ))}
         </section>

         <section className="flex-1 bg-zinc-900 overflow-y-auto">
            {renderTabContent()}
         </section>

         <CreateCollection
            workspaceId={currentWorkspace?._id}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
         />
      </div>
   );
};

export default TabbedSidebar;
