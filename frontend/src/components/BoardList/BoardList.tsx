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
  onUpdateList: (listId: number, title: string) => Promise<void>;
}

export function BoardList({ list, cards, onCardClick, onAddCard, onUpdateList }: BoardListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleAdd = async (title: string, description: string, dueDate: string) => {
    await onAddCard(list.id, title, description, dueDate);
    setIsModalOpen(false);
  };

  const handleTitleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    try {
      await onUpdateList(list.id, editTitle.trim());
      setIsTitleEditing(false);
      setTitleError(null);
    } catch {
      setTitleError('タイトルの更新に失敗しました');
    }
  };

  const handleTitleCancel = () => {
    setEditTitle(list.title);
    setIsTitleEditing(false);
    setTitleError(null);
  };

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        {isTitleEditing ? (
          <form onSubmit={handleTitleSubmit} className={styles.titleForm}>
            <input
              className={styles.titleInput}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Escape') handleTitleCancel(); }}
            />
            <button type="submit" className={styles.titleSaveBtn} disabled={!editTitle.trim()}>保存</button>
            <button type="button" className={styles.titleCancelBtn} onClick={handleTitleCancel}>×</button>
            {titleError && <span className={styles.titleError}>{titleError}</span>}
          </form>
        ) : (
          <>
            <span
              className={styles.title}
              onClick={() => setIsTitleEditing(true)}
              title="クリックして編集"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsTitleEditing(true); }}
            >
              {list.title}
            </span>
            <span className={styles.count}>{cards.length}</span>
          </>
        )}
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
