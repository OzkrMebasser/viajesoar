"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
          <PaginationPrevious
            href={page > 1 ? `?page=${page - 1}` : undefined}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive>
            {page} / {totalPages}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href={page < totalPages ? `?page=${page + 1}` : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
