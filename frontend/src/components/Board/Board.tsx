import type { BoardListResponse, CardResponse } from '../../api/types';
import { BoardList } from '../BoardList/BoardList';
import styles from './Board.module.css';

interface BoardProps {
  lists: BoardListResponse[];
  cardsMap: Record<number, CardResponse[]>;
  loading: boolean;
  error: string | null;
  onCardClick: (card: CardResponse) => void;
}

export function Board({ lists, cardsMap, loading, error, onCardClick }: BoardProps) {
  if (loading) return <div className={styles.loading}>読み込み中...</div>;
  if (error) return <div className={styles.error}>エラー: {error}</div>;

  return (
    <div className={styles.board}>
      {lists.map((list) => (
        <BoardList
          key={list.id}
          list={list}
          cards={cardsMap[list.id] ?? []}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}
