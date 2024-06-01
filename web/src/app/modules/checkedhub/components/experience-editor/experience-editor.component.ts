import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Experience } from '../../models';
import { ExperienceService } from '../../services';

@Component({
  selector: 'ch-experience-editor',
  templateUrl: './experience-editor.component.html',
  styleUrls: ['./experience-editor.component.sass']
})
export class ExperienceEditorComponent {

    @Input() experience: Experience = new Experience();
    @Output() poiChange: EventEmitter<any> = new EventEmitter();

    locations: any;
    suggestedTypes?: Array<any>;
    experienceTypes: Array<any> = [
      { journey: false, name: 'Dining', icon: 'utensils', resourcetype: 'Dining' },
      { journey: false, name: 'Activity', icon: 'volleyball', resourcetype: 'Activity' },
      { journey: false, name: 'Visit', icon: 'eye', resourcetype: 'Visit' },
      { journey: false, name: 'Stay', icon: 'home', resourcetype: 'Stay' },
      { journey: true, name: 'Flight', icon: 'plane', resourcetype: 'Flight' },
      { journey: true, name: 'Overland', icon: 'car', resourcetype: 'Overland' }
    ];
    datetime?: any;
    experiences?: any;
    poi?: any;

    constructor(
      private experienceService: ExperienceService
    ) {}

    save(experience: Experience) {
      this.experienceService.save(experience).subscribe(() => {
        this.experience = new Experience();
        this.suggestedTypes = undefined;
      });
    }

    resetForm() {
      this.experience = new Experience();
      this.updateSuggestedTypes();
    }

    locationChange(locations: any) {
      this.locations = locations;
      if (this.experience.isJourney) this.experience.places = this.locations;
      if (!this.experience.isJourney) this.experience.place = this.locations;
      this.updateSuggestedTypes();
      this.showPoiOnMap(this.locations);
    }

    showPoiOnMap(results: any) {
      this.poi = results;
      this.poiChange.emit(results);
    }

    datetimeChange(datetime: any) {
      this.datetime = datetime;
      this.experience.start_date = datetime?.from.date;
      this.experience.start_time = datetime?.from.time;
      this.experience.end_date = datetime?.until.date;
      this.experience.end_time = datetime?.until.time;
    }

    updateSuggestedTypes() {
      let locationsArray = Array.isArray(this.locations) ? this.locations : [this.locations];
      let locationNonNull = locationsArray?.filter((o: any) => o);

      // Minimum conditions
      if (!locationNonNull?.length || (this.experience.isJourney && locationNonNull?.length < 2)) 
        return this.suggestedTypes = undefined;

      // Recommended types
      this.suggestedTypes = this.experienceTypes
        .filter((x: any) => x.journey == this.experience.isJourney)
        .map((x: any) => {
          x.score = 0;
          if (x.resourcetype=='Flight' && locationsArray.length==2 && locationsArray[0]?.types.includes('airport') && locationsArray[1]?.types.includes('airport')) x.score = 100;
          if (x.resourcetype=='Overland' && locationsArray.length >= 2) x.score = 90;
          if (x.resourcetype=='Dining' && locationsArray.length==1 && locationsArray[0]?.types.includes('restaurant')) x.score = 90;
          return x;
        })
        .sort((a: any, b: any) => a.score > b.score ? -1 : 1);
      
      // Set experience type as highest score
      this.experience.resourcetype = this.suggestedTypes[0]?.resourcetype;
    }

    selectResourceType(resourcetype: string) {
      this.experience.resourcetype = resourcetype;
      this.updateSuggestedName();
    }

    updateSuggestedName() {
      if (this.experience._nameTouched) return;
      this.experience.name = `${this.experience.resourcetype} at ${this.experience?.place?.name}`;
    }

}
