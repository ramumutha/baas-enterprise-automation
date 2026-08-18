# Architecture Assessment

## Assessment Purpose

This document records the architectural assessment and progressive modernization of the Enterprise Quality Engineering Platform.

The platform is being designed as a reusable, domain-agnostic Quality Engineering capability rather than as an application-specific Playwright test project.

## Verified Starting Baseline

The initial Banking reference implementation was validated before architectural restructuring.

Verified execution baseline:

- TypeScript compilation: PASS
- Smoke tests: 6/6 PASS
- API tests: 4/4 PASS
- UI tests: 4/4 PASS
- Full CI suite: 16/16 PASS

## Primary Architectural Gap

The original repository mixed reusable Quality Engineering infrastructure with Banking/ParaBank-specific implementation.

Examples included:

- Banking Page Objects under the generic pages folder
- Banking API clients under the generic API folder
- Banking test data under the generic test-data folder
- ParaBank-specific application assumptions within otherwise reusable framework structures

This reduced portability to other application domains.

## EQA.1 Assessment

EQA.1 introduces the first explicit boundary between:

### Enterprise QE Core

Reusable capabilities that should remain independent of a specific business domain.

Current example:

- `src/core/ui/BasePage.ts`

### Domain Reference Implementations

Application/domain-specific automation assets.

The first reference implementation is Banking:

- `src/domains/banking/pages/`
- `src/domains/banking/api/`
- `src/domains/banking/testdata/`

## Architectural Principle

The framework core must remain reusable across different domains.

Potential future reference implementations include:

- Generic Web
- Healthcare
- Insurance
- Automotive
- Retail / E-commerce
- SaaS
- Client-specific enterprise applications

These reference implementations should reuse the same Enterprise QE Core instead of creating separate automation frameworks.

## Technology Principle

Playwright is the current automation technology implementation.

The platform should avoid unnecessary coupling between business workflows and a specific automation technology while also avoiding premature abstraction.

Alternative technologies such as Selenium should be introduced only when a genuine client or architectural requirement exists.

## EQA.1 Result

EQA.1 is a structural refactoring only.

No intentional business, functional, API, execution, reporting or CI/CD behavior was changed.

Post-refactoring validation confirmed:

- TypeScript compilation: PASS
- Smoke tests: 6/6 PASS
- API tests: 4/4 PASS
- UI tests: 4/4 PASS
- Full CI suite: 16/16 PASS

## Next Architectural Slice

EQA.2 — Configuration Architecture

The next objective is to separate reusable platform configuration from application, domain and environment-specific configuration.

## EQA.2 Assessment

EQA.2 removed hidden application coupling from the reusable configuration layer.

Key improvements:

- configuration moved into the Enterprise QE Core
- typed RuntimeConfig retained only actively used fields
- ParaBank fallback URLs removed from core logic
- invalid environments fail fast
- required BASE_URL and API_BASE_URL values are validated
- DB_HOST removed because no database automation capability currently consumes it
- ENV_NAME removed because environment identity is already represented by the selected environment
- API clients receive configuration through dependency injection rather than reading process.env directly

Validated results:

- TypeScript compilation: PASS
- invalid-environment validation: PASS
- Smoke: 6/6 PASS
- API: 4/4 PASS
- UI: 4/4 PASS
- Full CI: 16/16 PASS