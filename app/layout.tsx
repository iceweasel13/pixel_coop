import "./globals.css";
import type { Metadata } from "next";
import {  Press_Start_2P } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import Providers from "../components/Provider";
import { getServerSession, Session } from "next-auth";
import { authConfig } from "../auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";



const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Pixel Coop ",
  description: "A game",
};

export default async function RootLayout(props: { children: ReactNode }) {
   const session = (await getServerSession(authConfig)) as Session;
   const cookie = (await headers()).get("cookie") as string;
  return (
    <html lang="en">
      <body className={` ${pressStart2P.className}`}>
        <Providers session={session} cookie={cookie}>
         
           <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger /> {props.children}
        </main>
    </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
