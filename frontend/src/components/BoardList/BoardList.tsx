import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { BoardListResponse, CardResponse } from '../../api/types';
import { SortableCard } from '../Card/SortableCard';
import { AddCardForm } from '../AddCardForm/AddCardForm';
import styles from './BoardList.module.css';

interface BoardListProps {
  list: BoardListResponse;
  cards: CardResponse[];
  onCardClick: (card: CardResponse) => void;
  onAddCard: (listId: number, title: string, description: string, dueDate: string) => Promise<void>;
  onUpdateList: (listId: number, title: string) => Promise<void>;
  dragHandleListeners?: SyntheticListenerMap;
  isTitleEditing?: boolean;
  onTitleEditingChange?: (editing: boolean) => void;
}

export function BoardList({ list, cards, onCardClick, onAddCard, onUpdateList, dragHandleListeners, isTitleEditing: isTitleEditingProp, onTitleEditingChange }: BoardListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // list-{id} と衝突しない drop-{id} で登録し、空リストでもドロップ領域を確保する
  const { setNodeRef: setDropRef } = useDroppable({
    id: `drop-${list.id}`,
    data: { type: 'list', listId: list.id },
  });

  const [isTitleEditingLocal, setIsTitleEditingLocal] = useState(false);
  const isTitleEditing = isTitleEditingProp ?? isTitleEditingLocal;
  const setIsTitleEditing = (v: boolean) => {
    setIsTitleEditingLocal(v);
    onTitleEditingChange?.(v);
  };

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
      {/* dragHandleListeners をヘッダーのみに付けることで、カード上のドラッグと分離する */}
      <div className={styles.header} {...dragHandleListeners}>
        {isTitleEditing ? (
          <form onSubmit={handleTitleSubmit} className={styles.titleForm}
            onPointerDown={(e) => e.stopPropagation()}>
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
              onClick={() => { setEditTitle(list.title); setIsTitleEditing(true); }}
              title="クリックして編集"
              role="button"
              tabIndex={0}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === 'Enter') { setEditTitle(list.title); setIsTitleEditing(true); } }}
            >
              {list.title}
            </span>
            <span className={styles.count}>{cards.length}</span>
          </>
        )}
      </div>
      <div className={styles.cards} ref={setDropRef}>
        <SortableContext items={cards.map((c) => `card-${c.id}`)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={onCardClick} />
          ))}
        </SortableContext>
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
