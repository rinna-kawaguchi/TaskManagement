import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './AddCardForm.module.css';

interface AddCardFormProps {
  listTitle: string;
  onAdd: (title: string, description: string, dueDate: string) => Promise<void>;
  onClose: () => void;
}

export function AddCardForm({ listTitle, onAdd, onClose }: AddCardFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
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
      await onAdd(title.trim(), description.trim(), dueDate);
    } catch {
      setError('カードの作成に失敗しました');
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
        <h2 className={styles.heading}>カードを追加</h2>
        <p className={styles.listName}>{listTitle}</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="card-title">タイトル <span className={styles.required}>*</span></label>
            <input
              id="card-title"
              className={styles.input}
              type="text"
              placeholder="カードのタイトルを入力..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="card-description">説明</label>
            <textarea
              id="card-description"
              className={styles.textarea}
              placeholder="説明を入力（任意）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="card-due-date">期限日</label>
            <input
              id="card-due-date"
              className={styles.input}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!title.trim() || submitting}
            >
              {submitting ? '追加中...' : 'カードを追加'}
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
