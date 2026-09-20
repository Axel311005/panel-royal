import { CS_StatsProvider } from "@/components/CS_StatsProvider";
import { CS_ShopifyShell } from "@/components/shopify/CS_ShopifyShell";

export default function CS_PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CS_StatsProvider>
      <CS_ShopifyShell>{children}</CS_ShopifyShell>
    </CS_StatsProvider>
  );
}
