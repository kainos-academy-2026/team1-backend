export default interface JobRoleDetailedResponse {
	id: number;
	roleName: string;
	location: string;
	capabilityId: number;
	capabilityName: string;
	bandId: number;
	bandName: string;
	closingDate: Date;
	status: string;
	specification: string;
	description: string;
	responsibilities: string;
	numberOfOpenPositions: number;
}
