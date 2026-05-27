import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './AddListModal.module.css';

interface AddListModalProps {
  onAdd: (title: string) => Promise<void>;
  onClose: () => void;
}

export function AddListModal({ onAdd, onClose }: AddListModalProps) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(title.trim());
    } catch {
      setError('リストの作成に失敗しました');
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">×</button>
        <h2 className={styles.heading}>リストを追加</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="list-title">
              タイトル <span className={styles.required}>*</span>
            </label>
            <input
              id="list-title"
              className={styles.input}
              type="text"
              placeholder="リストのタイトルを入力..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!title.trim() || submitting}
            >
              {submitting ? '追加中...' : 'リストを追加'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
