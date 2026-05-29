import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BoardList } from './BoardList';
import type { BoardListResponse, CardResponse } from '../../api/types';

interface SortableListItemProps {
  list: BoardListResponse;
  cards: CardResponse[];
  onCardClick: (card: CardResponse) => void;
  onAddCard: (listId: number, title: string, description: string, dueDate: string) => Promise<void>;
  onUpdateList: (listId: number, title: string) => Promise<void>;
}

export function SortableListItem({ list, cards, onCardClick, onAddCard, onUpdateList }: SortableListItemProps) {
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `list-${list.id}`,
    data: { type: 'list', listId: list.id },
    disabled: isTitleEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { height: 0, overflow: 'hidden' } : {}),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BoardList
        list={list}
        cards={cards}
        onCardClick={onCardClick}
        onAddCard={onAddCard}
        onUpdateList={onUpdateList}
        dragHandleListeners={listeners}
        isTitleEditing={isTitleEditing}
        onTitleEditingChange={setIsTitleEditing}
      />
    </div>
  );
}
