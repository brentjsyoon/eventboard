import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import "./Button.css"

type ButtonProps = {
    children: ReactNode;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    className,
    ...props
}) => {

    const classes = clsx("btn", `btn-${variant}`, `btn-${size}`, className);

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;