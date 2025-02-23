"use client";

import { Loader, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogOut = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await fetch("/api/auth/logout", { method: "GET" });
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button
            className="bg-slate-700 hover:bg-slate-600 "
            onClick={handleLogout}
          >
            {loading ?  <Loader className="animate-spin"/> : <LogOutIcon className="text-slate-400" />}
            
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Log Out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LogOut;
