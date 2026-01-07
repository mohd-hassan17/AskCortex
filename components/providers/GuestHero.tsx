import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export const GuestHero = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Background Effect (Subtler) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

      <div className="max-w-3xl w-full space-y-6 text-center">
        
        {/* 1. High-Priority Badges (The "30+ Models" feature you wanted) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs md:text-sm font-normal bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200 dark:border-blue-900 transition-colors">
            <Globe className="mr-1.5 h-3.5 w-3.5" />
            Live Web Search
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs md:text-sm font-normal bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-200 dark:border-purple-900 transition-colors">
            <Cpu className="mr-1.5 h-3.5 w-3.5" />
            30+ LLMs Available
          </Badge>
        </div>

        {/* 2. Headline & Subhead (Tighter vertical spacing) */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Research at the speed of thought.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Access GPT-4, Claude 3.5, and Llama 3 side-by-side with real-time web citations. 
            No subscriptions required to start.
          </p>
        </div>

        {/* 3. Compact Feature Cards (Horizontal on desktop, stacked but small on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-2">
           <CompactCard 
             title="Web Augmented" 
             desc="Real-time data, not hallucinations."
             icon={<Globe className="w-4 h-4 text-blue-500" />}
           />
           <CompactCard 
             title="Model Agnostic" 
             desc="Switch AI brains instantly."
             icon={<Cpu className="w-4 h-4 text-purple-500" />}
           />
           <CompactCard 
             title="Deep Research" 
             desc="Synthesized reports & citations."
             icon={<Sparkles className="w-4 h-4 text-amber-500" />}
           />
        </div>

        {/* 4. Action Area */}
        <div className="pt-4">
          <Button asChild className="rounded-full px-8 h-10 md:h-11 shadow-md hover:scale-105 transition-transform">
             <Link href="/sign-in">
                Start Researching <ArrowRight className="ml-2 h-4 w-4" />
             </Link>
          </Button>
          <p className="mt-3 text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            Powered by Cortex AI
          </p>
        </div>

      </div>
    </div>
  );
};

// A smaller, denser card component
function CompactCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 hover:border-border transition-colors text-center">
      <div className="mb-2 p-2 rounded-full bg-background shadow-sm border border-border/50">
        {icon}
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  )
}