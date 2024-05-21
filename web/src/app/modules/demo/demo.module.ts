import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './components/home/home.component';
import { DemoComponent } from './components/demo/demo.component';
import { PlaceFinderComponent } from './components/place-finder/place-finder.component';
import { ExperienceEditorComponent } from './components/experience-editor/experience-editor.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { ExperiencesService } from './services/experience.service';
import { MapComponent } from './components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FontAwesomeModule
  ],
  declarations: [
    ChatComponent,
    DemoComponent,
    ExperienceEditorComponent,
    HomeComponent,
    MapComponent,
    PlaceFinderComponent,
    ProfileComponent
  ],
  providers: [
    ExperiencesService
  ]
})
export class DemoModule { }