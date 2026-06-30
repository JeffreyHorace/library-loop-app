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
