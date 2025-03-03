
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  isEditing?: boolean;
}

export interface AppConfig {
  numberOfQuestions: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

export type FileType = 'pdf' | 'text' | null;
