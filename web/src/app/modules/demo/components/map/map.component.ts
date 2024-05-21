import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader";
import { ExperiencesService } from '../../services/experience.service';
import { PlacesService } from '../../services/place.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('gmapContainer', {static: false}) gmap!: ElementRef;
  map?: google.maps.Map;
  savedRoute?: any;

  constructor(
    private experiencesService: ExperiencesService,
    private placesService: PlacesService
  ) {}

  ngOnInit(): void {
    this.placesService.get().subscribe((x: any) => console.log(x));
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    const loader = new Loader({
      apiKey: "AIzaSyAKS6nVQRipLHPqBa90uKbkq3Ljs-gMzGI",
      version: "weekly",
      libraries: ["geometry"]
    });
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      this.map = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2
      });
      this.experiencesService.get().subscribe((experiences: any) => {
        console.log(experiences);
        experiences.forEach((experience: any) => {
          if (experience.place) this.drawMarker(experience.place.latitude, experience.place.longitude);
          if (experience.polyline) this.drawPolyline(experience.polyline);
        });
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
