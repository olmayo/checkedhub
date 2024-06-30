import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader";
import { PlaceService } from '../../services';
import { EnvService } from 'src/app/env/env.service';

@Component({
  selector: 'ch-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('gmapContainer', {static: false}) gmap!: ElementRef;

  @Input() experiences: any;
  @Input() poi: any;

  map?: google.maps.Map;
  savedRoute?: any;

  constructor(
    private envService: EnvService,
    private placeService: PlaceService
  ) {}

  ngOnInit(): void {
    this.placeService.get().subscribe();
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  ngOnChanges() {

    if (!this.map) return;

    // Add experiences markers
    let bounds = new google.maps.LatLngBounds();
    this.experiences?.forEach((experience: any) => {
      if (experience.place) { 
        this.drawMarker(experience.place.latitude, experience.place.longitude);
        bounds.extend(new google.maps.LatLng(experience.place.latitude, experience.place.longitude));
      }
      if (experience.polyline) this.drawPolyline(experience.polyline);
    });

    // Add POI markers
    if (this.poi) bounds = new google.maps.LatLngBounds();
    this.poi?.forEach((poi: any) => {
      this.drawMarker(poi.latitude, poi.longitude);
      bounds.extend(new google.maps.LatLng(poi.latitude, poi.longitude));
    });

    // Position & Zoom
    this.map.fitBounds(bounds);
    const listener = google.maps.event.addListener(this.map, 'idle', () => {
      let zoom = this.map?.getZoom();
      if (!zoom) return;
      if (zoom > 16) this.map!.setZoom(16);
      google.maps.event.removeListener(listener);
    });
  }

  mapInitializer() {
    const loader = new Loader({
      apiKey: this.envService.google_api_key,
      version: "weekly",
      libraries: ["geometry"]
    });
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      this.map = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2
      });
    });
  }

  drawMarker(lat: number, lng: number) {
    let marker = new google.maps.Marker({ 
      position: new google.maps.LatLng(lat, lng), 
      map: this.map 
    });
    marker.setMap(this.map!);
  }

  drawPolyline(polyline: string) {
    const route = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(polyline),
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    route.setMap(this.map!);
  }

}
