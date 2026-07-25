import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StockTickerService } from '../../services/stock-ticker.service';

@Component({
  selector: 'app-stock-dashboard',
  standalone: true,
  imports: [DecimalPipe, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './stock-dashboard.component.html',
  styleUrl: './stock-dashboard.component.scss',
  /**
   * OnPush + Signals: Angular only checks this component when a signal
   * read in the template actually changes — no wasted CD cycles.
   */
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockDashboardComponent implements OnInit, OnDestroy {
  private readonly ticker = inject(StockTickerService);

  // ── Source Signal (from service) ────────────────────────────────────────────
  readonly stocks = this.ticker.stocks;
  readonly displayedColumns = ['symbol', 'name', 'price', 'change'];
  readonly isLive = signal(true);

  // ── Computed Signals ────────────────────────────────────────────────────────
  readonly portfolioTotal = computed(() =>
    this.stocks().reduce((sum, s) => sum + s.price, 0)
  );

  readonly gainersCount = computed(() =>
    this.stocks().filter(s => s.change > 0).length
  );

  readonly losersCount = computed(() =>
    this.stocks().filter(s => s.change < 0).length
  );

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startTicker();
  }

  ngOnDestroy(): void {
    this.stopTicker();
  }

  toggleLive(): void {
    this.isLive.update(v => !v);
    this.isLive() ? this.startTicker() : this.stopTicker();
  }

  private startTicker(): void {
    this.intervalId = setInterval(() => this.ticker.tick(), 1500);
  }

  private stopTicker(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
