import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  ExperienceEditorComponent,
  FormControlComponent,
  HomeComponent,
  MapComponent,
  PlaceFinderComponent,
  ProfileComponent,
  SchedulerDateComponent
} from './components';

import { 
  ExperienceService, 
  PlaceService 
} from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  declarations: [
    ExperienceEditorComponent,
    FormControlComponent,
    HomeComponent,
    MapComponent,
    PlaceFinderComponent,
    ProfileComponent,
    SchedulerDateComponent
  ],
  providers: [
    ExperienceService,
    PlaceService
  ]
})
export class CheckedhubModule { }