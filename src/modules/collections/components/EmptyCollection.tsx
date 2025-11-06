import { Archive, Upload } from "lucide-react";
import React from "react";

const EmptyCollection = () => {
   return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
         <>
            <section className="mb-6">
               <div className="w-24 h-24 border-2 border-zinc-700 rounded-lg flex items-center justify-center">
                  <Archive className="size-12 text-zinc-600" />
               </div>
            </section>

            <h3 className="text-zinc-400 text-sm mb-2">
               Collections are empty
            </h3>
            <p className="text-zinc-500 text-xs mb-8 text-cente">
               Import or Create a collection
            </p>

            <section className="w-full max-w-xs">
               <button className="w-full h-8 flex items-center justify-center rounded-lg gap-1 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                  <Upload className="size-4" />
                  <span>Import</span>
               </button>
            </section>
         </>
      </div>
   );
};

export default EmptyCollection;
