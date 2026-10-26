export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type Team = { id: string; name: string; city: string };

export type Score = { home: number; away: number };

export type Match = {
    id: string;
    startsAt: string | null; // у перенесённого матча даты нет
    status: MatchStatus;
    minute?: number; // только у live
    home: Team;
    away: Team;
    score: Score | null; // у несыгранных матчей null
};

type MatchesResponse = { round: number; matches: Match[] };
export type { MatchesResponse };