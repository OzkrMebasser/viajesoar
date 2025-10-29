
import React from 'react'
import { useTranslations } from "next-intl";
type Locale = "es" | "en";

export const Blog = () => {
  const t = useTranslations("Blog");
  return (
    <div>{t("latestPosts")}</div>
  )
}

const BlogPage = () => {
    
  return (
    <div><Blog /></div>
  )
}

export default BlogPage