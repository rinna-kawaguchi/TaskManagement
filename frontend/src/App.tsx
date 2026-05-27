import { useState, useEffect, useCallback } from 'react';
import type { BoardListResponse, CardRequest, CardResponse, CardWithListResponse } from './api/types';
import { fetchLists, fetchCardsByListId, searchCards, createCard, createList } from './api/client';
import { useDebounce } from './hooks/useDebounce';
import { Header } from './components/Header/Header';
import { Board } from './components/Board/Board';
import { CardModal } from './components/CardModal/CardModal';
import { SearchResults } from './components/SearchResults/SearchResults';

function App() {
  const [lists, setLists] = useState<BoardListResponse[]>([]);
  const [cardsMap, setCardsMap] = useState<Record<number, CardResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCard, setSelectedCard] = useState<CardResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardWithListResponse[]>([]);
  const [searching, setSearching] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function load() {
      try {
        const fetchedLists = await fetchLists();
        setLists(fetchedLists);
        const cardResults = await Promise.all(
          fetchedLists.map((list) => fetchCardsByListId(list.id)),
        );
        const map: Record<number, CardResponse[]> = {};
        fetchedLists.forEach((list, i) => {
          map[list.id] = cardResults[i];
        });
        setCardsMap(map);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    searchCards(debouncedQuery)
      .then(setSearchResults)
      .catch(console.error)
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  const handleCardClick = useCallback((card: CardResponse) => {
    setSelectedCard(card);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const handleAddList = useCallback(async (title: string) => {
    const newList = await createList({ title });
    setLists((prev) => [...prev, newList]);
    setCardsMap((prev) => ({ ...prev, [newList.id]: [] }));
  }, []);

  const handleAddCard = useCallback(
    async (listId: number, title: string, description: string, dueDate: string) => {
      const request: CardRequest = {
        listId,
        title,
        ...(description && { description }),
        ...(dueDate && { dueDate }),
      };
      const newCard = await createCard(request);
      setCardsMap((prev) => ({
        ...prev,
        [listId]: [...(prev[listId] ?? []), newCard],
      }));
    },
    [],
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
      {isSearching ? (
        <SearchResults
          results={searchResults}
          keyword={searchQuery}
          onCardClick={handleCardClick}
        />
      ) : searching ? null : (
        <Board
          lists={lists}
          cardsMap={cardsMap}
          loading={loading}
          error={error}
          onCardClick={handleCardClick}
          onAddCard={handleAddCard}
          onAddList={handleAddList}
        />
      )}
      <CardModal card={selectedCard} onClose={handleModalClose} />
    </>
  );
}

export default App;
