import React from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import RequestBar from "./RequestBar";
import RequestEditorArea from "./RequestEditorArea";

const RequestEditor = () => {
   const { tabs, activeTabId, updateTab } = useRequestPlaygroundStore();
   const activeTab = tabs.find((t) => t._id === activeTabId) || tabs[0];

   if (!activeTabId) return null;
   return (
      <div className="flex flex-col items-center justify-start py-4 px-4">
         <RequestBar tab={activeTab} updateTab={updateTab} />

         <section className="flex flex-1 flex-col w-full justify-start mt-4 items-center">
            <RequestEditorArea tab={activeTab} updateTab={updateTab} />
         </section>
      </div>
   );
};

export default RequestEditor;
