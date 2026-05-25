import type { BoardListResponse, CardResponse, CardWithListResponse } from './types';

const BASE_URL = '/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
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
