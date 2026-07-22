# Copilot Instructions for BDD Tests

Apply these instructions when generating or reviewing files matching `tests/bdd/**`.

## Framework

- Use **Cucumber.js** (`@cucumber/cucumber`) with TypeScript step definitions.
- Feature files live in `tests/bdd/features/`, step definitions in `tests/bdd/steps/`, shared setup in `tests/bdd/support/`.
- Run BDD tests with `npm run test:bdd`. The server must be running at `API_BASE_URL` (default `http://localhost:3001`). Run all framework checks with `npm run test:framework`.
- Cucumber is configured entirely inline in the `test:bdd` npm script — there is no separate `cucumber.cjs` config file.

## Writing Scenarios

- Each scenario must be **independent**: it must not rely on state created by another scenario.
- Use `Background` only for steps that apply to **every** scenario in that feature file.
- Use `Given` to establish pre-conditions, `When` for the action under test, `Then` for assertions. Never mix concerns across step types.
- Keep scenario names descriptive and outcome-focused (e.g. `User cannot log in with incorrect password`).
- Prefer **concrete examples** over abstract language. Avoid vague steps like "When something happens".

## Test Independence

- Each scenario that requires an authenticated user must create its own user and log in — do not share tokens across scenarios.
- Use unique, time-stamped test data (e.g. `bdd_test_${Date.now()}@example.com`) to prevent conflicts between runs.
- Setup steps (e.g. `Given a user already exists`) must be idempotent: accept both a 201 (created) and 409 (already exists) as valid outcomes.
- Never hard-code IDs that depend on database state from a previous run.

## Flaky Test Prevention

> **Flag to reviewer:** If a scenario can pass or fail depending on execution order, timing, or shared data, raise a comment or PR review note highlighting it as a potential flaky test.

- Avoid `sleep` or fixed delays. If you must wait, poll with a timeout and a clear failure message.
- If a test relies on a specific record existing in the database (e.g. job role ID 1), assert its existence in a `Given` step rather than assuming it.
- Steps that create test data should clean up after themselves when possible, or use isolated identifiers so re-runs do not fail due to leftover data.
- If retry logic (`--retry 3` in the `test:bdd` script) masks a consistently-failing test, investigate and fix the root cause rather than relying on retries.

## Step Definitions

- Step definitions must be typed with `this: CustomWorld` so shared state is safe and explicit.
- Use `node:assert/strict` for assertions — clear failure messages are mandatory.
- Reuse existing step definitions across features before writing new ones.
- Each step file should import only what it needs; avoid wildcard imports.

## General

- Do not add Cucumber step definitions to Vitest test files, and vice versa.
- Feature files are plain Gherkin — no TypeScript, no imports.
- Keep step definitions focused: one step = one responsibility.
