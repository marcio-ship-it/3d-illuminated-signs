import type { Metadata } from "next";
import EmbedShell from "./EmbedShell";

export const metadata: Metadata = {
  title: "Cut-Out Letters Configurator",
  robots: { index: false },
};

export default function EmbedPage() {
  return <EmbedShell />;
}
