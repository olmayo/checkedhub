export class Experience {

    id?: number;
    name?: string;

    constructor(experience?: any) {
        Object.assign(this, experience);
    }
    
}