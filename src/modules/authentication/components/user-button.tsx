'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { CreditCard, LogOut, Settings, UserIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface UserData {
  _id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserButtonProps {
  user: UserData | null;
  onLogout?: () => void | Promise<void>;
  onSettings?: () => void;
  onProfile?: () => void;
  onBilling?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  showEmail?: boolean;
  showMemberSince?: boolean;
}

const UserButton = ({
  user,
  onLogout,
  onSettings,
  onProfile,
  onBilling,
  showBadge=false,
  badgeText="Pro",
  badgeVariant="default",
  size="md",
  showEmail=true,
  showMemberSince=true,
}: UserButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  }
  async function handleLogout() {
    setIsLoading(true);
    try {
      await onSignOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function getUserInitials(name: string | null, email: string | null) {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }

    return "U";
  }

  function formatMemberSince(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  // Avatar Sizes
  const avatarSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  // Don't render if no user
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative ${avatarSizes[size]} rounded-full p-0 hover:bg-accent`}
          disabled={isLoading}
        >
          <Avatar className={avatarSizes[size]}>
            <AvatarImage
              src={user?.image || ""}
              alt={user?.name || "User Avatar"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium ">
              {getUserInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          {showBadge && (
            <Badge
              variant={badgeVariant}
              className="absolute -bottom-1 -right-1 h-5 px-1 text-xs"
            >
              {badgeText}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <section className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="size-12">
                <AvatarImage
                  src={user?.image || ""}
                  alt={user?.name || "User Avatar"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium ">
                  {getUserInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                {showEmail && user?.email && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                )}
                {showBadge && (
                  <Badge variant={badgeVariant} className="w-fit">
                    {badgeText}
                  </Badge>
                )}
              </div>
            </div>
            {showMemberSince && (
              <p className="text-xs text-muted-foreground">
                Member since {formatMemberSince(user?.createdAt)}
              </p>
            )}
          </section>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {onProfile && (
          <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        )}
        {onBilling && (
          <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
            <CreditCard className="mr-2 size-4" />
            Billing
          </DropdownMenuItem>
        )}
        {onSettings && (
          <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 size-4" />
          {isLoading ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
