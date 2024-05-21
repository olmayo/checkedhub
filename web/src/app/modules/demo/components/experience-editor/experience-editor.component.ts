import { Component, Input } from '@angular/core';
import { Experience } from '../../models/experience';
import { ExperiencesService } from '../../services/experience.service';

@Component({
  selector: 'app-experience-editor',
  templateUrl: './experience-editor.component.html',
  styleUrls: ['./experience-editor.component.sass']
})
export class ExperienceEditorComponent {

    @Input() experience: Experience = new Experience();

    constructor(
      private experienceService: ExperiencesService
    ) {}

    save(experience: Experience) {
      this.experienceService.save(experience);
    }

}
