import {
  Home,
  ShoppingCart,
  Users,
  Coins,
  Megaphone,
  
} from "lucide-react";
import Image from "next/image";
import BalanceDisplay from "./balanceDisplay";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Menü öğeleri
const menuItems = [
  {
    title: "Farm", // "Home" olarak güncellendi
    url: "/",
    icon: Home,
  },
  {
    title: "Shop", // "Shop" olarak güncellendi
    url: "/shop",
    icon: ShoppingCart,
  },
  {
    title: "Referrals", // "Referrals" olarak güncellendi
    url: "/referrals",
    icon: Users,
  },
  {
    title: "$EGG Token", // "$EGG" olarak güncellendi
    url: "/token-info", // Örnek bir iç sayfa linki
    icon: Coins,
  },
  {
    title: "Announcements", // "Announcements" olarak güncellendi
    url: "/announcements",
    icon: Megaphone,
  },
];



export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Padding ve dikey yerleşim için ana sarmalayıcı */}
        <div className="flex h-full flex-col justify-between p-4">
          {/* Üst Kısım: Logo */}
          <div className="flex-shrink-0">
            {/* Not: Lütfen public klasörüne 'logo.png' dosyanızı ekleyin */}
            <Image
              src="/logo.png"
              alt="Pixel Coop Logo"
              width={120}
              height={40}
              className="mx-auto" // Logoyu yatayda ortalamak için
            />
          </div>

          {/* Orta Kısım: Menü Öğeleri */}
          {/* justify-between sayesinde bu kısım ortada kalacak */}
          <div className="flex-grow">
            <SidebarMenu className="mt-8 flex flex-col gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>

          {/* Alt Kısım: Bakiye ve Cüzdan Butonu */}
          <div className="flex flex-col gap-4">
            <SidebarSeparator />
            <BalanceDisplay />
            <div className="[&>button]:w-full">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}