
import { currentUser } from "@/modules/authentication/actions/index";
import Header from "@/modules/layout/components/Header";


const RootLayout = async ({ children }: { children: React.ReactNode }) => {
   const user = await currentUser()
   
   return (
      <>
      <Header user={user!}/>
         <main className="max-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex flex-1 overflow-hidden">
            <section className="flex h-full w-full">
               <div className="w-12 border-zinc-800 bg-zinc-900">tabbed left panel</div>
               <div className="flex-1 bg-zinc-900">{children}</div>
            </section>
         </main>
      </>
   );
};

export default RootLayout;
