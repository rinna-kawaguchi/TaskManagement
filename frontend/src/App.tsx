import { useState, useEffect, useCallback } from 'react';
import type { BoardListResponse, CardRequest, CardResponse, CardWithListResponse } from './api/types';
import { fetchLists, fetchCardsByListId, searchCards, createCard, createList, updateList, deleteList, deleteCard } from './api/client';
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

  const handleUpdateList = useCallback(async (listId: number, title: string) => {
    const updatedList = await updateList(listId, { title });
    setLists((prev) => prev.map((l) => (l.id === listId ? updatedList : l)));
  }, []);

  const handleUpdateCard = useCallback((updatedCard: CardResponse) => {
    setCardsMap((prev) => ({
      ...prev,
      [updatedCard.listId]: (prev[updatedCard.listId] ?? []).map((c) =>
        c.id === updatedCard.id ? updatedCard : c,
      ),
    }));
    setSelectedCard(updatedCard);
  }, []);

  const handleDeleteList = useCallback(async (listId: number) => {
    await deleteList(listId);
    setLists((prev) => prev.filter((l) => l.id !== listId));
    setCardsMap((prev) => {
      const next = { ...prev };
      delete next[listId];
      return next;
    });
  }, []);

  const handleDeleteCard = useCallback(async (cardId: number, listId: number) => {
    await deleteCard(cardId);
    setCardsMap((prev) => ({
      ...prev,
      [listId]: (prev[listId] ?? []).filter((c) => c.id !== cardId),
    }));
  }, []);

  const handleListsReorder = useCallback((reorderedLists: BoardListResponse[]) => {
    setLists(reorderedLists);
  }, []);

  const handleCardsReorder = useCallback(
    (updater: (prev: Record<number, CardResponse[]>) => Record<number, CardResponse[]>) => {
      setCardsMap(updater);
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
          onUpdateList={handleUpdateList}
          onDeleteList={handleDeleteList}
          onListsReorder={handleListsReorder}
          onCardsReorder={handleCardsReorder}
        />
      )}
      <CardModal card={selectedCard} onClose={handleModalClose} onUpdate={handleUpdateCard} onDelete={handleDeleteCard} />
    </>
  );
}

export default App;
