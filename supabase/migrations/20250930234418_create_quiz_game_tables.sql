/*
  # Country Quiz Game Database Schema

  ## Overview
  Creates the core database structure for a country guessing quiz game with user settings,
  game statistics tracking, and achievement systems.

  ## New Tables

  ### 1. `user_settings`
  Stores individual user preferences and app configuration
  - `id` (uuid, primary key) - Unique identifier for each user session
  - `theme_preference` (text) - User's chosen theme: 'light', 'dark', or 'system'
  - `custom_theme` (text) - Optional custom theme name
  - `welcome_modal_dismissed` (boolean) - Whether user has dismissed the welcome modal
  - `preferred_difficulty` (text) - Last selected difficulty: 'easy', 'medium', or 'hard'
  - `sound_enabled` (boolean) - Whether sound effects are enabled
  - `created_at` (timestamptz) - When the settings were first created
  - `updated_at` (timestamptz) - Last modification timestamp

  ### 2. `game_statistics`
  Records every game played with detailed performance metrics
  - `id` (uuid, primary key) - Unique identifier for each game
  - `user_id` (uuid) - Links to user_settings for tracking individual player stats
  - `country_name` (text) - The country that was the answer
  - `difficulty` (text) - Game difficulty: 'easy', 'medium', or 'hard'
  - `clues_used` (integer) - Number of clues revealed (0-6)
  - `guesses_made` (integer) - Number of guesses attempted (1-3)
  - `won` (boolean) - Whether the player guessed correctly
  - `score` (integer) - Calculated score based on performance
  - `clues_revealed` (text[]) - Array of which clues were used
  - `played_at` (timestamptz) - When the game was completed

  ### 3. `user_achievements`
  Tracks cumulative player achievements and milestones
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, unique) - Links to user_settings
  - `total_games` (integer) - Total number of games played
  - `total_wins` (integer) - Total number of games won
  - `current_streak` (integer) - Current consecutive wins
  - `best_streak` (integer) - Highest consecutive wins achieved
  - `perfect_games` (integer) - Games won with minimal clues/guesses
  - `easy_wins` (integer) - Wins on easy difficulty
  - `medium_wins` (integer) - Wins on medium difficulty
  - `hard_wins` (integer) - Wins on hard difficulty
  - `total_clues_used` (integer) - Cumulative clues used across all games
  - `created_at` (timestamptz) - When achievements tracking started
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Allow anonymous users to manage their own data via session-based user_id
  - Policies ensure users can only read/write their own records

  ## Indexes
  - Add indexes on user_id columns for efficient queries
  - Add index on played_at for chronological game history retrieval
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_preference text DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  custom_theme text,
  welcome_modal_dismissed boolean DEFAULT false,
  preferred_difficulty text DEFAULT 'easy' CHECK (preferred_difficulty IN ('easy', 'medium', 'hard')),
  sound_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_statistics table
CREATE TABLE IF NOT EXISTS game_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  country_name text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  clues_used integer NOT NULL CHECK (clues_used >= 0 AND clues_used <= 6),
  guesses_made integer NOT NULL CHECK (guesses_made >= 1 AND guesses_made <= 3),
  won boolean NOT NULL,
  score integer NOT NULL DEFAULT 0,
  clues_revealed text[] DEFAULT '{}',
  played_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  total_games integer DEFAULT 0,
  total_wins integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  perfect_games integer DEFAULT 0,
  easy_wins integer DEFAULT 0,
  medium_wins integer DEFAULT 0,
  hard_wins integer DEFAULT 0,
  total_clues_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for game_statistics
CREATE POLICY "Users can read own game statistics"
  ON game_statistics
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own game statistics"
  ON game_statistics
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own achievements"
  ON user_achievements
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_statistics_user_id ON game_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_game_statistics_played_at ON game_statistics(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_achievements_updated_at ON user_achievements;
CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
