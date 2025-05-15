import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getValidDomains = () => {
  const domains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "hotmail.com",
    "icloud.com",
  ];

  if (process.env.NODE_ENV === "development") {
    domains.push("example.com");
  }

  return domains;
};

export const normalizeName = (name: string) => {
  return name
    .trim()
    .replace(/\s+g/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
