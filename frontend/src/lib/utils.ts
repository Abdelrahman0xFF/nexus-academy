import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaUrl(fileId: string | undefined) {
  if (!fileId) return "";
  // If it's already a full URL or a relative path that doesn't look like a fileId, return as is
  if (fileId.startsWith("http") || fileId.startsWith("/") || fileId.includes(".")) {
    return fileId;
  }
  return `http://localhost:4000/api/media/${fileId}`;
}
