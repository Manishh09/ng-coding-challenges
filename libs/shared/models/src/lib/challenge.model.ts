export interface Challenge {
  id: number;
  title: string;
  description: string;
  link: string;
  requirement: string;
  solutionGuide: string;
  gitHub: string;

  // Enhanced metadata for better UI
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'http' | 'forms' | 'routing' | 'state-management' | 'performance' | 'testing';
  estimatedTime: number; // in minutes
  tags: string[];
  isCompleted?: boolean;
  isFeatured?: boolean;
  lastUpdated?: Date;
  prerequisites?: string[];
}


export interface ChallengeCardData {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  tags: string[];
  estimatedTime: number;
  isCompleted?: boolean;
  isFeatured?: boolean;
}
