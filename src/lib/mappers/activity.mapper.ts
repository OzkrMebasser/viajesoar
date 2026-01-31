import type { Destination } from "@/types/destinations";

type DestinationRow = {
  id: string;
  name: string;
  slug: string;
  locale: string;
  is_active: boolean;
  highlight_1?: string | null;
  highlight_2?: string | null;
  highlight_3?: string | null;
};

export function mapDestination(row: DestinationRow): Destination {
  return {
    ...row,
    highlights: [
      row.highlight_1,
      row.highlight_2,
      row.highlight_3,
    ].filter(Boolean),
  };
}
