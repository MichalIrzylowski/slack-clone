// Seed / placeholder data for the Slack-like layout.
// Replace with real data sources (API, context, etc.) later.
export const channels = [
  { id: "gen", name: "general" },
  { id: "rnd", name: "r-and-d" },
  { id: "eng", name: "engineering" },
  { id: "mkt", name: "marketing" },
  { id: "ops", name: "ops" },
];

export const dms = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Carlos" },
];

export type Channel = (typeof channels)[number];
export type DirectMessage = (typeof dms)[number];
