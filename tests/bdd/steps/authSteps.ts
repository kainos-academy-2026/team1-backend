import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import type { CustomWorld } from '../support/world.js';

// Generates a unique email per scenario run to avoid duplicate conflicts
function uniqueEmail(): string {
	return `bdd_test_${Date.now()}@example.com`;
}

Given(
	'a user already exists with email {string} and password {string}',
	async function (this: CustomWorld, email: string, password: string) {
		await this.makeRequest('POST', '/auth/signup', { email, password });
		// 201 = created, 409 = already exists — both are valid pre-conditions
		assert.ok(
			[201, 409].includes(this.response.status),
			`Expected signup to return 201 or 409 but got ${this.response.status}`,
		);
	},
);

When(
	'I sign up with a unique email and password {string}',
	async function (this: CustomWorld, password: string) {
		await this.makeRequest('POST', '/auth/signup', {
			email: uniqueEmail(),
			password,
		});
	},
);

When(
	'I sign up with email {string} and password {string}',
	async function (this: CustomWorld, email: string, password: string) {
		await this.makeRequest('POST', '/auth/signup', { email, password });
	},
);

When(
	'I log in with email {string} and password {string}',
	async function (this: CustomWorld, email: string, password: string) {
		await this.makeRequest('POST', '/auth/login', { email, password });
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
	'the response body should contain a {string}',
	function (this: CustomWorld, key: string) {
		const body = this.response.body as Record<string, unknown>;
		assert.ok(
			key in body,
			`Expected response body to contain key "${key}", got: ${JSON.stringify(body)}`,
		);
	},
);
