"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import TabbedSidebar from "@/modules/collections/components/TabbedSidebar";
import { useWorkspaceStore } from "@/modules/layout/store";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import { Loader } from "lucide-react";
import React from "react";


const page = () => {
   const { selectedWorkspace } = useWorkspaceStore();
   const { data: currentWorkspace, isPending } = useGetWorkspace(
      selectedWorkspace?._id!
   );

   if (isPending) {
      return (
         <div className="flex flex-col items-center justify-center h-full">
            <Loader className="animate-spin size-6 text-indigo-500" />
         </div>
      );
   }

   return (
      <ResizablePanelGroup direction="horizontal">
         <ResizablePanel defaultSize={65} minSize={40}>
            <h1>Request playground</h1>
         </ResizablePanel>
         <ResizableHandle withHandle/>

         <ResizablePanel defaultSize={35} minSize={25} maxSize={40} className="flex">
            <div className="flex-1">
               <TabbedSidebar currentWorkspace={currentWorkspace}/>
            </div>
         </ResizablePanel>
      </ResizablePanelGroup>
   )
};

export default page;
