import type { ComponentPropsWithoutRef, ReactNode } from "react";
import "./Button.css";

type Common = {
  /** `hero` is for the one main call to action per page; never next to another button. */
  variant?: "primary" | "secondary" | "hero";
  size?: "small";
  children: ReactNode;
};

type LinkProps = Common &
  Omit<ComponentPropsWithoutRef<"a">, keyof Common> & { href: string };

type ButtonProps = Common &
  Omit<ComponentPropsWithoutRef<"button">, keyof Common> & { href?: never };

export type Props = LinkProps | ButtonProps;

/** A link that looks like a button when given `href`, a real `<button>` otherwise. */
export function Button({
  variant = "primary",
  size,
  children,
  ...props
}: Props) {
  const data = { "data-variant": variant, "data-size": size };
  // The outer element stays put and draws the shadow; only the face moves.
  const face = <span className="button__face">{children}</span>;

  if (props.href !== undefined) {
    return (
      <a
        className="button"
        {...data}
        {...(props as Omit<LinkProps, keyof Common>)}
      >
        {face}
      </a>
    );
  }
  return (
    <button
      type="button"
      className="button"
      {...data}
      {...(props as Omit<ButtonProps, keyof Common>)}
    >
      {face}
    </button>
  );
}
