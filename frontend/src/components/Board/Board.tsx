import { useState } from 'react';
import type { BoardListResponse, CardResponse } from '../../api/types';
import { BoardList } from '../BoardList/BoardList';
import { AddListModal } from '../AddListModal/AddListModal';
import styles from './Board.module.css';

interface BoardProps {
  lists: BoardListResponse[];
  cardsMap: Record<number, CardResponse[]>;
  loading: boolean;
  error: string | null;
  onCardClick: (card: CardResponse) => void;
  onAddCard: (listId: number, title: string, description: string, dueDate: string) => Promise<void>;
  onAddList: (title: string) => Promise<void>;
}

export function Board({ lists, cardsMap, loading, error, onCardClick, onAddCard, onAddList }: BoardProps) {
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  if (loading) return <div className={styles.loading}>読み込み中...</div>;
  if (error) return <div className={styles.error}>エラー: {error}</div>;

  const handleAddList = async (title: string) => {
    await onAddList(title);
    setIsListModalOpen(false);
  };

  return (
    <div className={styles.board}>
      {lists.map((list) => (
        <BoardList
          key={list.id}
          list={list}
          cards={cardsMap[list.id] ?? []}
          onCardClick={onCardClick}
          onAddCard={onAddCard}
        />
      ))}
      <button className={styles.addListBtn} onClick={() => setIsListModalOpen(true)}>
        + リストを追加
      </button>
      {isListModalOpen && (
        <AddListModal onAdd={handleAddList} onClose={() => setIsListModalOpen(false)} />
      )}
    </div>
  );
}
