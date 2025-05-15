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

export const getUserInitials = (name: string) => {
  const nameParts = name.trim().split(/\s+/);
  const firstInitial = nameParts[0] ? nameParts[0][0].toUpperCase() : "";
  const lastInitial = nameParts[nameParts.length - 1]
    ? nameParts[nameParts.length - 1][0].toUpperCase()
    : "";
  return nameParts.length > 1 ? `${firstInitial}${lastInitial}` : firstInitial;
};
