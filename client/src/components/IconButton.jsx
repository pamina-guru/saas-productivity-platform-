export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  function onBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={onBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 9998,
        padding: 18,
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 560,
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
        }}
      >
        <div className="cardPad">
          <div className="row spread" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
            <button className="btn" onClick={onClose} aria-label="Close modal">
              Close
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
