import * as React from "react"
import { cn } from "@/lib/utils"
import ButtonArrow from "@/components/ui/ButtonArrow"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-4", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "flex items-center justify-center px-4 py-2 text-xs uppercase tracking-widest border rounded-sm transition-all duration-200",
        isActive
          ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
          : "border-white/10 text-white/40 bg-white/5 backdrop-blur-md",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ href, className }: { href?: string; className?: string }) {
  if (!href) {
    return (
      <span className={cn("opacity-30 pointer-events-none cursor-not-allowed", className)}>
        <ButtonArrow title="Prev" href="#" />
      </span>
    )
  }
  return <ButtonArrow title="Prev" href={href} className={className} />
}

function PaginationNext({ href, className }: { href?: string; className?: string }) {
  if (!href) {
    return (
      <span className={cn("opacity-30 pointer-events-none cursor-not-allowed", className)}>
        <ButtonArrow title="Next" href="#" />
      </span>
    )
  }
  return <ButtonArrow title="Next" href={href} className={className} />
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
}