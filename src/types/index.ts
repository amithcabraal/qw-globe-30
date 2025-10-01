export interface Country {
  name: string;
  code: string;
  code3: string;
  capital: string;
  population: number;
  region: string;
  flag: string;
  maps: string;
  exports?: string[];
  funFact?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Theme = 'light' | 'dark' | 'system';

export interface UserSettings {
  id: string;
  theme_preference: Theme;
  custom_theme?: string;
  welcome_modal_dismissed: boolean;
  preferred_difficulty: Difficulty;
  sound_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameStatistic {
  id: string;
  user_id: string;
  country_name: string;
  difficulty: Difficulty;
  clues_used: number;
  guesses_made: number;
  won: boolean;
  score: number;
  clues_revealed: string[];
  played_at: string;
}

export interface UserAchievements {
  id: string;
  user_id: string;
  total_games: number;
  total_wins: number;
  current_streak: number;
  best_streak: number;
  perfect_games: number;
  easy_wins: number;
  medium_wins: number;
  hard_wins: number;
  total_clues_used: number;
  created_at: string;
  updated_at: string;
}

export type ClueType = 'flag' | 'map' | 'capital' | 'export' | 'fact' | 'region';

export interface RoundResult {
  country: Country;
  won: boolean;
  score: number;
  cluesUsed: number;
  guessesUsed: number;
}

export interface GameState {
  currentCountry: Country | null;
  difficulty: Difficulty;
  revealedClues: ClueType[];
  guessesRemaining: number;
  gameStatus: 'playing' | 'won' | 'lost';
  score: number;
  roundNumber: number;
  totalRounds: number;
  roundScores: number[];
  showCorrectFeedback: boolean;
  seed: number | null;
  selectedCountries: Country[];
  roundResults: RoundResult[];
}
