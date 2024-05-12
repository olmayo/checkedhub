import { Component } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader";

@Component({
  selector: 'app-place-finder',
  templateUrl: './place-finder.component.html',
  styleUrls: ['./place-finder.component.sass']
})
export class PlaceFinderComponent {

    query: string = '';
    place?: any;
    places: any = [];

    search(query: string) {
      const loader = new Loader({
        apiKey: "AIzaSyAKS6nVQRipLHPqBa90uKbkq3Ljs-gMzGI",
        version: "weekly"
      });
      loader.load().then(async () => {
        const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        const { places } = await Place.searchByText({
          textQuery: query,
          fields: ['displayName', 'location', 'formattedAddress', 'types'],
          language: 'en-US',
          maxResultCount: 10
        });
        this.places = places;
        console.log(places);
      });

    }

    select(place: any) {
      this.place = place;
    }

}
