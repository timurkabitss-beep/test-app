import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchMatches } from '../api';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { Filter, filterMatches } from '../matchUtils';
import { Match } from '../types';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'upcoming', label: 'Предстоящие' },
  { key: 'finished', label: 'Завершённые' },
];

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  // Один вызов хука на весь экран: состояние избранного общее для всех карточек
  const favorites = useFavorites();

  const load = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'initial') setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await fetchMatches();
      setMatches(data);
      setUpdatedAt(new Date());
    } catch {
      setError('Не удалось загрузить матчи');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = filterMatches(matches, filter);

  let content;
  if (loading) {
    content = <ActivityIndicator size="large" />;
  } else if (error) {
    content = (
      <View>
        <Text style={styles.message}>{error}</Text>
        <Pressable onPress={() => load()} style={styles.button}>
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  } else if (matches.length === 0) {
    content = <Text style={styles.message}>В этом туре пока нет матчей</Text>;
  } else {
    content = (
      <FlatList
        data={visible}
        extraData={favorites.favorites}
        keyExtractor={(m) => m.id}
        refreshing={refreshing}
        onRefresh={() => load('refresh')}
        ListEmptyComponent={
          <Text style={styles.message}>Нет матчей в этой категории</Text>
        }
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            favorite={favorites.isFavorite(item.id)}
            onToggleFavorite={() => favorites.toggle(item.id)}
          />
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.chip, filter === f.key && styles.chipActive]}
          >
            <Text style={filter === f.key ? styles.chipTextActive : styles.chipText}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.updateRow}>
        {updatedAt && <UpdatedAgo since={updatedAt} />}
        <Pressable onPress={() => load('refresh')} disabled={refreshing || loading}>
          <Text style={styles.refresh}>{refreshing ? 'Обновляю…' : 'Обновить'}</Text>
        </Pressable>
      </View>

      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { color: '#111827' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  updateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refresh: { color: '#2563eb', fontWeight: '600' },
  message: { fontSize: 16, marginBottom: 12 },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});