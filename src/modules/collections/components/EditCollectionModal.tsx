"use client";

import { useState } from "react";
import { useEditCollection } from "../hooks/collection";
import { toast } from "sonner";
import Modal from "@/components/ui/modal";

const EditCollectionModal = ({
   isModalOpen,
   setIsModalOpen,
   collectionId,
   initialName,
}: {
   isModalOpen: boolean;
   setIsModalOpen: (open: boolean) => void;
   collectionId: string;
   initialName: string;
}) => {
   const [name, setName] = useState(initialName);
   const { mutateAsync, isPending } = useEditCollection(collectionId, name);

   async function handleSubmit() {
      if (!name.trim()) return;
      try {
         await mutateAsync();
         toast.success("Collection updated successfully!");
         setIsModalOpen(false);
      } catch (error) {
         toast.error("Failed to update collection");
         console.error("Failed to update collection", error);
      }
   }

   return (
      <Modal
         title="Edit Collection"
         description="Rename your collection"
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSubmit={handleSubmit}
         submitText={isPending ? "Saving..." : "Save Changes"}
         submitVariant="default">
         <div className="space-y-4">
            <input
               type="text"
               className="w-full p-2 border rounded"
               placeholder="Collection name..."
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
         </div>
      </Modal>
   );
};

export default EditCollectionModal;
