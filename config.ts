"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage, http } from "wagmi";
import { monadTestnet, polygon } from "viem/chains";
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: projectId,
  chains: [monadTestnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [monadTestnet.id]: http(), // Add transport for monadTestnet
    [polygon.id]: http(),
  },
});
