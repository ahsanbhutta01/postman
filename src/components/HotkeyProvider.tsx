"use client";

import * as React from "react";
import { HotkeysProvider } from "react-hotkeys-hook";

const HotkeyProvider = ({
   children,
   ...props
}: React.ComponentProps<typeof HotkeysProvider>) => {
   return <HotkeysProvider {...props}>{children}</HotkeysProvider>;
};

export default HotkeyProvider;
