import { Injectable, signal, computed } from '@angular/core';
import { Project, ProjectFormData } from '../models/project.model';

/**
 * Service to manage projects data
 * Uses Angular Signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // Signal to hold the list of projects
  private projectsSignal = signal<Project[]>([
    {
      id: '1',
      name: 'Project-Alpha',
      description: 'First project in the system',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Project-Beta',
      description: 'Second project for testing',
      createdAt: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'Project-Gamma',
      description: 'Third project with hyphenated name',
      createdAt: new Date('2024-03-10')
    },
    {
      id: '4',
      name: 'Project-Delta',
      description: 'Project with multiple spaces',
      createdAt: new Date('2024-04-05')
    },
    {
      id: '5',
      name: 'Project-K',
      description: 'Project with single letter name',
      createdAt: new Date('2024-05-12')
    }
  ]);

  // Public readonly signal for component consumption
  public readonly projects = this.projectsSignal.asReadonly();

  // Computed signal for project names array (for validator)
  public readonly projectNames = computed(() =>
    this.projectsSignal().map(p => p.name)
  );

  /**
   * Create a new project
   */
  createProject(formData: ProjectFormData): Project {
    const newProject: Project = {
      id: this.generateId(),
      name: formData.name,
      description: formData.description,
      createdAt: new Date()
    };

    this.projectsSignal.update(projects => [...projects, newProject]);
    return newProject;
  }

  /**
   * Generate a unique ID for new projects
   */
  private generateId(): string {
    const maxId = this.projectsSignal().reduce((max, project) => {
      const id = parseInt(project.id, 10);
      return isNaN(id) ? max : Math.max(max, id);
    }, 0);
    return (maxId + 1).toString();
  }
}
