"use client";

import ReactSelect, { StylesConfig } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  name,
}: CustomSelectProps) {
  const styles: StylesConfig<Option> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: value
        ? "transparent"
        : "transparent",
      border: `1px solid ${
        state.isFocused ? "var(--accent)" : "var(--border)"
      }`,
      borderRadius: "4px",
      boxShadow: "none",
      minHeight: "unset",
      padding: "0",
      cursor: "pointer",
      transition: "border-color 150ms",
      "&:hover": {
        borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "7px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--text)",
      fontSize: "0.875rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "color-mix(in srgb, var(--text) 25%, transparent)",
      fontSize: "0.875rem",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--bg)",
      border: "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
      borderRadius: "4px",
      zIndex: 50,
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--accent)"
        : state.isFocused
          ? "color-mix(in srgb, var(--accent) 10%, transparent)"
          : "transparent",
      color: state.isSelected ? "var(--bg)" : "var(--text)",
      fontSize: "0.875rem",
      borderRadius: "2px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "color-mix(in srgb, var(--text) 40%, transparent)",
      padding: "0 4px",
      "&:hover": {
        color: "var(--accent)",
      },
    }),
    input: (base) => ({
      ...base,
      color: "var(--text)",
      fontSize: "0.875rem",
    }),
  };

  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <ReactSelect
      name={name}
      options={options}
      value={selected}
      onChange={(opt) => onChange((opt as Option)?.value ?? "")}
      placeholder={placeholder}
      isDisabled={disabled}
      styles={styles}
      isSearchable
    />
  );
}
