import { useState } from 'react';
import type { BoardListResponse, CardResponse } from '../../api/types';
import { Card } from '../Card/Card';
import { AddCardForm } from '../AddCardForm/AddCardForm';
import styles from './BoardList.module.css';

interface BoardListProps {
  list: BoardListResponse;
  cards: CardResponse[];
  onCardClick: (card: CardResponse) => void;
  onAddCard: (listId: number, title: string, description: string, dueDate: string) => Promise<void>;
}

export function BoardList({ list, cards, onCardClick, onAddCard }: BoardListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = async (title: string, description: string, dueDate: string) => {
    await onAddCard(list.id, title, description, dueDate);
    setIsModalOpen(false);
  };

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
      <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
        + カードを追加
      </button>
      {isModalOpen && (
        <AddCardForm
          listTitle={list.title}
          onAdd={handleAdd}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
