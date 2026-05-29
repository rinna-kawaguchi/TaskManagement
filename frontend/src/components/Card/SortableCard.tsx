import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './Card';
import type { CardResponse } from '../../api/types';

interface SortableCardProps {
  card: CardResponse;
  onClick: (card: CardResponse) => void;
}

export function SortableCard({ card, onClick }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: 'card', cardId: card.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // isDragging 中はプレースホルダーを潰してコリジョン検出から除外する
    ...(isDragging ? { height: 0, overflow: 'hidden' } : {}),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card card={card} onClick={onClick} />
    </div>
  );
}
