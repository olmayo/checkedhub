import { Injectable } from '@angular/core';
import { PointOfInterest } from '../models/point-of-interest';
import { CrudService } from '../../api/crud.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceService extends CrudService {

  override endpoint?: string = 'places';
  override model?: any = PointOfInterest;

}