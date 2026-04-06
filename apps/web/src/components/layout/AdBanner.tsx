import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdBanner() {
  return (
    <div className="border border-dashed border-[--border] rounded-xl p-4 h-[200px] flex flex-col items-center justify-center gap-2">
      <span className="text-[10px] uppercase tracking-widest text-[--muted-foreground] mb-2">
        Advertisement
      </span>
      <Rocket className="h-8 w-8 text-[--primary]" />
      <span className="text-lg font-bold text-[--foreground]">Upgrade to Pro</span>
      <span className="text-sm text-[--muted-foreground] text-center">
        Remove ads + unlimited hearts
      </span>
      <Button variant="outline" size="sm" className="mt-1">
        Get Pro
      </Button>
    </div>
  );
}
