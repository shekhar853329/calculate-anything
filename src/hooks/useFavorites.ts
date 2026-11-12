import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const toggle = (slug: string) =>
    setFavorites(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  const isFavorite = (slug: string) => favorites.includes(slug);
  return { favorites, toggle, isFavorite };
}
