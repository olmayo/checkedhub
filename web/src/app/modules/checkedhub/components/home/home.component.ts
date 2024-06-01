import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../services';

@Component({
  selector: 'ch-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  experiences: any;

  constructor(
    private experiencesService: ExperienceService
  ) {}

  ngOnInit() {
    this.experiencesService.get().subscribe((experiences: any) => this.experiences = experiences);
  }

}
