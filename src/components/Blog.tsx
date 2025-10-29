"use client"

import React from 'react'
import { useTranslations } from "next-intl";
type Locale = "es" | "en";

export default function Blog() {
  const t = useTranslations("Blog");
  return (
    <div>{t("latestPosts")}</div>
  )
}