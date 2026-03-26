const KNOWN_WIKI_LABELS = new Set([
  "Assembly",
  "Gate",
  "Heavy Refinery",
  "Heavy Storage",
  "Manufacturing",
  "Network Node",
  "Storage Unit",
  "Turret",
]);

export function getAssemblyWikiUrl(typeLabel: string) {
  if (!KNOWN_WIKI_LABELS.has(typeLabel)) {
    return null;
  }

  return `https://evefrontier.wiki/${typeLabel.replaceAll(" ", "_")}`;
}
