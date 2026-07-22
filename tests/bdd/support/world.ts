import { setWorldConstructor, World } from '@cucumber/cucumber';
import { resolveApiBaseUrl } from '../../config/environment.js';

const BASE_URL = process.env.API_BASE_URL ?? resolveApiBaseUrl();

export interface ApiResponse {
	status: number;
	body: unknown;
}

/**
 * CustomWorld provides shared state and helpers for each Cucumber scenario.
 * A fresh instance is created per scenario, ensuring test isolation.
 */
export class CustomWorld extends World {
	baseUrl = BASE_URL;
	response: ApiResponse = { status: 0, body: null };
	authToken: string | null = null;

	async makeRequest(
		method: string,
		path: string,
		body?: unknown,
	): Promise<void> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		if (this.authToken) {
			headers.Authorization = `Bearer ${this.authToken}`;
		}

		const res = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers,
			body: body !== undefined ? JSON.stringify(body) : undefined,
		});

		const contentType = res.headers.get('content-type') ?? '';
		const responseBody = contentType.includes('application/json')
			? await res.json()
			: await res.text();

		this.response = { status: res.status, body: responseBody };
	}
}

setWorldConstructor(CustomWorld);
