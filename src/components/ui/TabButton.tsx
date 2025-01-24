import { cn } from "@/lib/utils";

interface TabButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
  className?: string; // 添加 className 属性
}

export function TabButton({
  active,
  label,
  onClick,
  className,
}: TabButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "tab h-10 px-4 rounded-lg font-medium",
        active && "tab-active",
        className,
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
