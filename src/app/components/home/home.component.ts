import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { ListComponent } from '../list/list.component';
import { QueryParams } from '../../models/mobile-post-office.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchComponent, ListComponent],
  template: `
    <div class="home-container">
      <app-search (searchChange)="onSearchChange($event)"></app-search>
      <app-list #listComponent></app-list>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 1rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      @media (max-width: 768px) {
        .home-container {
          padding: 0.5rem;
        }
      }
    `,
  ],
})
export class HomeComponent {
  @ViewChild('listComponent') listComponent!: ListComponent;

  onSearchChange(params: QueryParams): void {
    if (this.listComponent) {
      this.listComponent.onSearchChange(params);
    }
  }
}
