/**
 * Project model representing a project entity
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

/**
 * Form data structure for project creation/editing
 */
export interface ProjectFormData {
  name: string;
  description: string;
}

/**
 * Validation context for duplicate name validator
 */
export interface ValidationContext {
  existingNames: string[];
  currentProjectId?: string;
  mode: 'create' | 'edit';
}
