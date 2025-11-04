"use client";

import Loader from "@/app/(workspace)/loading";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { useWorkspaces } from "@/modules/workspace/hooks/workspace";
import { Plus, User } from "lucide-react";
import { useWorkspaceStore } from "../store";
import { useEffect, useState } from "react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectSeparator,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import CreateWorkspace from "./CreateWorkspace";

const Workspace = () => {
   const [isModalOpen, setIsModelOpen] = useState(false);
   const { data: workspaces = [], isLoading } = useWorkspaces();
   const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceStore();

   useEffect(() => {
      if (workspaces && workspaces.length > 0 && !selectedWorkspace) {
         setSelectedWorkspace(workspaces[0]);
      }
   }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

   if (isLoading) return <Loader />;
   if (!workspaces || workspaces.length === 0) {
      return (
         <div className="font-semibold text-indigo-400">No Workspace Found</div>
      );
   }
   return (
      <>
         <Hint label="Change Workspace">
            <Select
               value={selectedWorkspace?._id}
               onValueChange={(id) => {
                  const ws = workspaces.find((w) => w._id === id);
                  if (ws) setSelectedWorkspace(ws);
               }}>
               <SelectTrigger className="border border-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 text-indigo-400 hover:text-indigo-300 flex flex-row items-center space-x-1">
                  <User className="size-4 text-indigo-400" />
                  <span className="text-sm text-indigo-400 font-semibold">
                     <SelectValue placeholder="Select Workspace" />
                  </span>
               </SelectTrigger>
               <SelectContent>
                  {workspaces.map((ws) => (
                     <SelectItem key={ws._id} value={ws._id}>
                        {ws.name}
                     </SelectItem>
                  ))}
                  <SelectSeparator className="my-1" />
                  <div className="p-2 flex flex-row justify-between items-center">
                     <div className="p-2 flex flex-row justify-between items-center w-full">
                        <span className="text-sm font-semibold text-zinc-600">
                           My Workspaces
                        </span>
                        <Button
                           size={"icon"}
                           variant={"outline"}
                           onClick={() => setIsModelOpen(true)}>
                           <Plus size={16} className="text-indigo-400" />
                        </Button>
                     </div>
                  </div>
               </SelectContent>
            </Select>
         </Hint>

         <CreateWorkspace
            isModalOpen={isModalOpen}
            setIsModelOpen={setIsModelOpen}
         />
      </>
   );
};

export default Workspace;
