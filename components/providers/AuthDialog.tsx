// components/auth-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, History, Sparkles, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100 p-0 overflow-hidden border-none shadow-2xl">
        
        {/* Decorative Top Gradient */}
        <div className="h-32  flex items-center justify-center relative">
            <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,transparent,black)]" />
            
            <div className="relative z-10 p-4 rounded-full bg-background/50 backdrop-blur-xl border border-white/20 shadow-lg ring-1 ring-black/5">
              <Avatar className="h-12 w-12 rounded-lg">
                <AvatarImage src="/favicon.ico" alt="Cortex" className="object-contain" />
                <AvatarFallback>CX</AvatarFallback>
              </Avatar>
            </div>
        </div>

        <div className="px-6 pb-6 pt-2 text-center">
          <DialogHeader className="space-y-3 mb-6">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Unlock full access
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground max-w-xs mx-auto">
              Sign in to unlock the full power of Cortex AI and save your research.
            </DialogDescription>
          </DialogHeader>

          {/* Value Props Grid */}
          <div className="grid grid-cols-3 gap-2 mb-8 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-muted/50">
              <History className="h-5 w-5 text-primary" />
              <span>Chat History</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Pro Models</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Zap className="h-5 w-5 text-primary" />
              <span>Fast Search</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full font-semibold rounded-xl text-md h-12 shadow-md hover:shadow-lg transition-all">
              <Link href="/sign-in" className="flex items-center gap-2">
                Sign up
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            </Button>
            
            <p className="px-8 text-center text-[10px] text-muted-foreground leading-relaxed">
              By continuing, you agree to our <span className="underline cursor-pointer hover:text-primary">Terms of Service</span> and <span className="underline cursor-pointer hover:text-primary">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}