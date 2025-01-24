interface AppTitleProps {
  title: string;
  subtitle?: string;
}

export function AppTitle({ title, subtitle }: AppTitleProps) {
  return (
    <div className="z-10 text-center mb-8">
      <h1 className="text-5xl font-bold mb-3 text-white tracking-wide drop-shadow-lg">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-200 text-lg drop-shadow">{subtitle}</p>
      )}
    </div>
  );
}
