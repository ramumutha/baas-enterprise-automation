# Current Architecture

## Architecture Baseline

The platform is evolving from a banking-specific Playwright automation framework into a domain-agnostic Enterprise Quality Engineering platform.

## Reusable Core

Current reusable core components include:

- `src/core/ui/BasePage.ts`
- environment configuration
- shared utilities
- execution and reporting foundations

## Banking Reference Implementation

Banking-specific implementation is isolated under:

`src/domains/banking/`

Current Banking reference components include:

- API clients
- Page Objects
- banking test data

## Current Technology

- TypeScript
- Node.js
- Playwright
- Playwright API testing
- Allure reporting
- GitHub Actions

Playwright is the current automation technology implementation. The platform architecture should avoid unnecessary coupling of business workflows to a specific automation engine.

## EQA.1 Boundary

EQA.1 establishes the first explicit architectural separation between reusable Quality Engineering capabilities and domain-specific implementation.

No business or test behavior was intentionally changed during this refactoring.

## Verified EQA.1 Validation

- TypeScript compilation: PASS
- Smoke: 6/6 PASS
- API: 4/4 PASS
- UI: 4/4 PASS
- Full CI suite: 16/16 PASS

## Current Reference Domain

Banking / ParaBank is the first reference implementation.

Future domains may include Healthcare, Insurance, Automotive, Retail, SaaS and Generic Web applications. These domains will be added only when required to prove or deliver actual platform capabilities rather than as empty placeholder structures.