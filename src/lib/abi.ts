export const libraryLoopAbi = [
  {
    type: "function",
    name: "userShelves",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "userCards",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "userBells",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalShelves",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalCards",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalBells",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "shelveBook",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "stampCard",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "quietBell",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "event",
    name: "BookShelved",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "userShelves", type: "uint256", indexed: false },
      { name: "totalShelves", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CardStamped",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "userCards", type: "uint256", indexed: false },
      { name: "totalCards", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BellQuieted",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "userBells", type: "uint256", indexed: false },
      { name: "totalBells", type: "uint256", indexed: false },
    ],
  },
] as const;

