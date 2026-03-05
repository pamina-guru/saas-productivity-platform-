import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { ui } from "../ui/ui";

export default function AppDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/tasks");
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.isCompleted).length;
    const open = total - done;
    const rate = total ? Math.round((done / total) * 100) : 0;
    return { total, done, open, rate };
  }, [tasks]);

  const miniCard =
    "rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-6";

  return (
    <div className={ui.page}>
      <div className={ui.pageHeaderCard}>
        <div className={ui.pageHeaderInner}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className={ui.h1}>Overview</div>
              <div className={ui.sub}>Track progress at a glance.</div>
            </div>
            <span className={ui.chip}>
              {loading ? "Syncing…" : "Up to date"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className={miniCard}>
          <div className="text-sm text-white/55">Total tasks</div>
          <div className="mt-3 text-4xl font-extrabold tracking-tight">
            {stats.total}
          </div>
        </div>

        <div className={miniCard}>
          <div className="text-sm text-white/55">Open tasks</div>
          <div className="mt-3 text-4xl font-extrabold tracking-tight">
            {stats.open}
          </div>
        </div>

        <div className={miniCard}>
          <div className="text-sm text-white/55">Completed</div>
          <div className="mt-3 text-4xl font-extrabold tracking-tight">
            {stats.done}
          </div>
        </div>

        <div className={miniCard}>
          <div className="text-sm text-white/55">Completion rate</div>
          <div className="mt-3 text-4xl font-extrabold tracking-tight">
            {stats.rate}%
          </div>
        </div>
      </div>
    </div>
  );
}
