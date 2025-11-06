"use client";

import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { useCreateCollection } from "../hooks/collection";
import { toast } from "sonner";

interface Props {
   workspaceId: string;
   isModalOpen: boolean;
   setIsModalOpen: (open: boolean) => void;
}

const CreateCollection = ({
   workspaceId,
   isModalOpen,
   setIsModalOpen,
}: Props) => {
   const [name, setName] = useState("");
   const { mutateAsync, isPending } = useCreateCollection(workspaceId);

   async function handleSubmit() {
      if (!name.trim()) return toast.error("Please enter collection name...");
      try {
         await mutateAsync(name);
         toast.success("Collection created successfully!");
         setName("");
         setIsModalOpen(false);
      } catch (error) {
         toast.error("Failed to create Collection");
         console.error("Failed to create Collection", error);
      }
   }

   return (
      <Modal
         title="Add New Collection"
         description="Create a new Collection to organize your requests"
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSubmit={handleSubmit}
         submitText={isPending ? "Creating..." : "Create Collection"}
         submitVariant="default">
         <div className="space-y-4">
            <Input
               className="w-full p-2 border rounded"
               placeholder="Collection name..."
               onChange={(e) => setName(e.target.value)}
               value={name}
            />
         </div>
      </Modal>
   );
};

export default CreateCollection;
