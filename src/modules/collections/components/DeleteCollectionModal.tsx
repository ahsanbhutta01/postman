"use client";

import { useState } from "react";
import { useDeleteCollection } from "../hooks/collection";
import { toast } from "sonner";
import Modal from "@/components/ui/modal";

const DeleteCollectionModal = ({
   isModalOpen,
   setIsModalOpen,
   collectionId,
}: {
   isModalOpen: boolean;
   setIsModalOpen: (open: boolean) => void;
   collectionId: string;
}) => {
   const { mutateAsync, isPending } = useDeleteCollection(collectionId);

   async function handleDelete() {
      try {
         await mutateAsync();
         toast.success("Collection deleted successfully!");
         setIsModalOpen(false);
      } catch (error) {
         toast.error("Failed to delete collection");
         console.error("Failed to delete collection", error);
      }
   }

   return (
      <Modal
         title="Delete Collection"
         description="Are you sure you want to delete this collection? THis action cannot be undo"
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSubmit={handleDelete}
         submitText={isPending ? "Deleting..." : "Delete"}
         submitVariant="destructive">
         <p className="text-lg text-red-500">
            Once deleted, all requests and data in this collection will be
            permanently removed.
         </p>
      </Modal>
   );
};

export default DeleteCollectionModal;
