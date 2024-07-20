import { ReactNode } from "react";

export type BasePropsType<T> = {} & React.DetailedHTMLProps<
  React.HTMLAttributes<T>,
  T
>;
