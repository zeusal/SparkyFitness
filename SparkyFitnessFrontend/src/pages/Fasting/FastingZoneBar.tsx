import type React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FastingZoneBarProps {
  hoursFasted: number;
}

const ZONES = [
  {
    key: 'anabolic',
    start: 0,
    end: 4,
    color: 'bg-blue-500',
  },
  {
    key: 'catabolic',
    start: 4,
    end: 16,
    color: 'bg-orange-500',
  },
  {
    key: 'fatBurning',
    start: 16,
    end: 24,
    color: 'bg-red-500',
  },
  {
    key: 'ketosis',
    start: 24,
    end: 72,
    color: 'bg-purple-500',
  },
  {
    key: 'deepKetosis',
    start: 72,
    end: 1000,
    color: 'bg-indigo-500',
  },
];

const ZONE_FALLBACK: Record<string, { name: string; desc: string }> = {
  anabolic: { name: 'Anabolic', desc: 'Rising blood sugar.' },
  catabolic: { name: 'Catabolic', desc: 'Blood sugar falls.' },
  fatBurning: { name: 'Fat Burning', desc: 'Ramping up fat burn.' },
  ketosis: { name: 'Ketosis', desc: 'Running on ketones.' },
  deepKetosis: { name: 'Deep Ketosis', desc: 'Autophagy peaks.' },
};

const FastingZoneBar: React.FC<FastingZoneBarProps> = ({ hoursFasted }) => {
  const { t } = useTranslation();
  // Determine current zone index
  const currentZoneIndex = ZONES.findIndex((z) => hoursFasted < z.end);
  const activeIndex =
    currentZoneIndex === -1 ? ZONES.length - 1 : currentZoneIndex;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider mb-1">
        <span>{t('fasting.metabolicState', 'Metabolic State')}</span>
      </div>
      <div className="w-full h-4 bg-secondary rounded-full overflow-hidden flex">
        {ZONES.map((zone, index) => {
          const isPassed = index < activeIndex;
          const isActive = index === activeIndex;

          // Simplified visual width distribution for demo
          // In reality, 0-4 is small compared to 24-72, but we want equal visual steps or proportional?
          // Let's use equal width for readability of stages.
          const width = `${100 / ZONES.length}%`;

          // Calculate opacity: Passed = 100%, Active = Pulse?, Future = 30%
          let opacity = isPassed
            ? 'opacity-100'
            : isActive
              ? 'opacity-100 animate-pulse'
              : 'opacity-20';
          if (isActive) opacity = 'opacity-100 ring-2 ring-white ring-inset';

          const fallback = ZONE_FALLBACK[zone.key];
          const zoneName = t(
            `fasting.zones.${zone.key}`,
            fallback?.name ?? zone.key
          );
          const zoneDesc = t(
            `fasting.zoneDesc.${zone.key}`,
            fallback?.desc ?? ''
          );
          return (
            <TooltipProvider key={zone.key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'h-full transition-all duration-500 cursor-help',
                      zone.color,
                      opacity
                    )}
                    style={{ width }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="font-bold">{zoneName}</div>
                  <div className="text-xs">
                    {zone.start}-{zone.end} hours
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {zoneDesc}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      <div className="flex justify-between text-xs font-medium mt-1">
        <span>0h</span>
        <span>16h</span>
        <span>24h</span>
        <span>72h+</span>
      </div>
    </div>
  );
};

export default FastingZoneBar;
