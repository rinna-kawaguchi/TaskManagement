import type { BoardListResponse, CardResponse } from '../../api/types';
import { Card } from '../Card/Card';
import styles from './BoardList.module.css';

interface BoardListProps {
  list: BoardListResponse;
  cards: CardResponse[];
  onCardClick: (card: CardResponse) => void;
}

export function BoardList({ list, cards, onCardClick }: BoardListProps) {
  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <span className={styles.title}>{list.title}</span>
        <span className={styles.count}>{cards.length}</span>
      </div>
      <div className={styles.cards}>
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
