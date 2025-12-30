# Challenge-to-Playground Integration

This guide shows how to add "Open in Playground" functionality to your challenge cards.

## Quick Integration

### Option 1: Link from Challenge Card

Add a link in your challenge card component:

```html
<!-- challenge-card.component.html -->
<div class="challenge-card">
  <h3>{{ challenge.title }}</h3>
  <p>{{ challenge.description }}</p>
  <span class="difficulty">{{ challenge.difficulty }}</span>
  
  <div class="actions">
    <!-- Existing view details button -->
    <a [routerLink]="['/challenges', challenge.categoryId, challenge.slug]">
      View Details
    </a>
    
    <!-- NEW: Open in Playground button -->
    <a 
      [routerLink]="['/playground']"
      [queryParams]="{ category: challenge.categoryId, challenge: challenge.slug }"
      class="btn-playground">
      🚀 Open in Playground
    </a>
  </div>
</div>
```

### Option 2: Programmatic Navigation

Navigate programmatically from TypeScript:

```typescript
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export class ChallengeListComponent {
  private router = inject(Router);

  openInPlayground(challenge: Challenge): void {
    this.router.navigate(['/playground'], {
      queryParams: {
        category: challenge.categoryId,
        challenge: challenge.slug
      }
    });
  }
}
```

## URL Format

The playground expects these query parameters:

```
/playground?category=rxjs-api&challenge=fetch-products
           └─────────┬─────────┘ └────────┬───────────┘
                     │                     │
              categoryId from          slug from
              challenges.json       challenges.json
```

## Example URLs

```
# Forms Challenge
/playground?category=angular-forms&challenge=reactive-login-form

# RxJS Challenge  
/playground?category=rxjs-api&challenge=fetch-products

# Routing Challenge
/playground?category=angular-routing&challenge=authorized-resource-access
```

## Complete Example Component

```typescript
// challenge-browser.component.ts
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-challenge-browser',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="challenges-grid">
      @for (challenge of challenges(); track challenge.id) {
        <div class="challenge-card">
          <div class="challenge-header">
            <h3>{{ challenge.title }}</h3>
            <span class="difficulty-badge" [class]="challenge.difficulty.toLowerCase()">
              {{ challenge.difficulty }}
            </span>
          </div>
          
          <p class="description">{{ challenge.description }}</p>
          
          <div class="tags">
            @for (tag of challenge.tags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
          
          <div class="actions">
            <button 
              (click)="viewDetails(challenge)"
              class="btn-secondary">
              View Details
            </button>
            
            <button 
              (click)="openInPlayground(challenge)"
              class="btn-primary">
              🚀 Open in Playground
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .challenges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }

    .challenge-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }
    }

    .challenge-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      
      h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #333;
      }
    }

    .difficulty-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      
      &.beginner {
        background: #e8f5e9;
        color: #2e7d32;
      }
      
      &.intermediate {
        background: #fff3e0;
        color: #e65100;
      }
      
      &.advanced {
        background: #ffebee;
        color: #c62828;
      }
    }

    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
      
      .tag {
        padding: 0.25rem 0.75rem;
        background: #f5f5f5;
        border-radius: 12px;
        font-size: 0.75rem;
        color: #666;
      }
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      
      button {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        
        &.btn-secondary {
          background: #f5f5f5;
          color: #333;
          
          &:hover {
            background: #e0e0e0;
          }
        }
        
        &.btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
        }
      }
    }
  `]
})
export class ChallengeBrowserComponent {
  private router = inject(Router);
  
  challenges = signal([
    {
      id: 1,
      slug: 'fetch-products',
      title: 'Challenge 01: Fetch Products',
      categoryId: 'rxjs-api',
      difficulty: 'Beginner',
      description: 'Fetch product data from a fake API and display it in a table.',
      tags: ['HttpClient', 'API', 'RxJS']
    },
    {
      id: 12,
      slug: 'reactive-login-form',
      title: 'Challenge 12: Reactive Login Form',
      categoryId: 'angular-forms',
      difficulty: 'Beginner',
      description: 'Build a reactive login form with validation.',
      tags: ['Reactive Forms', 'FormGroup', 'Validators']
    }
  ]);

  viewDetails(challenge: any): void {
    this.router.navigate(['/challenges', challenge.categoryId, challenge.slug]);
  }

  openInPlayground(challenge: any): void {
    this.router.navigate(['/playground'], {
      queryParams: {
        category: challenge.categoryId,
        challenge: challenge.slug
      }
    });
  }
}
```

## Styling Tips

```scss
// Playground button styling
.btn-playground {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}
```

## Testing

Test the integration with these URLs:

1. **Forms Challenge**:
   ```
   http://localhost:4200/playground?category=angular-forms&challenge=reactive-login-form
   ```

2. **RxJS Challenge**:
   ```
   http://localhost:4200/playground?category=rxjs-api&challenge=fetch-products
   ```

3. **No Parameters** (shows empty state):
   ```
   http://localhost:4200/playground
   ```

## Troubleshooting

### Challenge Not Loading

1. Check browser console for errors
2. Verify query parameters are correct
3. Ensure challenge exists in `challenges.json`
4. Check that `ChallengeLoaderService` can access `/config/challenges.json`

### 404 on challenges.json

Make sure the file is in the correct location:
```
projects/ngc-shell/public/config/challenges.json
```

And that `angular.json` includes it in assets:
```json
{
  "assets": [
    "projects/ngc-shell/public"
  ]
}
```

## Next Steps

1. Add playground links to your existing challenge cards
2. Test with different challenges
3. Customize the playground UI
4. Add validation and testing features
