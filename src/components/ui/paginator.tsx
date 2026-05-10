"use client";

import PaginatorButtonArrow from "@/components/ui/PaginatorButtonArrow";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export function Paginator({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginatorButtonArrow
            title="Prev"
            href={page > 1 ? `?page=${page - 1}` : undefined}
            direction="prev"
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive>
            {page} <span className="text-[var(--accent)] mx-1">/</span> {totalPages}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginatorButtonArrow
            title="Next"
            href={page < totalPages ? `?page=${page + 1}` : undefined}
            direction="next"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}