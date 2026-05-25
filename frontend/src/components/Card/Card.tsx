import type { CardResponse } from '../../api/types';
import { formatDueDate, isOverdue } from '../../utils/date';
import styles from './Card.module.css';

interface CardProps {
  card: CardResponse;
  onClick: (card: CardResponse) => void;
}

export function Card({ card, onClick }: CardProps) {
  const overdue = card.dueDate ? isOverdue(card.dueDate) : false;

  return (
    <div className={styles.card} onClick={() => onClick(card)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(card)}>
      <p className={styles.title}>{card.title}</p>
      {card.dueDate && (
        <p className={`${styles.dueDate}${overdue ? ` ${styles.overdue}` : ''}`}>
          {overdue ? '⚠ ' : '📅 '}{formatDueDate(card.dueDate)}
        </p>
      )}
    </div>
  );
}
