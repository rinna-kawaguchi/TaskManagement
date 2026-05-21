// ─── State ───────────────────────────────────────────────────────────────────

let state = {
  lists: [
    {
      id: 1,
      title: 'ToDo',
      cards: [
        { id: 101, title: 'API設計',    description: 'REST APIのエンドポイントを設計する', dueDate: '2026-05-30' },
        { id: 102, title: 'UI実装',     description: 'ボード画面のフロントエンドを実装する', dueDate: '2026-06-05' },
        { id: 103, title: 'デプロイ',   description: '本番環境へのデプロイ手順を整備する', dueDate: '' },
      ],
    },
    {
      id: 2,
      title: '進行中',
      cards: [
        { id: 201, title: 'DB設計',     description: 'PostgreSQLのテーブル定義を完成させる', dueDate: '2026-05-25' },
        { id: 202, title: 'テスト',     description: 'ユニットテストと結合テストを作成する', dueDate: '2026-05-28' },
      ],
    },
    {
      id: 3,
      title: '完了',
      cards: [
        { id: 301, title: '要件定義',   description: '機能要件・非機能要件を文書化した', dueDate: '2026-05-10' },
        { id: 302, title: '画面設計',   description: 'ワイヤーフレームと画面遷移図を作成した', dueDate: '2026-05-12' },
        { id: 303, title: 'DB設計書',   description: 'ER図とテーブル定義書を完成させた', dueDate: '2026-05-14' },
        { id: 304, title: '環境構築',   description: '開発環境のDockerセットアップを完了した', dueDate: '2026-05-15' },
        { id: 305, title: 'プロジェクト立ち上げ', description: 'GitHubリポジトリを作成した', dueDate: '2026-05-08' },
      ],
    },
  ],
  nextListId: 4,
  nextCardId: 400,
};

// ─── Drag state ───────────────────────────────────────────────────────────────

const drag = {
  type: null,       // 'card' | 'list'
  sourceListId: null,
  cardId: null,
  listId: null,
  el: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findList(listId) {
  return state.lists.find(l => l.id === listId);
}

function findCard(cardId) {
  for (const list of state.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) return { list, card };
  }
  return null;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-');
  return `${y}/${m}/${d}`;
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

// ─── Render ───────────────────────────────────────────────────────────────────

function render() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  state.lists.forEach(list => {
    board.appendChild(createListEl(list));
  });

  board.appendChild(createAddListPlaceholder());
}

function createListEl(list) {
  const el = document.createElement('div');
  el.className = 'list';
  el.dataset.listId = list.id;
  el.draggable = true;

  el.innerHTML = `
    <div class="list-header">
      <span class="list-title" data-list-id="${list.id}">${escHtml(list.title)}</span>
      <span class="list-count">${list.cards.length}</span>
      <button class="list-delete-btn" data-list-id="${list.id}" title="リストを削除">×</button>
    </div>
    <div class="cards" data-list-id="${list.id}"></div>
    <div class="add-card-area" data-list-id="${list.id}">
      <button class="add-card-btn" data-list-id="${list.id}">＋ カード追加</button>
      <div class="add-card-form" data-list-id="${list.id}">
        <textarea class="add-card-input" placeholder="タイトルを入力..." rows="3"></textarea>
        <div class="add-card-actions">
          <button class="btn btn-primary btn-sm" data-action="confirm-add-card" data-list-id="${list.id}">追加</button>
          <button class="btn btn-secondary btn-sm" data-action="cancel-add-card" data-list-id="${list.id}">×</button>
        </div>
      </div>
    </div>
  `;

  const cardsEl = el.querySelector('.cards');
  list.cards.forEach(card => {
    cardsEl.appendChild(createCardEl(card));
  });

  bindListEvents(el, list);
  return el;
}

function createCardEl(card) {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.cardId = card.id;
  el.draggable = true;

  const dueHtml = card.dueDate
    ? `<div class="card-due ${isOverdue(card.dueDate) ? 'overdue' : ''}">📅 ${formatDate(card.dueDate)}</div>`
    : '';

  el.innerHTML = `
    <div class="card-title">${escHtml(card.title)}</div>
    ${dueHtml}
  `;

  el.addEventListener('click', () => openModal(card.id));
  el.addEventListener('dragstart', onCardDragStart);
  el.addEventListener('dragend', onDragEnd);

  return el;
}

