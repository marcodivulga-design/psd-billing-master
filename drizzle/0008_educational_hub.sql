-- Educational Hub Tables Migration
-- Tabelas para Lessons, Quiz, Books e Minigames

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(20) DEFAULT 'médio',
  duration INTEGER DEFAULT 30,
  completed BOOLEAN DEFAULT FALSE,
  xp INTEGER DEFAULT 100,
  progress INTEGER DEFAULT 0,
  userId VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_category (category),
  INDEX idx_completed (completed)
);

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(36) PRIMARY KEY,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correctAnswer INTEGER NOT NULL,
  explanation TEXT,
  difficulty INTEGER DEFAULT 1,
  category VARCHAR(100),
  lessonId VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_lessonId (lessonId)
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  rating DECIMAL(3, 1) DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'wishlist',
  readingTime INTEGER DEFAULT 0,
  difficulty VARCHAR(20) DEFAULT 'médio',
  tags JSON,
  userId VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_category (category)
);

-- Minigames Table
CREATE TABLE IF NOT EXISTS minigames (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty INTEGER DEFAULT 1,
  averageScore INTEGER DEFAULT 0,
  personalBest INTEGER DEFAULT 0,
  timesPlayed INTEGER DEFAULT 0,
  reward INTEGER DEFAULT 100,
  estimatedTime INTEGER DEFAULT 5,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty)
);

-- User Progress Table (para rastrear progresso do usuário em diferentes atividades)
CREATE TABLE IF NOT EXISTS user_progress (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  type VARCHAR(50),
  targetId VARCHAR(36),
  progress INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_type (type),
  INDEX idx_targetId (targetId)
);

-- Daily Challenges Table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  gameId VARCHAR(36) NOT NULL,
  target INTEGER NOT NULL,
  reward INTEGER DEFAULT 500,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completedAt TIMESTAMP,
  date DATE DEFAULT CURRENT_DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (gameId) REFERENCES minigames(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_date (date),
  INDEX idx_completed (completed)
);

-- Quiz Results Table (para armazenar resultados de quizzes)
CREATE TABLE IF NOT EXISTS quiz_results (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  quizId VARCHAR(36) NOT NULL,
  answers JSON NOT NULL,
  correctCount INTEGER DEFAULT 0,
  totalQuestions INTEGER DEFAULT 0,
  accuracy DECIMAL(5, 2) DEFAULT 0,
  xpEarned INTEGER DEFAULT 0,
  completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_completedAt (completedAt)
);

-- Leaderboard Table (para ranking de jogadores)
CREATE TABLE IF NOT EXISTS leaderboard (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  totalXP INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank INTEGER,
  gamesPlayed INTEGER DEFAULT 0,
  averageAccuracy DECIMAL(5, 2) DEFAULT 0,
  streak INTEGER DEFAULT 0,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_userId (userId),
  INDEX idx_rank (rank),
  INDEX idx_totalXP (totalXP)
);

-- Create indexes for performance
CREATE INDEX idx_lessons_userId_completed ON lessons(userId, completed);
CREATE INDEX idx_books_userId_status ON books(userId, status);
CREATE INDEX idx_minigames_difficulty_category ON minigames(difficulty, category);
CREATE INDEX idx_user_progress_userId_type ON user_progress(userId, type);
CREATE INDEX idx_daily_challenges_userId_date ON daily_challenges(userId, date);
CREATE INDEX idx_quiz_results_userId_completedAt ON quiz_results(userId, completedAt);
