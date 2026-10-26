import { MATCHES_URL } from './config';
import { Match, MatchesResponse } from './types';

export async function fetchMatches(): Promise<Match[]> {
    const response = await fetch(MATCHES_URL);
    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }
    const data: MatchesResponse = await response.json();
    return data.matches;
}