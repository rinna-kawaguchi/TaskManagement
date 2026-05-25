import styles from './Header.module.css';

interface HeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function Header({ searchQuery, onSearch }: HeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.title}>TaskBoard</span>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="カードを検索..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
      />
    </header>
  );
}
