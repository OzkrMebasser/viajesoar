// import type { Destination, DestinationSummary } from "@/types/destinations";

// type DestinationRow = {
//   id: string;
//   name: string;
//   slug: string;
//   locale: string;
//   image: string;
//   country: string;
//   price: number;
//   rating: number;
//   is_active: boolean;
//   highlight_1?: string | null;
//   highlight_2?: string | null;
//   highlight_3?: string | null;
// };

// // export function mapDestination(row: DestinationRow): Destination {
// //   return {
// //     ...row,
// //     highlights: [
// //       row.highlight_1,
// //       row.highlight_2,
// //       row.highlight_3,
// //     ].filter((h): h is string => Boolean(h)),
// //   };
// // }

// export function mapDestination(row: DestinationRow): DestinationSummary {
//   return {
//     id: row.id,
//     locale: row.locale,
//     name: row.name,
//     slug: row.slug,
//     image: row.image,
//     country: row.country,
//     price: row.price,
//     rating: row.rating,
//     highlights: [row.highlight_1, row.highlight_2, row.highlight_3].filter(
//       (h): h is string => Boolean(h),
//     ),
//     is_active: row.is_active,
//   };
// }
