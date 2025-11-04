
import { create } from "zustand";

type Workspace = {
   _id: string;
   name: string;
};

interface WorkspaceState {
   selectedWorkspace: Workspace | null;
   setSelectedWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>(
   (set) => ({
      selectedWorkspace: null,
      setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
   })
);
