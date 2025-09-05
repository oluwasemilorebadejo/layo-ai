"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        // Headers styling
        "[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h1:first-child]:mt-0",
        "[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-3 [&>h2:first-child]:mt-0",
        "[&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2",
        "[&>h4]:text-base [&>h4]:font-semibold [&>h4]:mt-3 [&>h4]:mb-2",
        // Lists styling
        "[&>ul]:my-3 [&>ul>li]:mb-1 [&>ul]:list-disc [&>ul]:pl-6",
        "[&>ol]:my-3 [&>ol>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-6",
        "[&_li>ul]:mt-2 [&_li>ol]:mt-2",
        // Paragraphs and spacing
        "[&>p]:my-3 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
        // Strong and emphasis
        "[&>strong]:font-bold [&_strong]:font-bold",
        "[&>em]:italic [&_em]:italic",
        // Code styling
        "[&>code]:px-1 [&>code]:py-0.5 [&>code]:bg-gray-100 [&>code]:rounded [&>code]:text-sm",
        "[&_code]:px-1 [&_code]:py-0.5 [&_code]:bg-gray-100 [&_code]:rounded [&_code]:text-sm",
        "[&>pre]:bg-gray-50 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-4",
        // Tables
        "[&>table]:w-full [&>table]:border-collapse [&>table]:my-4",
        "[&_th]:border [&_th]:border-gray-300 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-gray-50 [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2",
        // Blockquotes
        "[&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:my-4 [&>blockquote]:italic",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
