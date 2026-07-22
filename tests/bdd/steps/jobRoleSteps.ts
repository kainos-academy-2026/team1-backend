import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import type { CustomWorld } from '../support/world.js';

Given('I am authenticated as a user', async function (this: CustomWorld) {
	const email = `bdd_auth_${Date.now()}@example.com`;
	const password = 'Password1!';

	await this.makeRequest('POST', '/auth/signup', { email, password });
	assert.ok(
		[201, 409].includes(this.response.status),
		`Setup: signup returned unexpected status ${this.response.status}`,
	);

	await this.makeRequest('POST', '/auth/login', { email, password });
	assert.equal(
		this.response.status,
		200,
		`Setup: login failed with status ${this.response.status}`,
	);

	const body = this.response.body as Record<string, unknown>;
	assert.ok(
		typeof body.token === 'string',
		'Setup: no token in login response',
	);
	this.authToken = body.token;
});

When(
	'I send a GET request to {string}',
	async function (this: CustomWorld, path: string) {
		await this.makeRequest('GET', path);
	},
);

Then(
	'the response status should be {int}',
	function (this: CustomWorld, expected: number) {
		assert.equal(
			this.response.status,
			expected,
			`Expected status ${expected}, got ${this.response.status}. Body: ${JSON.stringify(this.response.body)}`,
		);
	},
);

Then(
	'the response body should be a paginated list',
	function (this: CustomWorld) {
		const body = this.response.body as Record<string, unknown>;
		assert.ok(
			'data' in body || Array.isArray(body),
			`Expected a paginated list or array, got: ${JSON.stringify(body)}`,
		);
	},
);

