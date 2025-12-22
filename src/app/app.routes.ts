import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailComponent } from './components/detail/detail.component';
import { EditComponent } from './components/edit/edit.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Mobile Post Office - Home',
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    title: 'Mobile Post Office - Detail',
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    title: 'Mobile Post Office - Edit',
  },
  {
    path: 'create',
    component: EditComponent,
    title: 'Mobile Post Office - Create',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
