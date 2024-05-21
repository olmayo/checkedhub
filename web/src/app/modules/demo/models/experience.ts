import { PointOfInterest } from "./point-of-interest";

export class Experience {

    id?: number;
    name?: string;
    type?: string;
    place?: PointOfInterest;

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

}