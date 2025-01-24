interface TabButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

export function TabButton({ active, label, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tab flex-1 transition-all duration-200 ${
        active ? "tab-active bg-primary text-white shadow-md" : "text-white"
      }`}
    >
      {label}
    </button>
  );
}
