import "./globals.css";
import { Inter } from "next/font/google";
import { WagmiProvider } from "@/utils/wagmi";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sismo Connect",
  description: "A simple ERC20 gated airdrop example using Sismo Connect",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider>{children}</WagmiProvider>
      </body>
    </html>
  );
}
