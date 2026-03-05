import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getToken } from "../api/http";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import { ui } from "../ui/ui";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function Tasks() {
  const navigate = useNavigate();

  // Create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toast, setToast] = useState(null);
  const clearToast = () => setToast(null);

  // Search / filter / sort
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | open | done
  const [sort, setSort] = useState("newest"); // newest | oldest | az

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.isCompleted).length;
    const open = total - done;
    return { total, done, open };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    let list = [...tasks];

    if (filter === "open") list = list.filter((t) => !t.isCompleted);
    if (filter === "done") list = list.filter((t) => t.isCompleted);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const a = (t.title || "").toLowerCase();
        const b = (t.description || "").toLowerCase();
        return a.includes(q) || b.includes(q);
      });
    }

    if (sort === "newest")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest")
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "az")
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    return list;
  }, [tasks, query, filter, sort]);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await apiFetch("/tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setToast({ type: "error", title: "Fetch failed", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function createTask(e) {
    e.preventDefault();

    if (!title.trim()) {
      setToast({
        type: "error",
        title: "Missing title",
        message: "Task title is required.",
      });
      return;
    }

    try {
      const created = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });

      setTitle("");
      setDescription("");
      setTasks((prev) => [created, ...prev]);
      setToast({ type: "success", title: "Created", message: "Task added." });
    } catch (err) {
      setToast({ type: "error", title: "Create failed", message: err.message });
    }
  }

  async function toggleComplete(task) {
    try {
      const updated = await apiFetch(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });

      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setToast({ type: "error", title: "Update failed", message: err.message });
    }
  }

  async function removeTask(taskId) {
    try {
      await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setToast({ type: "error", title: "Delete failed", message: err.message });
    }
  }

  function openEdit(task) {
    setEditId(task.id);
    setEditTitle(task.title ?? "");
    setEditDescription(task.description ?? "");
    setEditOpen(true);
  }

  function closeEdit() {
    if (savingEdit) return;
    setEditOpen(false);
  }

  async function saveEdit(e) {
    e.preventDefault();

    if (!editTitle.trim()) {
      setToast({
        type: "error",
        title: "Missing title",
        message: "Title is required.",
      });
      return;
    }

    try {
      setSavingEdit(true);
      const updated = await apiFetch(`/tasks/${editId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      setTasks((prev) => prev.map((t) => (t.id === editId ? updated : t)));
      setToast({ type: "success", title: "Saved", message: "Task updated." });
      closeEdit();
    } catch (err) {
      setToast({ type: "error", title: "Save failed", message: err.message });
    } finally {
      setSavingEdit(false);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={ui.page}>
      <Toast toast={toast} clearToast={clearToast} />

      {/* Header (same style as Dashboard should use) */}
      <div className={ui.pageHeaderCard}>
        <div className={ui.pageHeaderInner}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className={ui.h1}>Tasks</div>
              <div className={ui.sub}>
                A clean task space — like a Notion database, but faster.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className={ui.chip}>Total: {stats.total}</span>
              <span className={ui.chip}>Open: {stats.open}</span>
              <span className={ui.chip}>Done: {stats.done}</span>
              <button
                className={ui.btnPrimary}
                onClick={loadTasks}
                type="button"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className={ui.card}>
        <div className={ui.cardPad}>
          <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
            {/* Create */}
            <div className={clsx(ui.card, ui.cardPadSm)}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white/85">New task</div>
                <span className={ui.chip}>Quick add</span>
              </div>

              <form onSubmit={createTask} className="mt-4 space-y-3">
                <input
                  className={ui.input}
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                  className={clsx(ui.input, "min-h-[110px] resize-none")}
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex gap-2">
                  <button
                    className={clsx(ui.btnPrimary, "flex-1")}
                    type="submit"
                  >
                    Add task
                  </button>
                  <button
                    type="button"
                    className={ui.btn}
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                    }}
                  >
                    Clear
                  </button>
                </div>

                <div className="pt-1 text-xs text-white/40">
                  Tip: keep titles short, descriptions can be long.
                </div>
              </form>
            </div>

            {/* Database */}
            <div className={clsx(ui.card, ui.cardPadSm, "min-w-0")}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white/85">Database</div>
                <span className={ui.chip}>
                  {loading ? "Syncing…" : "Synced"}
                </span>
              </div>

              {/* Controls */}
              <div className="mt-4 grid gap-3">
                <input
                  className={ui.input}
                  placeholder="Search tasks…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "all", label: "All" },
                      { key: "open", label: "Open" },
                      { key: "done", label: "Completed" },
                    ].map((x) => (
                      <button
                        key={x.key}
                        type="button"
                        onClick={() => setFilter(x.key)}
                        className={clsx(
                          ui.chip,
                          "hover:bg-white/[0.06] transition",
                          filter === x.key &&
                            "border-purple-500/40 bg-purple-500/15 text-white",
                        )}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom select */}
                  <div className="relative md:w-56">
                    <select
                      className={ui.select}
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="Sort tasks"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="az">A–Z</option>
                    </select>

                    <span
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                        <path
                          d="M6 8l4 4 4-4"
                          stroke="rgba(255,255,255,0.85)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="mt-5 overflow-x-auto">
                <div className="min-w-[820px] overflow-hidden rounded-xl border border-white/10">
                  <div className="grid grid-cols-[44px_2fr_3fr_220px] bg-white/[0.03] text-xs text-white/55">
                    <div className="px-3 py-2 border-r border-white/10" />
                    <div className="px-3 py-2 border-r border-white/10 font-semibold">
                      Title
                    </div>
                    <div className="px-3 py-2 border-r border-white/10 font-semibold">
                      Description
                    </div>
                    <div className="px-3 py-2 font-semibold">Actions</div>
                  </div>

                  {loading ? (
                    <div className="p-4 space-y-3">
                      <div className="h-11 rounded-lg border border-white/10 bg-white/5 animate-pulse" />
                      <div className="h-11 rounded-lg border border-white/10 bg-white/5 animate-pulse" />
                      <div className="h-11 rounded-lg border border-white/10 bg-white/5 animate-pulse" />
                    </div>
                  ) : visibleTasks.length === 0 ? (
                    <div className="p-5 text-sm text-white/50">
                      No tasks yet. Add one on the left.
                    </div>
                  ) : (
                    <div>
                      {visibleTasks.map((t) => (
                        <div
                          key={t.id}
                          className={clsx(
                            "group grid min-w-0 grid-cols-[44px_2fr_3fr_220px] border-t border-white/10",
                            "hover:bg-white/[0.04] transition",
                          )}
                        >
                          <div className="px-3 py-3 flex items-start justify-center">
                            <button
                              type="button"
                              onClick={() => toggleComplete(t)}
                              className={clsx(
                                "mt-[2px] h-5 w-5 rounded-md border",
                                t.isCompleted
                                  ? "border-purple-500/40 bg-purple-600/80"
                                  : "border-white/15 bg-black/30 hover:border-purple-500/40",
                              )}
                              aria-label="Toggle complete"
                            />
                          </div>

                          <div className="px-3 py-3 min-w-0">
                            <div
                              className={clsx(
                                "text-[13px] font-semibold text-white/90 leading-5 truncate",
                                t.isCompleted && "line-through text-white/50",
                              )}
                              title={t.title}
                            >
                              {t.title}
                            </div>
                          </div>

                          <div className="px-3 py-3 min-w-0">
                            <div className="text-[13px] text-white/55 leading-5 break-words">
                              {t.description || (
                                <span className="text-white/30">—</span>
                              )}
                            </div>
                          </div>

                          <div className="px-3 py-3 flex items-start justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              className={ui.btn}
                              onClick={() => openEdit(t)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className={ui.btn}
                              onClick={() => toggleComplete(t)}
                              type="button"
                            >
                              {t.isCompleted ? "Undo" : "Complete"}
                            </button>
                            <button
                              className={ui.btnDanger}
                              onClick={() => removeTask(t.id)}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 text-xs text-white/35">
                Tip: hover a row to see actions (Notion-style).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} title="Edit task" onClose={closeEdit}>
        <form onSubmit={saveEdit} className="grid gap-3">
          <input
            className={ui.input}
            placeholder="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className={clsx(ui.input, "min-h-[110px] resize-none")}
            placeholder="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              className={ui.btn}
              type="button"
              onClick={closeEdit}
              disabled={savingEdit}
            >
              Cancel
            </button>
            <button
              className={ui.btnPrimary}
              type="submit"
              disabled={savingEdit}
            >
              {savingEdit ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
