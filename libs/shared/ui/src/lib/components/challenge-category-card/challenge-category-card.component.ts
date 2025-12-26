import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ChallengeCategory } from '@ng-coding-challenges/shared/models';
import { A11yModule } from "@angular/cdk/a11y";
import { MatTooltipModule } from '@angular/material/tooltip';

type CategoryMeta = {
  icon: string;
  accent: string;
  headline: string;
  skills: readonly string[];
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  'rxjs-api': {
    icon: 'hub',
    accent: 'linear-gradient(120deg, rgba(99,102,241,0.38), rgba(56,189,248,0.28))',
    headline: 'Master reactive API orchestration with RxJS.',
    skills: ['Observables', 'Error handling', 'Data streams'],
  },
  'angular-core': {
    icon: 'account_tree',
    accent: 'linear-gradient(120deg, rgba(236,72,153,0.38), rgba(244,114,182,0.28))',
    headline: 'Strengthen core component architecture and communication.',
    skills: ['Components', 'Signals', 'State patterns'],
  },
  'angular-routing': {
    icon: 'alt_route',
    accent: 'linear-gradient(120deg, rgba(56,189,248,0.35), rgba(59,130,246,0.28))',
    headline: 'Design resilient routing flows and guarded experiences.',
    skills: ['Guards', 'Lazy loading', 'Navigation UX'],
  },
};

const FALLBACK_META: CategoryMeta = {
  icon: 'auto_awesome',
  accent: 'linear-gradient(135deg, rgba(165,180,252,0.34), rgba(168,85,247,0.26))',
  headline: 'Build confidence with modern Angular problem sets.',
  skills: ['Angular fundamentals', 'Best practices', 'Performance'],
};

@Component({
  selector: 'app-challenge-category-card',
  templateUrl: './challenge-category-card.component.html',
  styleUrls: ['./challenge-category-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatChipsModule, MatButtonModule, MatTooltipModule, A11yModule, RouterLink],
})
export class ChallengeCategoryCardComponent {

  // Input properties
  readonly category = input.required<ChallengeCategory>();
  readonly selected = input(false);

  readonly categoryMeta = computed(() =>
    this.resolveMeta(this.category())
  );
  readonly challengeCountLabel = computed(
    () => `${this.category().challengeCount ?? 0} challenges`
  );

  private resolveMeta(category: ChallengeCategory): CategoryMeta {
    return CATEGORY_META[category.id] ?? FALLBACK_META;
  }
}
