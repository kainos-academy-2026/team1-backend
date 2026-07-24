export default interface ApplicationResponse {
	applicationId: number;
	userId: number;
	userEmail: string;
	status: string;
	dateApplied: Date;
	cvPresignedUrl: string;
}
