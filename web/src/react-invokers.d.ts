// Invoker commands (commandfor/command) aren't in React's types yet. React passes lowercase
// attributes through to the HTML as written.
import "react";

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    commandfor?: string | undefined;
    command?: "show-modal" | "close" | "request-close" | undefined;
  }
}
