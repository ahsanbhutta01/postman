import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   addRequestToCollection,
   getAllRequestFromCollection,
   saveRequest,
   type RequestType,
} from "../actions";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

export function useAddRequestToCollection(collectionId: string) {
   const { updateTabFromSavedRequest, activeTabId } =
      useRequestPlaygroundStore();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (value: RequestType) =>
         addRequestToCollection(collectionId, value),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: ["requests", collectionId],
         });
         //@ts-ignore
         updateTabFromSavedRequest(activeTabId!, data);
      },
   });
}

export function useGetAllRequestFromCollection(collectionId: string) {
   return useQuery({
      queryKey: ["requests", collectionId],
      queryFn: async () => getAllRequestFromCollection(collectionId),
   });
}

export function useSaveRequest(id: string) {
   const { updateTabFromSavedRequest, activeTabId } =
      useRequestPlaygroundStore();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (value: RequestType) => saveRequest(id, value),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: ["requests"],
         });
         //@ts-ignore
         updateTabFromSavedRequest(activeTabId!, data);
      },
   });
}
