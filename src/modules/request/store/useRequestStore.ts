import { create } from "zustand";
import { nanoid } from "nanoid";

export type RequestTab = {
   _id: string;
   title: string;
   method: string;
   url: string;
   body?: string;
   headers?: string;
   parameters?: string;
   unSavedChanges?: boolean;
   requestId?: string;
   collectionId?: string;
   workspaceId?: string;
};

interface SavedRequest {
   _id: string;
   name: string;
   method: string;
   url: string;
   body?: string;
   headers?: string;
   parameters?: string;
}

type PlaygroundState = {
   tabs: RequestTab[];
   activeTabId: string | null;
   addTab: () => void;
   closeTab: (id: string) => void;
   setActiveTab: (id: string) => void;
   updateTab: (id: string, date: Partial<RequestTab>) => void;
   markUnsaved: (id: string, value: boolean) => void;
   openRequestTab: (req: any) => void;
   updateTabFromSavedRequest: (
      tabId: string,
      savedRequest: SavedRequest
   ) => void;
   // responsiveViewerData: ResponseData | null;
   // setResponseViewerData : (data: ResponseData) =>void
};

//@ts-ignore
export const useRequestPlaygroundStore = create<PlaygroundState>((set) => ({
   tabs: [
      {
         _id: nanoid(),
         title: "Request",
         method: "GET",
         url: "https://echo.hoppscatch.io",
         UnSavedChanges: false,
      },
   ],
   activeTabId: null,

   addTab: () =>
      set((state) => {
         const newTab: RequestTab = {
            _id: nanoid(),
            title: "Untitled",
            method: "GET",
            url: "",
            body: "",
            headers: "",
            parameters: "",
            unSavedChanges: true,
         };
         return {
            tabs: [...state.tabs, newTab],
            activeTabId: newTab._id,
         };
      }),

   closeTab: (id) =>
      set((state) => {
         const newTabs = state.tabs.filter((t) => t._id !== id);
         const newActive =
            state.activeTabId === id && newTabs.length > 0
               ? newTabs[0]._id
               : state.activeTabId;
         return { tabs: newTabs, activeTabId: newActive };
      }),

   setActiveTab: (id) => set({ activeTabId: id }),

   updateTab: (id, data) =>
      set((state) => ({
         tabs: state.tabs.map((t) =>
            t._id === id ? { ...t, ...data, unSavedCanges: true } : t
         ),
      })),

   markUnsaved: (id, value) =>
      set((state) => ({
         tabs: state.tabs.map((t) =>
            t._id === id ? { ...t, unSavedChanges: value } : t
         ),
      })),

   openRequestTab: (req) =>
      set((state) => {
         const existing = state.tabs.find((t) => t.requestId === req._id);
         if (existing) {
            return { activeTabId: existing._id };
         }

         const newTab: RequestTab = {
            _id: nanoid(),
            title: req.name || "Untitled",
            method: req.method,
            url: req.url,
            body: req.body,
            headers: req.headers,
            parameters: req.parameters,
            requestId: req._id,
            collectionId: req.collectionId,
            workspaceId: req.workspaceId,
            unSavedChanges: false,
         };
         return {
            tabs: [...state.tabs, newTab],
            activeTabId: newTab._id,
         };
      }),

   updateTabFromSavedRequest: (tabId: string, savedRequest: SavedRequest) =>
      set((state) => ({
         tabs: state.tabs.map((t) =>
            t._id === tabId
               ? {
                    ...t,
                    _id: savedRequest._id,
                    title: savedRequest.name,
                    method: savedRequest.method,
                    body: savedRequest?.body,
                    headers: savedRequest.headers,
                    parameters: savedRequest?.parameters,
                    url: savedRequest.url,
                    unSavedChanges: false,
                 }
               : t
         ),
         activeTabId: savedRequest._id,
      })),
}));
