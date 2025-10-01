import { supabase } from '../lib/supabase';
import { UserSettings, UserAchievements, GameStatistic, Difficulty, Theme } from '../types';

const USER_ID_KEY = 'quiz_user_id';

export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export async function getUserSettings(): Promise<UserSettings | null> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }

  return data;
}

export async function createUserSettings(settings: Partial<UserSettings> = {}): Promise<UserSettings | null> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('user_settings')
    .insert({
      id: userId,
      theme_preference: settings.theme_preference || 'system',
      welcome_modal_dismissed: settings.welcome_modal_dismissed || false,
      preferred_difficulty: settings.preferred_difficulty || 'easy',
      sound_enabled: settings.sound_enabled !== undefined ? settings.sound_enabled : true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user settings:', error);
    return null;
  }

  return data;
}

export async function updateUserSettings(updates: Partial<UserSettings>): Promise<UserSettings | null> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user settings:', error);
    return null;
  }

  return data;
}

export async function getOrCreateUserSettings(): Promise<UserSettings> {
  let settings = await getUserSettings();
  if (!settings) {
    settings = await createUserSettings();
    if (!settings) {
      return {
        id: getUserId(),
        theme_preference: 'system',
        welcome_modal_dismissed: false,
        preferred_difficulty: 'easy',
        sound_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }
  return settings;
}

export async function dismissWelcomeModal(): Promise<void> {
  await updateUserSettings({ welcome_modal_dismissed: true });
}

export async function updateTheme(theme: Theme): Promise<void> {
  await updateUserSettings({ theme_preference: theme });
}

export async function updatePreferredDifficulty(difficulty: Difficulty): Promise<void> {
  await updateUserSettings({ preferred_difficulty: difficulty });
}

export async function getUserAchievements(): Promise<UserAchievements | null> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user achievements:', error);
    return null;
  }

  return data;
}

export async function createUserAchievements(): Promise<UserAchievements | null> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      total_games: 0,
      total_wins: 0,
      current_streak: 0,
      best_streak: 0,
      perfect_games: 0,
      easy_wins: 0,
      medium_wins: 0,
      hard_wins: 0,
      total_clues_used: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user achievements:', error);
    return null;
  }

  return data;
}

export async function getOrCreateUserAchievements(): Promise<UserAchievements> {
  let achievements = await getUserAchievements();
  if (!achievements) {
    achievements = await createUserAchievements();
    if (!achievements) {
      return {
        id: crypto.randomUUID(),
        user_id: getUserId(),
        total_games: 0,
        total_wins: 0,
        current_streak: 0,
        best_streak: 0,
        perfect_games: 0,
        easy_wins: 0,
        medium_wins: 0,
        hard_wins: 0,
        total_clues_used: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }
  return achievements;
}

export async function recordGameStatistic(
  countryName: string,
  difficulty: Difficulty,
  cluesUsed: number,
  guessesMade: number,
  won: boolean,
  score: number,
  cluesRevealed: string[]
): Promise<void> {
  const userId = getUserId();

  const { error } = await supabase
    .from('game_statistics')
    .insert({
      user_id: userId,
      country_name: countryName,
      difficulty,
      clues_used: cluesUsed,
      guesses_made: guessesMade,
      won,
      score,
      clues_revealed: cluesRevealed,
    });

  if (error) {
    console.error('Error recording game statistic:', error);
    return;
  }

  await updateAchievements(difficulty, cluesUsed, won, guessesMade);
}

async function updateAchievements(
  difficulty: Difficulty,
  cluesUsed: number,
  won: boolean,
  guessesMade: number
): Promise<void> {
  const achievements = await getOrCreateUserAchievements();

  const isPerfectGame = won && cluesUsed <= 2 && guessesMade === 1;
  const newStreak = won ? achievements.current_streak + 1 : 0;

  const updates: Partial<UserAchievements> = {
    total_games: achievements.total_games + 1,
    total_wins: won ? achievements.total_wins + 1 : achievements.total_wins,
    current_streak: newStreak,
    best_streak: Math.max(newStreak, achievements.best_streak),
    perfect_games: isPerfectGame ? achievements.perfect_games + 1 : achievements.perfect_games,
    total_clues_used: achievements.total_clues_used + cluesUsed,
  };

  if (won) {
    if (difficulty === 'easy') updates.easy_wins = achievements.easy_wins + 1;
    if (difficulty === 'medium') updates.medium_wins = achievements.medium_wins + 1;
    if (difficulty === 'hard') updates.hard_wins = achievements.hard_wins + 1;
  }

  const { error } = await supabase
    .from('user_achievements')
    .update(updates)
    .eq('user_id', achievements.user_id);

  if (error) {
    console.error('Error updating achievements:', error);
  }
}

export async function getRecentGames(limit: number = 10): Promise<GameStatistic[]> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('game_statistics')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent games:', error);
    return [];
  }

  return data || [];
}
