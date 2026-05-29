import type { BoardListRequest, BoardListResponse, CardReorderRequest, CardRequest, CardResponse, CardUpdateRequest, CardWithListResponse, ListReorderRequest } from './types';

const BASE_URL = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function fetchLists(): Promise<BoardListResponse[]> {
  return request('/lists');
}

export function fetchCardsByListId(listId: number): Promise<CardResponse[]> {
  return request(`/lists/${listId}/cards`);
}

export function fetchCardById(cardId: number): Promise<CardResponse> {
  return request(`/cards/${cardId}`);
}

export function searchCards(keyword: string): Promise<CardWithListResponse[]> {
  const params = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
  return request(`/cards${params}`);
}

export function createCard(data: CardRequest): Promise<CardResponse> {
  return request('/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function createList(data: BoardListRequest): Promise<BoardListResponse> {
  return request('/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function updateList(listId: number, data: BoardListRequest): Promise<BoardListResponse> {
  return request(`/lists/${listId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function updateCard(cardId: number, data: CardUpdateRequest): Promise<CardResponse> {
  return request(`/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function reorderLists(data: ListReorderRequest): Promise<void> {
  return request('/lists/reorder', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function reorderCards(data: CardReorderRequest): Promise<void> {
  return request('/cards/reorder', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
