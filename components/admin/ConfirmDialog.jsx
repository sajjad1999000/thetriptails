'use client';
// components/admin/ConfirmDialog.jsx
// Shared confirmation modal for destructive actions (Reject, Revoke,
// Delete, etc.) — per your call, NOT used for comment hide/unhide,
// which stays instant.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-card">
        <h2 className="confirm-title">{title}</h2>
        {message && <p className="confirm-message">{message}</p>}
        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={destructive ? 'confirm-confirm-destructive' : 'confirm-confirm'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style jsx>{`
        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 24, 22, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }
        .confirm-card {
          background: var(--cloud);
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 2rem;
          max-width: 420px;
          width: 100%;
        }
        .confirm-title {
          font-family: var(--display);
          font-size: 1.4rem;
          color: var(--pine);
          margin: 0 0 0.75rem;
        }
        .confirm-message {
          font-family: var(--body);
          color: var(--ink);
          line-height: 1.6;
          margin: 0 0 1.5rem;
        }
        .confirm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .confirm-cancel {
          background: none;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-family: var(--body);
          font-size: 0.9rem;
          cursor: pointer;
          color: var(--ink);
        }
        .confirm-confirm-destructive {
          background: #b3261e;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-family: var(--body);
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
        }
        .confirm-confirm {
          background: var(--pine);
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-family: var(--body);
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}