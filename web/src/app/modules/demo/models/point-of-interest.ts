export class PointOfInterest {

    id?: number;
    place_id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;
    types?: Array<string>;
    location?: any;
    formattedAddress?: string;

    constructor(place?: any) {
        Object.assign(this, place);
    }

    get icon() {
        if (this.types?.includes('airport')) return 'plane-departure';
        if (this.types?.includes('restaurant')) return 'utensils';
        return 'location-dot';
    }
    
}