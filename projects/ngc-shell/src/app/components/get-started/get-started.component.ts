import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-get-started',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss'
})
export class GetStartedComponent {


}
