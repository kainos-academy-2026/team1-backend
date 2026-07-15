import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const UPLOAD_URL_EXPIRY_SECONDS = 300;

export interface PresignedUpload {
	uploadUrl: string;
	key: string;
}

export class S3Service {
	private readonly client: S3Client;
	private readonly bucketName: string;

	constructor() {
		const region = process.env.AWS_REGION;
		const bucketName = process.env.S3_BUCKET_NAME;

		if (!region) {
			throw new Error('AWS_REGION is not set');
		}
		if (!bucketName) {
			throw new Error('S3_BUCKET_NAME is not set');
		}

		this.bucketName = bucketName;
		this.client = new S3Client({ region });
	}

	async getPresignedUploadUrl(
		userId: number,
		jobRoleId: number,
		fileName: string,
		contentType: string,
	): Promise<PresignedUpload> {
		const key = `job-applications/${jobRoleId}/${userId}/${Date.now()}-${fileName}`;

		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			ContentType: contentType,
		});

		const uploadUrl = await getSignedUrl(this.client, command, {
			expiresIn: UPLOAD_URL_EXPIRY_SECONDS,
		});

		return { uploadUrl, key };
	}
}
