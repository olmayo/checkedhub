export class Place {

    id?: number;
    place_id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;

    constructor(place?: any) {
        Object.assign(this, place);
    }
    
}