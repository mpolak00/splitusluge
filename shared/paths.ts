export const ALL_BUSINESSES_PATH = "/svi-obrti";
export const LEGACY_ALL_BUSINESSES_PATH = "/svi-obrci";

export function slugifySegment(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "profil"
  );
}

export function getBusinessPath(input: { id: number | string; name?: string | null }): string {
  return `/poslovanje/${input.id}/${slugifySegment(input.name || "profil")}`;
}
