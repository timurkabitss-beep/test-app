import { StyleSheet, Text, View } from 'react-native';
import { formatScore, formatStart, getStatusLabel } from '../matchUtils';
import { Match } from '../types';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  favorite: boolean;
  onToggleFavorite: () => void;
};

export function MatchCard({ match, favorite, onToggleFavorite }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.teams}>
        <Text style={styles.team} numberOfLines={2}>
          {match.home.name}
        </Text>
        <Text style={styles.score}>{formatScore(match.score)}</Text>
        <Text style={[styles.team, styles.away]} numberOfLines={2}>
          {match.away.name}
        </Text>
      </View>
      <View style={styles.footer}>
        <View>
          <Text style={styles.meta}>{formatStart(match.startsAt)}</Text>
          <Text style={styles.status}>{getStatusLabel(match)}</Text>
        </View>
        <FavoriteButton active={favorite} onPress={onToggleFavorite} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  teams: { flexDirection: 'row', alignItems: 'center' },
  team: { flex: 1, fontSize: 16, fontWeight: '600' },
  away: { textAlign: 'right' },
  score: { fontSize: 18, fontWeight: '700', paddingHorizontal: 12 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  meta: { fontSize: 13, color: '#6b7280' },
  status: { fontSize: 13, fontWeight: '600', marginTop: 2 },
});