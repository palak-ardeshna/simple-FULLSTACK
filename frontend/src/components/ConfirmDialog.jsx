import { useEffect } from "react";
import "../styles/ConfirmDialog.css";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  // ESC key press કરવાથી modal close થાય
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <div className="confirm-dialog-icon">⚠️</div>
          <h3>{title || "Confirm Action"}</h3>
        </div>

        <div className="confirm-dialog-body">
          <p>{message || "Are you sure you want to proceed?"}</p>
        </div>

        <div className="confirm-dialog-footer">
          <button onClick={onCancel} className="btn-cancel">
            ❌ Cancel
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            ✅ Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
