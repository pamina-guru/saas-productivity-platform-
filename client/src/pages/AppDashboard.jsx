import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";

export default function AppDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.isCompleted).length;
    const open = total - done;
    return { total, done, open };
  }, [tasks]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/tasks");
        setTasks(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container" style={{ padding: 0, maxWidth: 1040 }}>
      <div className="card">
        <div className="cardPad row spread">
          <div>
            <h1 className="h1">Overview</h1>
            <p className="sub" style={{ marginBottom: 0 }}>
              Track progress at a glance.
            </p>
          </div>
          <span className="badge">{loading ? "Loading..." : "Up to date"}</span>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="grid2">
        <div className="card">
          <div className="cardPad">
            <div className="sub" style={{ margin: 0 }}>
              Total tasks
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {stats.total}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardPad">
            <div className="sub" style={{ margin: 0 }}>
              Open tasks
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {stats.open}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardPad">
            <div className="sub" style={{ margin: 0 }}>
              Completed
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {stats.done}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardPad">
            <div className="sub" style={{ margin: 0 }}>
              Completion rate
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {stats.total === 0
                ? "0%"
                : `${Math.round((stats.done / stats.total) * 100)}%`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
