import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader";
import { PointOfInterest } from '../../models/point-of-interest';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-place-finder',
  templateUrl: './place-finder.component.html',
  styleUrls: ['./place-finder.component.sass'],
  providers: [     
    {       
      provide: NG_VALUE_ACCESSOR, 
      useExisting: forwardRef(() => PlaceFinderComponent),
      multi: true     
    }
  ]
})
export class PlaceFinderComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

    @Input() multiple: boolean = false;

    ngOnInit(): void {
      window.addEventListener('keydown', this.handleEscapeKey);
    }

    ngOnChanges(): void {
      this.enforceFieldCountRule();
    }
  
    ngOnDestroy(): void {
      window.removeEventListener('keydown', this.handleEscapeKey);
    }
    
    // ControlValueAccessor Implementation
    _value?: Array<any>;
    get value(): PointOfInterest|Array<PointOfInterest|undefined>|undefined {
      if (!this._value) return undefined;
      let value = this._value.map((x: any) => x.place);
      return this.multiple ? value : value[0];
    }

    private onChange: any = () => {};
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    private onTouch: any = () => {};
    registerOnTouched(fn: any): void {
      this.onTouch = fn;
    }

    writeValue(value: PointOfInterest|Array<PointOfInterest>) {
      let values = Array.isArray(value) ? value : [value];
      if (!this.multiple && values.length) values = [values[0]];
      this._value = values.map((place: PointOfInterest) => ({
        position: 1,
        value: place
      }));
      this.enforceFieldCountRule();
    }

    // Component Logic
    search(field: any) {
      const loader = new Loader({
        apiKey: "AIzaSyAKS6nVQRipLHPqBa90uKbkq3Ljs-gMzGI",
        version: "weekly",
        libraries: ["geometry"]
      });
      loader.load().then(async () => {
        const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        const { places } = await Place.searchByText({
          textQuery: field.query,
          fields: ['displayName', 'location', 'formattedAddress', 'types'],
          language: 'en-US',
          maxResultCount: 10
        });
        field.places = places.map((x: any) => {
          let poi = new PointOfInterest();
          poi.place_id = x.id;
          poi.name = x.displayName;
          poi.latitude = x.location.lat();
          poi.longitude = x.location.lng();
          poi.types = x.types;
          poi.formattedAddress = x.formattedAddress;
          return poi;
        });
      });
    }

    select(field: any, place: PointOfInterest|undefined) {
      field.query = '';
      field.places = [];
      field.place = place;
      this.onChange(this.value);
    }

    deleteField(field: any) {
      this._value = this._value?.filter((o: any) => o !== field);
    }

    addField() {
      this._value?.push({
        position: Math.max(...this._value.map((o: any) => o.position)),
        place: undefined
      });
    }

    enforceFieldCountRule() {
      if (this.multiple) {
        if (this._value?.length! < 2) {
          this._value?.push({ position: 2, place: undefined });
        }
      }
      else {
        if (this._value?.length) this._value = [this._value[0]];
      }
    }

    // KeyBoard Listener
    submitOnEnter(event: any, field: any) {
      if (event.key === 'Enter') this.search(field);
    }

    handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        this._value?.forEach((field: any) => {
          field.query = '';
          field.places = undefined
        });
      }
    }

}
