// 로컬 스토리지에 저장하는 공용 유틸
const KEY = "fav:ideas"; // [{ id, title, region, category, tags:[], createdAt }]

export function loadFavs() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavs(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isFav(id) {
  return loadFavs().some(v => v.id === id);
}

// item: { id, title, region, category, tags:[] }
export function toggleFav(item) {
  const now = loadFavs();
  const i = now.findIndex(v => v.id === item.id);
  let next;
  if (i >= 0) next = now.filter(v => v.id !== item.id);
  else next = [{ ...item, createdAt: Date.now() }, ...now];
  saveFavs(next);
  return next;
}

export function removeFavById(id) {
  const next = loadFavs().filter(v => v.id !== id);
  saveFavs(next);
  return next;
}
