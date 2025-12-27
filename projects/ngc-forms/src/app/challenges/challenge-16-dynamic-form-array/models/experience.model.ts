/**
 * Experience data model for dynamic FormArray challenge
 */
export interface Experience {
  company: string;
  role: string;
  years: number;
}

/**
 * Form data structure
 */
export interface ExperienceFormData {
  experiences: Experience[];
}
