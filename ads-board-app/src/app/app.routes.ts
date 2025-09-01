import { Routes } from '@angular/router';
import { AdListComponent } from '../components/ad-list.component/ad-list.component';
import { AdDetailsComponent } from '../components/ad-details.component/ad-details.component';
import { LoginComponent } from '../components/login.component/login.component';

export const routes: Routes = [
    { path: '', component: AdListComponent },
   { path: 'ads/new', component: AdDetailsComponent },
   { path: 'ads/:id/edit', component: AdDetailsComponent },
    { path: 'login', component: LoginComponent }
];
