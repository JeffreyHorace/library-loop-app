# LibraryLoopApp

LibraryLoopApp is the repository for **Library Loop**, a Base mini app designed for a modern library circulation desk.

The app keeps the experience intentionally simple.

It provides three onchain write actions:

- **Shelve Book** calls `shelveBook()`
- **Stamp Card** calls `stampCard()`
- **Quiet Bell** calls `quietBell()`

There is no points system, invite flow, or app fee.

Users only pay Base gas for transactions.

## Repository

GitHub: https://github.com/JeffreyHorace/library-loop-app.git

## Overview

Library Loop presents a friendly interface around a small smart contract.

The frontend lets users perform the three supported library-themed actions.

It also reads personal and global counts from the contract.

The app is built as a web application using the Next.js App Router.

## Features

- Base mini app experience
- Three focused onchain write actions
- Read support for user-specific activity counts
- Read support for global activity totals
- Friendly transaction status messages
- TypeScript codebase
- Tailwind CSS styling
- Wagmi and Viem integration

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Wagmi
- Viem

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local app in your browser, typically at:

```text
http://localhost:3000
```

If port `3000` is already in use, start the app on another port:

```bash
npm run dev -- --port 3002
```

Then open:

```text
http://localhost:3002
```

## Required Deployment Values

Before deploying to production, create the following environment variables:

```bash
NEXT_PUBLIC_LIBRARY_LOOP_CONTRACT_ADDRESS=0xfea7baf8ca18ab4768b36d8d4c851e56f8f688f1
NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX=0x62635f35746a6f776567390b0080218021802180218021802180218021
```

These values are used by the frontend when interacting with the deployed contract.

## Base App Verification

The Base offchain attribution tag is intentionally defined in:

```text
src/app/layout.tsx
```

Look for the `base:app_id` meta tag.

Replace the placeholder value with the verification value from base.dev before final deployment.

## Contract

The Solidity source is located at:

```text
contracts/LibraryLoop.sol
```

The frontend ABI is located at:

```text
src/lib/abi.ts
```

The frontend ABI matches the contract used by the app.

## Contract Reads

The app reads the following values:

- `userShelves(address)`
- `userCards(address)`
- `userBells(address)`
