interface AdSlotProps {
  id?: string;
}

export function AdSlot({ id = 'ad-slot' }: AdSlotProps) {
  return (
    <div
      id={id}
      className="ad-slot my-4 h-24 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400 text-sm"
      aria-label="Advertisement"
      role="complementary"
    >
      Advertisement
    </div>
  );
}
