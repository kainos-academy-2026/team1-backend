export class JobRole {
    constructor (
        public readonly id: number,
        public readonly name: string,
        public readonly location: string,
        public readonly capability: string,
        public readonly band: string,
        public readonly closingDate: string,
        public readonly status: string
    ) {
    
        if (id <= 0) {
            throw new Error("ID must be greater than 0");
        }
        if (!name) {
            throw new Error("Name is required");
        }
        if (!location) {
            throw new Error("Location is required");
        }
        if (!capability) {
            throw new Error("Capability is required");
        }
        if (!closingDate) {
            throw new Error("Closing date is required");
        }
        if (!band) {
            throw new Error("Band is required");
        }
        if (!status) {
            throw new Error("Status is required");
        }
    }
}
