"use client";

import React from "react";

/**
 * Shared overrides for BaseUI Select so the control matches the core form field:
 * white background, light grey border, hover state.
 */
export const SELECT_FORM_FIELD_OVERRIDES = {
  ControlContainer: {
    props: {
      className: "form-field-select-control",
    },
    style: {
      backgroundColor: "#ffffff",
      borderLeftWidth: "1px",
      borderRightWidth: "1px",
      borderTopWidth: "1px",
      borderBottomWidth: "1px",
      borderLeftStyle: "solid",
      borderRightStyle: "solid",
      borderTopStyle: "solid",
      borderBottomStyle: "solid",
      borderLeftColor: "#d0d7de",
      borderRightColor: "#d0d7de",
      borderTopColor: "#d0d7de",
      borderBottomColor: "#d0d7de",
      borderRadius: "6px",
      transitionProperty: "border-color",
      transitionDuration: "0.15s",
      transitionTimingFunction: "ease",
    },
  },
} as const;

export interface FormFieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function FormFieldInput({ className = "", style, ...props }: FormFieldInputProps) {
  return (
    <input
      className={`form-field ${className}`.trim()}
      style={{ padding: "8px 12px", fontSize: 14, ...style }}
      {...props}
    />
  );
}

export interface FormFieldSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function FormFieldSelect({ className = "", style, ...props }: FormFieldSelectProps) {
  return (
    <select
      className={`form-field ${className}`.trim()}
      style={{ padding: "4px 8px", fontSize: 12, ...style }}
      {...props}
    />
  );
}

export interface FormFieldTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function FormFieldTextarea({ className = "", style, ...props }: FormFieldTextareaProps) {
  return (
    <textarea
      className={`form-field ${className}`.trim()}
      style={{ padding: 6, fontSize: 12, ...style }}
      {...props}
    />
  );
}
