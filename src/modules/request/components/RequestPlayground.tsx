"use client";

import { useState } from "react";
import { useSaveRequest } from "../hooks/request";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { Unplug } from "lucide-react";
import TabBar from "./TabBar";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import RequestEditor from "./RequestEditor";
import SaveRequestToCollectionModal from "@/modules/collections/components/SaveRequestCollectionModal";

const RequestPlayground = () => {
   const { tabs, activeTabId, addTab } = useRequestPlaygroundStore();
   const activeTab = tabs.find((t) => t._id === activeTabId);

   const { mutateAsync, isPending } = useSaveRequest(activeTab?.requestId!);
   const [showSaveModal, setShowSaveModal] = useState(false);

   useHotkeys(
      "ctrl+g, meta+shift+g",
      (e) => {
         e.preventDefault();
         e.stopPropagation();
         addTab();
         toast.success("New Request created");
      },
      {
         preventDefault: true,
         enableOnFormTags: true,
      },
      []
   );

   function getCurrentRequestData() {
      if (!activeTab) {
         return {
            name: "Untitled",
            method: "GET" as const,
            url: "https://echo.hoppscotch.io",
         };
      }

      return {
         name: activeTab.title,
         method: activeTab.method as
            | "GET"
            | "POST"
            | "PUT"
            | "PATCH"
            | "DELETE",
         url: activeTab.url,
      };
   }
   useHotkeys(
      "ctrl+s, meta+s",
      async (e) => {
         e.preventDefault();
         e.stopPropagation();

         if (!activeTab) {
            toast.error("No active request to save");
            return;
         }

         if (activeTab.requestId && activeTab.collectionId) {
            try {
               await mutateAsync({
                  url: activeTab.url || "https://echo.hoppscotch.io",
                  method: activeTab.method as
                     | "GET"
                     | "POST"
                     | "PUT"
                     | "PATCH"
                     | "DELETE",
                  name: activeTab.title || "Untitled Request",
                  body: activeTab.body,
                  headers: activeTab.headers,
                  parameters: activeTab.parameters,
               });
               toast.success("Request Updated");
            } catch (error) {
               toast.error("Failed to update request");
               console.error("Failed to update request", error);
            }
         } else {
            setShowSaveModal(true);
         }
      },
      { preventDefault: true, enableOnFormTags: true },
      [activeTab]
   );

   if (!activeTab) {
      return (
         <div className="flex space-y-4 flex-col h-full items-center justify-center">
            <section className="flex flex-col justify-center items-center size-40 border rounded-full bg-zinc-900">
               <Unplug size={80} className="text-indigo-400" />
            </section>

            <section className="bg-zinc-900 p-4 rounded-lg space-y-2">
               <div className="flex justify-between items-center gap-8">
                  <kbd className="px-2 py-1 bg-zinc-800 text-indigo-400 text-sm rounded border">
                     Ctrl+G
                  </kbd>
                  <span className="text-zinc-400 font-semibold">
                     New Request
                  </span>
               </div>
               <div className="flex justify-between items-center gap-8">
                  <kbd className="px-2 py-1 bg-zinc-800 text-indigo-400 text-sm rounded border">
                     Ctrl+S
                  </kbd>
                  <span className="text-zinc-400 font-semibold">
                     Save Request
                  </span>
               </div>
            </section>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full">
         <TabBar />
         <div className="flex-1 overflow-auto">
            <RequestEditor />
         </div>
         <SaveRequestToCollectionModal
            isModalOpen={showSaveModal}
            setIsModalOpen={setShowSaveModal}
            requestData={getCurrentRequestData()}
            initialName={getCurrentRequestData().name}
         />
      </div>
   );
};

export default RequestPlayground;
