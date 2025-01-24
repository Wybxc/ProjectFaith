interface AppTitleProps {
  title: string;
  subtitle?: string;
}

export function AppTitle({ title, subtitle }: AppTitleProps) {
  return (
    <div className="z-10 text-center mb-2 sm:mb-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 text-white tracking-wide drop-shadow-lg">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-gray-200 drop-shadow">
          {subtitle}
        </p>
      )}
    </div>
  );
}
