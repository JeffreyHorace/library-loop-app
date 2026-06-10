import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { isAddress, zeroAddress } from "viem";

export const erc8021DataSuffix =
  (process.env.NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX || "0x") as `0x${string}`;

export const contractAddress = (
  isAddress(process.env.NEXT_PUBLIC_LIBRARY_LOOP_CONTRACT_ADDRESS || "")
    ? process.env.NEXT_PUBLIC_LIBRARY_LOOP_CONTRACT_ADDRESS
    : zeroAddress
) as `0x${string}`;

export const hasContractAddress = contractAddress !== zeroAddress;

export const config = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: "Library Loop",
      preference: { options: "all" },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});
