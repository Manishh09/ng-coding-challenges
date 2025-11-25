export interface Challenge {

  id: number;
  title: string;
  description: string;
  link: string;
  requirement: string;
  solutionGuide: string;
  gitHub: string;
  category: string;
  // New fields for details page
  longDescription?: string;
  learningOutcomes?: string[];
  techStack?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
    profileUrl?: string;
  };
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
