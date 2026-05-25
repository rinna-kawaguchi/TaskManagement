import type { CardWithListResponse, CardResponse } from '../../api/types';
import { formatDueDate, isOverdue } from '../../utils/date';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  results: CardWithListResponse[];
  keyword: string;
  onCardClick: (card: CardResponse) => void;
}

export function SearchResults({ results, keyword, onCardClick }: SearchResultsProps) {
  return (
    <div className={styles.container}>
      <p className={styles.heading}>
        「{keyword}」の検索結果: {results.length} 件
      </p>
      {results.length === 0 ? (
        <p className={styles.empty}>該当するカードが見つかりませんでした。</p>
      ) : (
        <div className={styles.list}>
          {results.map((card) => {
            const overdue = card.dueDate ? isOverdue(card.dueDate) : false;
            return (
              <div
                key={card.id}
                className={styles.item}
                onClick={() => onCardClick(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onCardClick(card)}
              >
                <p className={styles.itemTitle}>{card.title}</p>
                <div className={styles.itemMeta}>
                  <span className={styles.listName}>{card.listTitle}</span>
                  {card.dueDate && (
                    <span className={`${styles.dueDate}${overdue ? ` ${styles.overdue}` : ''}`}>
                      {overdue ? '⚠ ' : ''}{formatDueDate(card.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
