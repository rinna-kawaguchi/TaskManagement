import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CardResponse } from '../../api/types';
import { updateCard } from '../../api/client';
import { formatDueDate, isOverdue } from '../../utils/date';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import styles from './CardModal.module.css';

interface CardModalProps {
  card: CardResponse | null;
  onClose: () => void;
  onUpdate: (updatedCard: CardResponse) => void;
  onDelete: (cardId: number, listId: number) => Promise<void>;
}

export function CardModal({ card, onClose, onUpdate, onDelete }: CardModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description ?? '');
      setDueDate(card.dueDate ?? '');
      setIsEditing(false);
      setError(null);
    }
  }, [card]);

  useEffect(() => {
    if (!card) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [card, isEditing, onClose]);

  if (!card) return null;

  const overdue = card.dueDate ? isOverdue(card.dueDate) : false;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateCard(card.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || null,
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch {
      setError('カードの更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setTitle(card.title);
    setDescription(card.description ?? '');
    setDueDate(card.dueDate ?? '');
    setIsEditing(false);
    setError(null);
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">×</button>
        {isEditing ? (
          <>
            <h2 className={styles.editHeading}>カードを編集</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.formLabel} htmlFor="edit-card-title">
                  タイトル <span className={styles.required}>*</span>
                </label>
                <input
                  id="edit-card-title"
                  className={styles.input}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.formLabel} htmlFor="edit-card-description">説明</label>
                <textarea
                  id="edit-card-description"
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.formLabel} htmlFor="edit-card-due-date">期限日</label>
                <input
                  id="edit-card-due-date"
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
                  {submitting ? '保存中...' : '保存'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={handleCancelEdit}>
                  キャンセル
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className={styles.title}>{card.title}</h2>
            <section className={styles.section}>
              <span className={styles.label}>説明</span>
              {card.description ? (
                <p className={styles.value}>{card.description}</p>
              ) : (
                <p className={`${styles.value} ${styles.empty}`}>説明なし</p>
              )}
            </section>
            <section className={styles.section}>
              <span className={styles.label}>期限日</span>
              {card.dueDate ? (
                <p className={`${styles.dueDate}${overdue ? ` ${styles.overdue}` : ''}`}>
                  {overdue ? '⚠ ' : ''}{formatDueDate(card.dueDate)}
                  {overdue && ' （期限切れ）'}
                </p>
              ) : (
                <p className={`${styles.value} ${styles.empty}`}>期限なし</p>
              )}
            </section>
            <div className={styles.editBtnArea}>
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                編集
              </button>
              <button className={styles.deleteBtn} onClick={() => setShowDeleteConfirm(true)}>
                削除
              </button>
            </div>
            {showDeleteConfirm && (
              <ConfirmModal
                message={`「${card.title}」を削除しますか？`}
                onConfirm={async () => {
                  await onDelete(card.id, card.listId);
                  onClose();
                }}
                onCancel={() => setShowDeleteConfirm(false)}
              />
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
