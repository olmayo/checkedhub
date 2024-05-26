import { PointOfInterest } from "./point-of-interest";

export class Experience {

    id?: number;
    name?: string;
    type?: string;
    resourcetype?: string;
    place?: PointOfInterest;
    places?: Array<PointOfInterest>;
    start_date?: Date;
    start_time?: any;
    end_date?: Date;
    end_time?: any;

    _nameTouched?: boolean = false;

    constructor(experience?: any) {
        Object.assign(this, experience);
    }

    private _isJourney?: boolean;
    set isJourney(value: boolean|undefined) {
        this._isJourney = value;
    }
    get isJourney() {
        if (this._isJourney !== undefined) return this._isJourney;
        if (!this.type) return undefined;
        return this.type == 'journey';
    }

    get isValid() {
        if (!this.name || this.name == '') return false;
        if (!this.resourcetype) return false;
        return true;
    }

}