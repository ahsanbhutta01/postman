"use client";

import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useCreateWorkspace } from "@/modules/workspace/hooks/workspace";
import { useState } from "react";
import { toast } from "sonner";

const CreateWorkspace = ({
   isModalOpen,
   setIsModelOpen,
}: {
   isModalOpen: boolean;
   setIsModelOpen: (open: boolean) => void;
}) => {
   const [name, setName] = useState("");
   const { mutateAsync, isPending } = useCreateWorkspace();

   async function handleSubmit() {
      if (!name.trim()) return;
      try {
         await mutateAsync(name);
         toast.success("Workspace created successfully!")
         setName("")
         setIsModelOpen(false)
      } catch (error) {
         toast.error("Failed to create workspace")
         console.error("Failed to create workspace", error)
      }
   }

   return (
      <Modal
         title="Add New Workspace"
         description="Create a new workspace to organize your projects"
         isOpen={isModalOpen}
         onClose={() => setIsModelOpen(false)}
         onSubmit={handleSubmit}
         submitText={isPending ? "Creating..." : "Create Workspace"}
         submitVariant="default">
         <div className="space-y-4">
            <Input
               className="w-full p-2 border rounded-sm"
               placeholder="Workspace Name"
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
         </div>
      </Modal>
   );
};

export default CreateWorkspace;
