export interface Challenge {

  id: number;
  title: string;
  description: string;
  link: string;
  requirement: string;
  solutionGuide: string;
  gitHub: string;
  category: string;
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