function createAddListPlaceholder() {
  const el = document.createElement('div');
  el.className = 'add-list-placeholder';
  return el;
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── List events ──────────────────────────────────────────────────────────────

function bindListEvents(listEl, list) {
  // リスト名クリック → インライン編集
  listEl.querySelector('.list-title').addEventListener('click', () => {
    startEditListTitle(listEl, list);
  });

  // リスト削除
  listEl.querySelector('.list-delete-btn').addEventListener('click', () => {
    if (confirm(`「${list.title}」を削除しますか？\nカードもすべて削除されます。`)) {
      state.lists = state.lists.filter(l => l.id !== list.id);
      render();
    }
  });

  // カード追加ボタン
  listEl.querySelector('.add-card-btn').addEventListener('click', () => {
    openAddCardForm(listEl, list.id);
  });

  // 追加確定
  listEl.querySelector('[data-action="confirm-add-card"]').addEventListener('click', () => {
    confirmAddCard(listEl, list.id);
  });

  // キャンセル
  listEl.querySelector('[data-action="cancel-add-card"]').addEventListener('click', () => {
    closeAddCardForm(listEl);
  });

  // カードエリアへのドロップ
  const cardsEl = listEl.querySelector('.cards');
  cardsEl.addEventListener('dragover', onCardDragOver);
  cardsEl.addEventListener('drop', e => onCardDrop(e, list.id));
  cardsEl.addEventListener('dragleave', onCardDragLeave);

  // リスト並び替えのドラッグ
  listEl.addEventListener('dragstart', onListDragStart);
  listEl.addEventListener('dragend', onDragEnd);
  listEl.addEventListener('dragover', onListDragOver);
  listEl.addEventListener('drop', onListDrop);
}

function startEditListTitle(listEl, list) {
  const titleEl = listEl.querySelector('.list-title');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'list-title-input';
  input.value = list.title;
  titleEl.replaceWith(input);
  input.focus();
  input.select();

  const save = () => {
    const val = input.value.trim();
    if (val) list.title = val;
    render();
  };

  input.addEventListener('blur', save);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') render();
  });
}

function openAddCardForm(listEl, listId) {
  listEl.querySelector('.add-card-btn').style.display = 'none';
  const form = listEl.querySelector('.add-card-form');
  form.classList.add('open');
  form.querySelector('.add-card-input').focus();
}

function closeAddCardForm(listEl) {
  listEl.querySelector('.add-card-btn').style.display = '';
  const form = listEl.querySelector('.add-card-form');
  form.classList.remove('open');
  form.querySelector('.add-card-input').value = '';
}

function confirmAddCard(listEl, listId) {
  const input = listEl.querySelector('.add-card-input');
  const title = input.value.trim();
  if (!title) return;

  const list = findList(listId);
  list.cards.push({ id: state.nextCardId++, title, description: '', dueDate: '' });
  render();
}

// ─── Modal ────────────────────────────────────────────────────────────────────

let modalCardId = null;

function openModal(cardId) {
  const result = findCard(cardId);
  if (!result) return;
  const { card } = result;
  modalCardId = cardId;

  document.getElementById('modal-title').value = card.title;
  document.getElementById('modal-description').value = card.description;
  document.getElementById('modal-due-date').value = card.dueDate;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  modalCardId = null;
}

function saveModal() {
  if (modalCardId === null) return;
  const result = findCard(modalCardId);
  if (!result) return;
  const { card } = result;

  card.title = document.getElementById('modal-title').value.trim() || card.title;
  card.description = document.getElementById('modal-description').value;
  card.dueDate = document.getElementById('modal-due-date').value;

  closeModal();
  render();
}

function deleteModalCard() {
  if (modalCardId === null) return;
  if (!confirm('このカードを削除しますか？')) return;

  for (const list of state.lists) {
    list.cards = list.cards.filter(c => c.id !== modalCardId);
  }
  closeModal();
  render();
}

// ─── Drag & Drop: Card ────────────────────────────────────────────────────────

