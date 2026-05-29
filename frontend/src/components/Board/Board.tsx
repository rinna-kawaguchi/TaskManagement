import { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import type { BoardListResponse, CardResponse, CardReorderItem } from '../../api/types';
import { reorderLists, reorderCards } from '../../api/client';
import { SortableListItem } from '../BoardList/SortableListItem';
import { BoardList } from '../BoardList/BoardList';
import { Card } from '../Card/Card';
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
  onUpdateList: (listId: number, title: string) => Promise<void>;
  onListsReorder: (reorderedLists: BoardListResponse[]) => void;
  onCardsReorder: (updater: (prev: Record<number, CardResponse[]>) => Record<number, CardResponse[]>) => void;
}

// "card-5" → {type:'card', id:5}、"list-2" / "drop-2" → {type:'list', id:2}
function parseId(dndId: string | number): { type: 'card' | 'list'; id: number } | null {
  const s = String(dndId);
  if (s.startsWith('card-')) return { type: 'card', id: Number(s.slice(5)) };
  if (s.startsWith('list-')) return { type: 'list', id: Number(s.slice(5)) };
  if (s.startsWith('drop-')) return { type: 'list', id: Number(s.slice(5)) };
  return null;
}

export function Board({
  lists,
  cardsMap,
  loading,
  error,
  onCardClick,
  onAddCard,
  onAddList,
  onUpdateList,
  onListsReorder,
  onCardsReorder,
}: BoardProps) {
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  // ドラッグ開始時のカードの元リストIDを記録（handleDragOver の楽観的更新後も参照できるように）
  const dragOriginListIdRef = useRef<number | null>(null);

  // useEffect を使わず render のたびに直接同期させる（handleDragEnd が同一ティックで参照するため）
  const cardsMapRef = useRef(cardsMap);
  cardsMapRef.current = cardsMap;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (loading) return <div className={styles.loading}>読み込み中...</div>;
  if (error) return <div className={styles.error}>エラー: {error}</div>;

  const handleAddList = async (title: string) => {
    await onAddList(title);
    setIsListModalOpen(false);
  };

  function handleDragStart(event: DragStartEvent) {
    const parsed = parseId(event.active.id);
    if (!parsed) return;
    if (parsed.type === 'list') {
      setActiveListId(parsed.id);
    }
    if (parsed.type === 'card') {
      setActiveCardId(parsed.id);
      // 楽観的更新で変わる前の元リストIDをここで記録する
      const originListId = Object.keys(cardsMapRef.current).map(Number).find(
        (lid) => cardsMapRef.current[lid]?.some((c) => c.id === parsed.id),
      );
      dragOriginListIdRef.current = originListId ?? null;
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeParsed = parseId(active.id);
    const overParsed = parseId(over.id);
    if (!activeParsed || !overParsed) return;
    if (activeParsed.type !== 'card') return;

    const activeCardId = activeParsed.id;

    onCardsReorder((prev) => {
      // cardsMap から activeCard の現在地を探す
      const fromListId = Object.keys(prev).map(Number).find(
        (lid) => prev[lid]?.some((c) => c.id === activeCardId),
      );
      if (fromListId === undefined) return prev;

      // over がリストなら直接そのリスト、カードならそのカードのリストを探す
      let toListId: number;
      if (overParsed.type === 'list') {
        toListId = overParsed.id;
      } else {
        const found = Object.keys(prev).map(Number).find(
          (lid) => prev[lid]?.some((c) => c.id === overParsed.id),
        );
        if (found === undefined) return prev;
        toListId = found;
      }

      if (fromListId === toListId) return prev;

      const sourceCards = [...(prev[fromListId] ?? [])];
      const destCards = [...(prev[toListId] ?? [])];
      const cardIndex = sourceCards.findIndex((c) => c.id === activeCardId);
      if (cardIndex === -1) return prev;
      const [moved] = sourceCards.splice(cardIndex, 1);
      const updatedCard = { ...moved, listId: toListId };

      if (overParsed.type === 'card') {
        const overCardIndex = destCards.findIndex((c) => c.id === overParsed.id);
        destCards.splice(overCardIndex, 0, updatedCard);
      } else {
        destCards.push(updatedCard);
      }

      return { ...prev, [fromListId]: sourceCards, [toListId]: destCards };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveListId(null);
    setActiveCardId(null);

    if (!over) return;

    const activeParsed = parseId(active.id);
    const overParsed = parseId(over.id);
    if (!activeParsed || !overParsed) return;
    if (active.id === over.id) return;

    if (activeParsed.type === 'list') {
      // over がカードの場合、そのカードが属するリストを代わりに使う
      const overListId = overParsed.type === 'list'
        ? overParsed.id
        : Object.keys(cardsMapRef.current).map(Number).find(
            (lid) => cardsMapRef.current[lid]?.some((c) => c.id === overParsed.id),
          );
      if (overListId === undefined) return;

      const oldIndex = lists.findIndex((l) => l.id === activeParsed.id);
      const newIndex = lists.findIndex((l) => l.id === overListId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const snapshot = lists;
      const reordered = arrayMove(lists, oldIndex, newIndex);
      onListsReorder(reordered);

      reorderLists({ items: reordered.map((l, i) => ({ id: l.id, position: i + 1 })) })
        .catch(() => { onListsReorder(snapshot); });
      return;
    }

    if (activeParsed.type === 'card') {
      const currentCardsMap = cardsMapRef.current;
      const activeCardId = activeParsed.id;
      // handleDragStart で記録した元リストID（handleDragOver の楽観的更新前の位置）
      const originListId = dragOriginListIdRef.current;
      dragOriginListIdRef.current = null;
      if (originListId === null) return;

      let toListId: number;
      if (overParsed.type === 'list') {
        toListId = overParsed.id;
      } else {
        // over がカードの場合、そのカードが現在いるリストを探す
        const found = Object.keys(currentCardsMap).map(Number).find(
          (lid) => currentCardsMap[lid]?.some((c) => c.id === overParsed.id),
        );
        if (found === undefined) return;
        toListId = found;
      }

      if (originListId === toListId) {
        // 同リスト内の並び替え（handleDragOver は発火しないので currentCardsMap から取得）
        const listCards = currentCardsMap[originListId] ?? [];
        const oldIdx = listCards.findIndex((c) => c.id === activeCardId);
        const newIdx = listCards.findIndex((c) => c.id === overParsed.id);
        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return;

        const snapshot = currentCardsMap;
        const reordered = arrayMove(listCards, oldIdx, newIdx);
        onCardsReorder((prev) => ({ ...prev, [originListId]: reordered }));

        reorderCards({
          cards: reordered.map((c, i) => ({ id: c.id, listId: originListId, position: i + 1 })),
        }).catch(() => { onCardsReorder(() => snapshot); });
      } else {
        // リスト間移動: handleDragOver の楽観的更新後の最新 state で API ペイロードを組み立てる
        onCardsReorder((prev) => {
          const affectedListIds = new Set([originListId, toListId]);
          const cards: CardReorderItem[] = [];
          affectedListIds.forEach((listId) => {
            (prev[listId] ?? []).forEach((c, i) => {
              cards.push({ id: c.id, listId, position: i + 1 });
            });
          });
          reorderCards({ cards }).catch(() => { onCardsReorder(() => prev); });
          return prev;
        });
      }
    }
  }

  const activeCard = activeCardId
    ? Object.values(cardsMap).flat().find((c) => c.id === activeCardId)
    : null;
  const activeList = activeListId ? lists.find((l) => l.id === activeListId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        <SortableContext
          items={lists.map((l) => `list-${l.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
            <SortableListItem
              key={list.id}
              list={list}
              cards={cardsMap[list.id] ?? []}
              onCardClick={onCardClick}
              onAddCard={onAddCard}
              onUpdateList={onUpdateList}
            />
          ))}
        </SortableContext>
        <button className={styles.addListBtn} onClick={() => setIsListModalOpen(true)}>
          + リストを追加
        </button>
      </div>
      <DragOverlay>
        {activeCard ? (
          <Card card={activeCard} onClick={() => {}} />
        ) : activeList ? (
          <BoardList
            list={activeList}
            cards={cardsMap[activeList.id] ?? []}
            onCardClick={() => {}}
            onAddCard={async () => {}}
            onUpdateList={async () => {}}
          />
        ) : null}
      </DragOverlay>
      {isListModalOpen && (
        <AddListModal onAdd={handleAddList} onClose={() => setIsListModalOpen(false)} />
      )}
    </DndContext>
  );
}
