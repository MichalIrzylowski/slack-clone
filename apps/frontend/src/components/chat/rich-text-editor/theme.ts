import type { LexKitTheme } from "@lexkit/editor";

export const theme: LexKitTheme = {
  heading: {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-bold",
    h3: "text-xl font-bold",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "font-mono bg-muted px-1 py-0.5 rounded",
  },
  link: "text-blue-600 underline hover:text-blue-800",
  container: "border border-gray-200 rounded-lg overflow-hidden",
};
