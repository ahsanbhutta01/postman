import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   addRequestToCollection,
   getAllRequestFromCollection,
   saveRequest,
   type RequestType,
} from "../actions";

export function useAddRequestToCollection(collectionId: string) {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (value: RequestType) =>
         addRequestToCollection(collectionId, value),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: ["requests", collectionId],
         });
         console.log("Data", data)
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
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (value: RequestType) => saveRequest(id, value),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: ["requests"],
         });
         console.log("Data", data)
      },
   });
}