function onCardDragStart(e) {
  if (drag.type === 'list') return;
  e.stopPropagation();
  drag.type = 'card';
  drag.el = e.currentTarget;
  drag.cardId = Number(e.currentTarget.dataset.cardId);

  const listEl = e.currentTarget.closest('.list');
  drag.sourceListId = Number(listEl.dataset.listId);

  setTimeout(() => e.currentTarget.classList.add('dragging'), 0);
  e.dataTransfer.effectAllowed = 'move';
}

function onCardDragOver(e) {
  if (drag.type !== 'card') return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  const cardsEl = e.currentTarget;
  cardsEl.closest('.list').classList.add('drag-over');

  const afterEl = getCardAfterElement(cardsEl, e.clientY);

  removePlaceholder();
  const placeholder = document.createElement('div');
  placeholder.className = 'card drag-placeholder';
  placeholder.style.height = (drag.el ? drag.el.offsetHeight : 60) + 'px';
  placeholder.id = 'card-placeholder';

  if (afterEl) {
    cardsEl.insertBefore(placeholder, afterEl);
  } else {
    cardsEl.appendChild(placeholder);
  }
}

function onCardDragLeave(e) {
  const cardsEl = e.currentTarget;
  if (!cardsEl.contains(e.relatedTarget)) {
    cardsEl.closest('.list').classList.remove('drag-over');
  }
}

function onCardDrop(e, targetListId) {
  if (drag.type !== 'card') return;
  e.preventDefault();
  e.stopPropagation();

  const cardsEl = e.currentTarget;
  const afterEl = getCardAfterElement(cardsEl, e.clientY);

  const sourceList = findList(drag.sourceListId);
  const targetList = findList(targetListId);

  const cardIdx = sourceList.cards.findIndex(c => c.id === drag.cardId);
  const [card] = sourceList.cards.splice(cardIdx, 1);

  if (afterEl && afterEl.dataset.cardId) {
    const afterCardId = Number(afterEl.dataset.cardId);
    const afterIdx = targetList.cards.findIndex(c => c.id === afterCardId);
    targetList.cards.splice(afterIdx, 0, card);
  } else {
    targetList.cards.push(card);
  }

  render();
}

function getCardAfterElement(container, y) {
  const cards = [...container.querySelectorAll('.card:not(.dragging):not(.drag-placeholder)')];
  return cards.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function removePlaceholder() {
  const ph = document.getElementById('card-placeholder');
  if (ph) ph.remove();
}

// ─── Drag & Drop: List ────────────────────────────────────────────────────────

function onListDragStart(e) {
  if (e.target.classList.contains('card')) return;
  drag.type = 'list';
  drag.el = e.currentTarget;
  drag.listId = Number(e.currentTarget.dataset.listId);
  setTimeout(() => e.currentTarget.classList.add('dragging'), 0);
  e.dataTransfer.effectAllowed = 'move';
}

function onListDragOver(e) {
  if (drag.type !== 'list') return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function onListDrop(e) {
  if (drag.type !== 'list') return;
  e.preventDefault();

  const targetListEl = e.currentTarget;
  const targetListId = Number(targetListEl.dataset.listId);

  if (drag.listId === targetListId) return;

  const srcIdx = state.lists.findIndex(l => l.id === drag.listId);
  const tgtIdx = state.lists.findIndex(l => l.id === targetListId);

  const [moved] = state.lists.splice(srcIdx, 1);
  state.lists.splice(tgtIdx, 0, moved);

  render();
}

function onDragEnd() {
  removePlaceholder();
  document.querySelectorAll('.list.drag-over').forEach(el => el.classList.remove('drag-over'));
  if (drag.el) drag.el.classList.remove('dragging');
  drag.type = null;
  drag.el = null;
  drag.cardId = null;
  drag.listId = null;
  drag.sourceListId = null;
}

// ─── Global event bindings ────────────────────────────────────────────────────

document.getElementById('add-list-btn').addEventListener('click', () => {
  const title = prompt('リスト名を入力してください');
  if (!title || !title.trim()) return;
  state.lists.push({ id: state.nextListId++, title: title.trim(), cards: [] });
  render();
});

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-save-btn').addEventListener('click', saveModal);
document.getElementById('modal-delete-btn').addEventListener('click', deleteModalCard);

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

render();
