# Library Loop

Library Loop is a Base mini app for a modern library circulation desk. It has exactly three onchain write actions:

- Shelve Book -> `shelveBook()`
- Stamp Card -> `stampCard()`
- Quiet Bell -> `quietBell()`

There is no token, no points system, no invite flow, and no app fee. Users only pay Base gas.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Wagmi
- Viem

## Local Setup

```bash
npm install
npm run dev
```

If port 3000 is already in use:

```bash
npm run dev -- --port 3002
```

## Required Deployment Values

Create these environment variables before production deployment:

```bash
NEXT_PUBLIC_LIBRARY_LOOP_CONTRACT_ADDRESS=0xfea7baf8ca18ab4768b36d8d4c851e56f8f688f1
NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX=0x62635f35746a6f776567390b0080218021802180218021802180218021
```

The Base offchain attribution tag is intentionally hardcoded in `src/app/layout.tsx`:

```tsx
<meta name="base:app_id" content="REPLACE_WITH_BASE_DEV_VERIFY_TOKEN" />
```

Replace the placeholder with the base.dev verification token before final deployment.

## Contract

The Solidity source is in `contracts/LibraryLoop.sol`. The frontend ABI in `src/lib/abi.ts` matches this contract and reads:

- `userShelves(address)`
- `userCards(address)`
- `userBells(address)`
- `totalShelves()`
- `totalCards()`
- `totalBells()`

Every write call explicitly passes the `bc_5tjoweg9` encoded `dataSuffix` from `NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX`.

## Safety Notes

The UI only shows friendly English transaction states such as `Pending`, `Confirmed`, `Failed`, and `Request rejected`. Raw wallet errors, RPC details, environment values, calldata, and attribution strings are not rendered in the page.
