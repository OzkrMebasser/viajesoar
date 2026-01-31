import type { Activity } from "@/types/activities";

type ActivityRow = {
  id: string;
  name: string;
  slug: string;
  locale: string;
  description?: string | null;
  highlight_1?: string | null;
  highlight_2?: string | null;
  highlight_3?: string | null;
};

export function mapActivity(row: ActivityRow): Activity {
  return {
    ...row,
    highlights: [
      row.highlight_1,
      row.highlight_2,
      row.highlight_3,
    ].filter(Boolean),
  };
}
