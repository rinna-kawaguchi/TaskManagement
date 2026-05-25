import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CardResponse } from '../../api/types';
import { formatDueDate, isOverdue } from '../../utils/date';
import styles from './CardModal.module.css';

interface CardModalProps {
  card: CardResponse | null;
  onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
  useEffect(() => {
    if (!card) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [card, onClose]);

  if (!card) return null;

  const overdue = card.dueDate ? isOverdue(card.dueDate) : false;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">×</button>
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
      </div>
    </div>,
    document.body,
  );
}
