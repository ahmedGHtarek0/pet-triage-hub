import type { CaseStatus } from "@/lib/data";

const statusClasses: Record<CaseStatus, string> = {
  Improving: "status-improving",
  Stable: "status-stable",
  Critical: "status-critical",
  Euthanized: "status-euthanized",
};

export default function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
