import { Routes } from '@angular/router';
import { HomeComponent } from './modules/demo/components/home/home.component';
import { MapComponent } from './modules/demo/components/map/map.component';
import { GuardService } from './modules/auth/services/guard.service';
import { DemoComponent } from './modules/demo/components/demo/demo.component';
import { LoginSignupComponent } from './modules/auth/components/login-signup/login-signup.component';

export const routes: Routes = [
  {
    path: '',
    component: DemoComponent
  }
];