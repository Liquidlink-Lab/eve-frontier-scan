"use client";

import type { PropsWithChildren } from "react";
import Link from "next/link";
import { Button, type ButtonProps } from "@mui/material";

type LinkButtonProps = PropsWithChildren<
  Omit<ButtonProps<typeof Link>, "component" | "href"> & {
    href: string;
  }
>;

export default function LinkButton({
  children,
  href,
  ...buttonProps
}: LinkButtonProps) {
  return (
    <Button component={Link} href={href} {...buttonProps}>
      {children}
    </Button>
  );
}
