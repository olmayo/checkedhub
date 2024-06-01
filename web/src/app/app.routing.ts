import { Routes } from '@angular/router';
import { LoginSignupComponent } from './modules/auth/components/login-signup/login-signup.component';
import { 
  ExperienceEditorComponent, 
  HomeComponent 
} from './modules/checkedhub/components';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginSignupComponent
  },
  {
    path: 'add',
    component: ExperienceEditorComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];