interface StatusBadgeProps {
  status: string;
}

const colorMap: Record<string, string> = {
  available: "bg-green-500",
  in: "bg-green-500",
  checked_out: "bg-red-500",
  out: "bg-zinc-500",
  maintenance: "bg-yellow-500",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = colorMap[status] ?? "bg-zinc-500";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full bg-white/60`} />
      {status.replace("_", " ")}
    </span>
  );
}
