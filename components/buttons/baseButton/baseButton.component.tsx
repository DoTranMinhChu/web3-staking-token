import React from "react";
import { IBaseButtonProps } from "./baseButton.type";

export const BaseButtonComponent: React.FC<IBaseButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br dark:focus:ring-blue-800 text-center"
      {...props}
    >
      {children}
    </button>
  );
};
