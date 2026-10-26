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
import { Match } from '../types';

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMatches();
      setMatches(data);
      setUpdatedAt(new Date());
    } catch {
      setError('Не удалось загрузить матчи');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  let content;
  if (loading) {
    content = <ActivityIndicator size="large" />;
  } else if (error) {
    content = (
      <View>
        <Text style={styles.message}>{error}</Text>
        <Pressable onPress={load} style={styles.button}>
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  } else if (matches.length === 0) {
    content = <Text style={styles.message}>В этом туре пока нет матчей</Text>;
  } else {
    content = (
      <FlatList
        data={matches}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <Text style={styles.row}>
            {item.home.name} — {item.away.name}
          </Text>
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  message: { fontSize: 16, marginBottom: 12 },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  row: { fontSize: 16, paddingVertical: 8 },
});