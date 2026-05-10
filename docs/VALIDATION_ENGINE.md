# Validation Engine

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md) | → [SCENARIOS.md](./SCENARIOS.md)

---

## Purpose

The validation engine is what makes Praxis a simulator rather than a tutorial. It's the system that determines whether a user has genuinely completed a checkpoint — not by reading their code, but by testing observable behavior.

**Core principle:** Validate outputs, not implementations.

A user should be able to implement JWT auth however they want. The validator checks: does `/login` return a valid token? Does a protected route reject unauthorized requests? The *how* is their business.

---

## Architecture

```
User Action (e.g., "Run validator")
         │
         ▼
   Server Action: runCheckpointValidator(scenarioId, checkpointId, context)
         │
         ▼
   ValidationRouter
   ├── type: "http_response"  → HttpValidator
   ├── type: "file_exists"    → FileValidator
   ├── type: "test_pass"      → TestValidator
   ├── type: "code_contains"  → CodePatternValidator
   └── type: "custom"         → ScenarioSpecificValidator
         │
         ▼
   ValidationResult { passed: boolean, message: string, details?: object }
         │
         ▼
   Update scenario_progress.checkpoints_passed
   Award XP if all checkpoints complete
```

---

## Checkpoint Types

### `http_response`

Makes an HTTP request to the user's running service and validates the response.

**Config:**
```json
{
  "type": "http_response",
  "config": {
    "endpoint": "/login",
    "method": "POST",
    "body": { "email": "test@test.com", "password": "password123" },
    "expect_status": 200,
    "expect_fields": ["accessToken", "refreshToken"],
    "expect_field_types": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

**Use cases:** API endpoint validation, auth token presence, response shape

**Limitation (MVP):** Requires user's service to be running and accessible. For Phase 1, this means either a provided test environment or a user-run local server.

---

### `http_rejects`

Validates that a request is properly rejected.

**Config:**
```json
{
  "type": "http_rejects",
  "config": {
    "endpoint": "/me",
    "method": "GET",
    "headers": {},
    "expect_status": 401
  }
}
```

**Use cases:** Auth middleware validation, rate limiting verification

---

### `file_exists`

Checks that a file exists at a given path in the user's working directory.

**Config:**
```json
{
  "type": "file_exists",
  "config": {
    "path": "middleware/auth.js",
    "not_empty": true
  }
}
```

**Use cases:** Verify user created required files, didn't delete critical files

---

### `test_pass`

Runs a test command and checks the exit code.

**Config:**
```json
{
  "type": "test_pass",
  "config": {
    "command": "npm test",
    "working_dir": ".",
    "timeout_seconds": 30,
    "expect_exit_code": 0
  }
}
```

**Use cases:** Verify test suite passes, CI-style validation

**Limitation:** Requires a sandboxed execution environment — not safe to run arbitrary commands in Phase 1 without isolation.

---

### `code_contains`

Checks if a specific file contains a required pattern.

**Config:**
```json
{
  "type": "code_contains",
  "config": {
    "file": "middleware/auth.js",
    "patterns": ["jwt.verify", "Bearer"],
    "require_all": true
  }
}
```

**Use cases:** Verify specific library usage, detect empty implementations

**Note:** This is a weak validator — clever users can game it. Use only as a fallback, not as the primary validation.

---

## `validation_rules` Schema (in `scenarios` table)

```json
{
  "checkpoints": [
    {
      "id": "cp-1",
      "description": "/login returns access token and refresh token",
      "validators": [
        {
          "type": "http_response",
          "config": {
            "endpoint": "/login",
            "method": "POST",
            "body": { "email": "test@example.com", "password": "Test1234!" },
            "expect_status": 200,
            "expect_fields": ["accessToken", "refreshToken"]
          }
        }
      ],
      "require_all_validators": true,
      "xp_partial": 50
    },
    {
      "id": "cp-2",
      "description": "Protected route rejects requests without token (401)",
      "validators": [
        {
          "type": "http_rejects",
          "config": {
            "endpoint": "/me",
            "method": "GET",
            "expect_status": 401
          }
        }
      ],
      "require_all_validators": true,
      "xp_partial": 50
    }
  ],
  "total_xp": 250
}
```

---

## Implementation Plan (Phase 1 MVP)

### Step 1 — Static Validators Only

Start with validators that don't require a running environment:
- `file_exists` — safe, no execution
- `code_contains` — safe, no execution

**Goal:** Get checkpoint completion working end-to-end. XP tracking, debrief trigger, progress update.

### Step 2 — HTTP Validators

User runs their service locally. Praxis calls it via a user-provided URL (e.g., `http://localhost:3001`).

**Goal:** Real behavioral validation for API scenarios.

**Challenge:** CORS, network access from server. Solution: run validators from the client (the user's browser makes the request, sends result to server) — but this means the user can fake results.

**Better solution:** User submits a public URL (e.g., a Railway/Render deploy) and the server validates against it.

### Step 3 — Sandboxed Execution (Phase 2+)

For `test_pass` and arbitrary command validation, we need a sandboxed environment. Options:
- **Docker container** — Spin up per validation run; expensive but isolated
- **WebAssembly sandbox** — Fast, cheap, limited to supported languages
- **E2B.dev** — Managed code execution sandbox (evaluate this)

---

## Security Considerations

- Never execute user-provided code on the main server
- `test_pass` and `command` validators must run in isolated containers
- Rate limit validation requests per user to prevent abuse
- Validate that `endpoint` URLs in HTTP validators are not internal network addresses (SSRF prevention)
- Sanitize all file path inputs in `file_exists` validators

---

## Open Questions

- [ ] Phase 1 approach: static validators only, or include HTTP with user-provided URL?
- [ ] How do we handle the case where a user's service isn't running when they trigger validation?
- [ ] Should we build our own sandbox or use a managed service like E2B?
- [ ] Can validation run in the browser (client-side) for simplicity? What are the integrity tradeoffs?
- [ ] How do we make validators per-scenario configurable without requiring a code deploy? (JSON config in DB is the answer — but needs admin tooling)
