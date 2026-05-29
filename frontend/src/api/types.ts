export interface BoardListResponse {
  id: number;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardResponse {
  id: number;
  listId: number;
  title: string;
  description: string;
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardWithListResponse extends CardResponse {
  listTitle: string;
}

export interface CardRequest {
  listId: number;
  title: string;
  description?: string;
  dueDate?: string;
}

export interface BoardListRequest {
  title: string;
}

export interface CardUpdateRequest {
  title: string;
  description?: string;
  dueDate?: string | null;
}

export interface ListReorderItem {
  id: number;
  position: number;
}

export interface ListReorderRequest {
  items: ListReorderItem[];
}

export interface CardReorderItem {
  id: number;
  listId: number;
  position: number;
}

export interface CardReorderRequest {
  cards: CardReorderItem[];
}
