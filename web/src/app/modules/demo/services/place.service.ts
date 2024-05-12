import { Injectable } from '@angular/core';
import { Place } from '../models/place';
import { CrudService } from '../../api/crud.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService extends CrudService {

  override endpoint?: string = 'places';
  override model?: any = Place;

}