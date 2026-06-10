"use client";

import {
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Library,
  Stamp,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { libraryLoopAbi } from "@/lib/abi";
import {
  contractAddress,
  erc8021DataSuffix,
  hasContractAddress,
} from "@/lib/wagmi";

type ActionKey = "shelveBook" | "stampCard" | "quietBell";
type ActivityState = "Idle" | "Pending" | "Confirmed" | "Failed" | "Request rejected";

const actions: Array<{
  key: ActionKey;
  label: string;
  description: string;
  icon: typeof BookOpen;
  accent: string;
}> = [
  {
    key: "shelveBook",
    label: "Shelve Book",
    description: "Record one book returned to the stack.",
    icon: BookOpen,
    accent: "bg-[#124f3e]",
  },
  {
    key: "stampCard",
    label: "Stamp Card",
    description: "Mark a fresh checkout-card moment.",
    icon: Stamp,
    accent: "bg-[#8a2332]",
  },
  {
    key: "quietBell",
    label: "Quiet Bell",
    description: "Log one calm desk bell tap.",
    icon: Bell,
    accent: "bg-[#0052ff]",
  },
];

const stats = [
  { label: "Shelves", mineIndex: 0, totalIndex: 3 },
  { label: "Cards", mineIndex: 1, totalIndex: 4 },
  { label: "Bells", mineIndex: 2, totalIndex: 5 },
];

function shortAddress(address?: `0x${string}`) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function friendlyError(error: unknown): ActivityState {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("reject") || message.includes("denied")) {
    return "Request rejected";
  }
  return "Failed";
}

