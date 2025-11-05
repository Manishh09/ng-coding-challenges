import { Component } from '@angular/core';
import { ChallengeHeaderComponent } from 'projects/ngc-shell/src/app/shared/components/challenge-header/challenge-header.component';

@Component({
  selector: 'app-product-list',
  imports: [ChallengeHeaderComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

}
