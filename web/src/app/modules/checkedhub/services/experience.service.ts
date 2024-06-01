import { Injectable } from '@angular/core';
import { Experience } from '../models/experience';
import { CrudService } from '../../api/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService extends CrudService {

  override endpoint?: string = 'experiences';
  override model?: any = Experience;

}