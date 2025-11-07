import React, { useRef, useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

const requestColorMap: Record<string, string> = {
   GET: "text-green-500",
   POST: "text-indigo-500",
   PUT: "text-yellow-500",
   DELETE: "text-red-500",
   PATCH: "text-orange-500",
};

const TabBar = () => {
   const { tabs, activeTabId, setActiveTab, addTab, closeTab } =
      useRequestPlaygroundStore();
   const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

   function onDoubleClick(id: string) {}

   return (
      <>
         <div className="flex items-center border-b border-zinc-800 bg-zinc-900">
            {tabs?.map((tab) => (
               <div
                  key={tab._id}
                  onDoubleClick={() => onDoubleClick(tab._id)}
                  onClick={() => setActiveTab(tab._id)}
                  className={cn(
                     "group px-4 py-2 flex items-center gap-2 cursor-pointer",
                     activeTabId === tab._id
                        ? "bg-zinc-800 text-white border-t-2 border-indigo-500 rounded-sm mx-2 my-2"
                        : "text-zinc-400 hover:text-white"
                  )}>
                  <span
                     className={`font-semibold text-xs
                        ${requestColorMap[tab.method] || "text-gray-500"}`}>
                     {tab.method}
                  </span>
                  <p className="max-w-xs text-xs truncate font-semibold flex items-center gap-1">
                     {tab.title}
                     {tab.unSavedChanges && (
                        <span className="text-red-500 group-hover:hidden transition-all ease-in-out">
                           •
                        </span>
                     )}
                  </p>
                  <X
                     className="hidden group-hover:inline size-4 ml-2 hover:text-red-500 transition-all ease-in-out"
                     onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab._id);
                     }}
                  />
               </div>
            ))}

            <button
               onClick={addTab}
               className="px-3 py-2 dark:text-zinc-400 text-white cursor-pointer hover:text-white">
               <Plus className="size-5 font-bold"/>
            </button>
         </div>
      </>
   );
};

export default TabBar;
