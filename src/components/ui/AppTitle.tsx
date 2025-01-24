import { cn } from "@/lib/utils";

interface AppTitleProps {
  title: string;
  subtitle?: string;
}

export function AppTitle({ title, subtitle }: AppTitleProps) {
  return (
    <div className="z-10 text-center mb-3 sm:mb-4 md:mb-6">
      <h1
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
          "mb-1.5 sm:mb-2 md:mb-3",
          "text-transparent bg-clip-text",
          "bg-gradient-to-r from-white via-white/90 to-white/80",
          "tracking-wide drop-shadow-lg",
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            "text-sm sm:text-base md:text-lg",
            "text-gray-200/90 drop-shadow",
            "tracking-wide font-medium",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
