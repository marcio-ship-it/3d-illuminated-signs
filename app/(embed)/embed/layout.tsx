export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  // Embed pages have no Nav or Footer — they render inside partner iframes
  return <>{children}</>;
}
