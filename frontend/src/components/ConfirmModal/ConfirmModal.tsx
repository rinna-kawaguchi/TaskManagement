import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !deleting) onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [deleting, onCancel]);

  const handleConfirm = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch {
      setError('削除に失敗しました');
      setDeleting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !deleting) onCancel();
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onCancel} disabled={deleting} aria-label="閉じる">×</button>
        <p className={styles.message}>{message}</p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button
            className={styles.deleteBtn}
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? '削除中...' : '削除する'}
          </button>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={deleting}>
            キャンセル
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
