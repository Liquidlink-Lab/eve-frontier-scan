"use client";

import type { PropsWithChildren } from "react";
import Link from "next/link";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";

type LinkTextProps = PropsWithChildren<
  Omit<MuiLinkProps<typeof Link>, "component" | "href"> & {
    href: string;
  }
>;

export default function LinkText({
  children,
  href,
  ...linkProps
}: LinkTextProps) {
  return (
    <MuiLink component={Link} href={href} {...linkProps}>
      {children}
    </MuiLink>
  );
}
