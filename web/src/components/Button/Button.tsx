import type { ComponentPropsWithoutRef, ReactNode } from "react";
import "./Button.css";

type Common = {
  variant?: "primary" | "pink";
  size?: "small";
  children: ReactNode;
};

type LinkProps = Common &
  Omit<ComponentPropsWithoutRef<"a">, keyof Common> & { href: string };

type ButtonProps = Common &
  Omit<ComponentPropsWithoutRef<"button">, keyof Common> & { href?: never };

export type Props = LinkProps | ButtonProps;

/** A link that looks like a button when given `href`, a real `<button>` otherwise. */
export function Button({ variant = "primary", size, ...props }: Props) {
  const data = { "data-variant": variant, "data-size": size };

  if (props.href !== undefined) {
    return <a className="button" {...data} {...(props as LinkProps)} />;
  }
  return (
    <button
      type="button"
      className="button"
      {...data}
      {...(props as ButtonProps)}
    />
  );
}
