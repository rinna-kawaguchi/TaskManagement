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