function formatCount(value: unknown) {
  if (typeof value === "bigint") return value.toLocaleString("en-US");
  return "0";
}

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const [walletOpen, setWalletOpen] = useState(false);
  const [activity, setActivity] = useState<{
    action: string;
    state: ActivityState;
    hash?: `0x${string}`;
  }>({ action: "Reading desk ready", state: "Idle" });

  const contracts = useMemo(
    () =>
      [
        "userShelves",
        "userCards",
        "userBells",
        "totalShelves",
        "totalCards",
        "totalBells",
      ].map((functionName, index) => ({
        address: contractAddress,
        abi: libraryLoopAbi,
        functionName,
        args: index < 3 ? [address ?? "0x0000000000000000000000000000000000000000"] : [],
      })),
    [address],
  );

  const reads = useReadContracts({
    contracts,
    query: {
      enabled: hasContractAddress,
      refetchInterval: 10_000,
    },
  });

  const receipt = useWaitForTransactionReceipt({
    hash: activity.hash,
    query: {
      enabled: Boolean(activity.hash),
    },
  });

  useEffect(() => {
    if (receipt.isSuccess && activity.state === "Pending") {
      reads.refetch();
    }
  }, [activity.state, reads, receipt.isSuccess]);

  const visibleActivityState: ActivityState =
    activity.state === "Pending" && receipt.isSuccess
      ? "Confirmed"
      : activity.state === "Pending" && receipt.isError
        ? "Failed"
        : activity.state;
  const isTransactionPending = visibleActivityState === "Pending";

  const handleAction = async (action: (typeof actions)[number]) => {
    if (!isConnected) {
      setWalletOpen(true);
      setActivity({ action: action.label, state: "Request rejected" });
      return;
    }
    if (!hasContractAddress) {
      setActivity({ action: action.label, state: "Failed" });
      return;
    }

    try {
      setActivity({ action: action.label, state: "Pending" });
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: libraryLoopAbi,
        functionName: action.key,
        dataSuffix: erc8021DataSuffix,
      });
      setActivity({ action: action.label, state: "Pending", hash });
    } catch (error) {
      console.error(error);
      setActivity({ action: action.label, state: friendlyError(error) });
    }
  };

  const values = reads.data?.map((item) => item.result) ?? [];
  const statusTone =
    visibleActivityState === "Confirmed"
      ? "text-[#124f3e]"
      : visibleActivityState === "Pending"
        ? "text-[#0052ff]"
        : visibleActivityState === "Failed" ||
            visibleActivityState === "Request rejected"
          ? "text-[#8a2332]"
          : "text-[#385046]";

  return (
    <main className="min-h-screen bg-[#f4efdf] text-[#14231d]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d3c7ac] pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-md bg-[#124f3e] text-[#f8f1df] shadow-sm">
              <Library size={23} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a2332]">
                Circulation Desk
              </p>
              <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                Library Loop
              </h1>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setWalletOpen((open) => !open)}
              className="flex min-h-11 items-center gap-2 rounded-md border border-[#b9aa8e] bg-[#fffaf0] px-3 text-sm font-semibold text-[#14231d] shadow-sm transition hover:border-[#0052ff]"
              aria-expanded={walletOpen}
            >
              <span
                className={`size-2 rounded-full ${
                  isConnected ? "bg-[#0052ff]" : "bg-[#b9aa8e]"
                }`}
                aria-hidden="true"
              />
              <Wallet size={17} aria-hidden="true" />
              <span>{isConnected ? shortAddress(address) : "Connect Wallet"}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>

            {walletOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-72 rounded-md border border-[#b9aa8e] bg-[#fffaf0] p-2 shadow-xl">
                <div className="mb-2 flex items-center justify-between border-b border-[#ded2b9] px-2 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#385046]">
                  <span>Wallet Options</span>
                  <button type="button" onClick={() => setWalletOpen(false)}>
                    <X size={16} aria-label="Close wallet options" />
                  </button>
                </div>
                {connectors.map((connector) => (
                  <button
                    type="button"
                    key={connector.uid}
                    disabled={isConnecting}
                    onClick={() => {
                      connect({ connector });
                      setWalletOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-semibold hover:bg-[#efe3c9] disabled:opacity-60"
                  >
                    <span>{connector.name}</span>
                    <span className="text-xs text-[#0052ff]">Connect</span>
                  </button>
                ))}
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setWalletOpen(false);
                    }}
                    className="mt-1 w-full rounded-md border border-[#d7c7ab] px-3 py-3 text-left text-sm font-semibold text-[#8a2332] hover:bg-[#f3e8d0]"
                  >
                    Disconnect
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>

        <section className="grid flex-1 gap-5 py-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-md border border-[#b9aa8e] bg-[#fff8e8] shadow-sm">
            <div className="grid min-h-[440px] grid-rows-[auto_1fr_auto]">
              <div className="flex h-24 border-b border-[#d4c4a3]">
                {["#124f3e", "#8a2332", "#0052ff", "#5f4b32", "#d4a017", "#2d6b5f"].map(
                  (color, index) => (
                    <div
                      key={color}
                      className="flex flex-1 items-end justify-center border-r border-black/10 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
                      style={{ backgroundColor: color }}
                    >
                      {index % 2 === 0 ? "LOOP" : "BASE"}
                    </div>
                  ),
                )}
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.1fr] sm:p-6">
                <div className="rounded-md border border-[#d1bf9f] bg-[#fdf6e7] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8a2332]">
                      Checkout Card
                    </p>
                    <span className="rounded-sm bg-[#0052ff] px-2 py-1 text-xs font-bold text-white">
                      BASE
                    </span>
                  </div>
                  <div className="space-y-3">
                    {["Desk Open", "No Token", "Gas Only", "Three Writes"].map(
                      (line) => (
                        <div
                          key={line}
                          className="flex items-center justify-between border-b border-dashed border-[#cbb998] pb-2"
                        >
                          <span className="text-sm text-[#385046]">{line}</span>
                          <Check size={16} className="text-[#124f3e]" aria-hidden="true" />
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#385046]">
                      Onchain Library Desk
                    </p>
                    <h2 className="mt-2 max-w-lg text-4xl font-semibold tracking-normal text-[#14231d] sm:text-5xl">
                      Three quiet actions, counted on Base.
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          type="button"
                          key={action.key}
                          onClick={() => handleAction(action)}
                          disabled={isTransactionPending}
                          className="group grid min-h-20 grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-md border border-[#b9aa8e] bg-[#fffaf0] p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0052ff] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <span
                            className={`grid size-12 place-items-center rounded-md ${action.accent} text-white`}
                          >
                            <Icon size={22} aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block font-semibold">{action.label}</span>
                            <span className="block text-sm text-[#51665e]">
                              {action.description}
                            </span>
                          </span>
                          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#0052ff]">
                            Write
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 border-t border-[#d4c4a3] bg-[#e9dec5] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#385046]">
                {["Fiction", "Returns", "Catalog", "Reference"].map((label) => (
                  <div key={label} className="border-r border-[#c7b58f] px-3 py-3">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-md border border-[#b9aa8e] bg-[#fffaf0] p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Reading Counts</h2>
                <span className="rounded-sm border border-[#b9aa8e] px-2 py-1 text-xs font-semibold text-[#385046]">
                  {chain?.name ?? "Base"}
                </span>
              </div>
              <div className="grid gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="grid grid-cols-2 gap-3 rounded-md border border-[#d9c9aa] bg-[#fbf1dc] p-3"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#51665e]">
                        My {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {formatCount(values[stat.mineIndex])}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#51665e]">
                        Total {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {formatCount(values[stat.totalIndex])}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-[#b9aa8e] bg-[#fffaf0] p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Desk Status</h2>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-[#dfd1b7] pb-2">
                  <span className="text-[#51665e]">Wallet Status</span>
                  <span className="font-semibold">
                    {isConnected ? shortAddress(address) : "Not connected"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#dfd1b7] pb-2">
                  <span className="text-[#51665e]">Contract</span>
                  <span className="font-semibold">
                    {hasContractAddress ? "Ready" : "Setup needed"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#51665e]">Last Transaction</span>
                  <span className={`font-semibold ${statusTone}`}>
                    {visibleActivityState}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-[#b9aa8e] bg-[#fffaf0] p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Clock3 size={18} className="text-[#8a2332]" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <div className="mt-3 rounded-md border border-dashed border-[#c8b58f] bg-[#fbf1dc] p-3">
                <p className="text-sm font-semibold">{activity.action}</p>
                <p className={`mt-1 text-sm ${statusTone}`}>{visibleActivityState}</p>
                <p className="mt-3 text-xs leading-5 text-[#51665e]">
                  Detailed wallet or network messages stay out of the page. Check your
                  wallet for transaction specifics.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
