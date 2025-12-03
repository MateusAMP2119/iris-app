/**
 * Date & text helpers for the News Aggregator App
 */

import { Author } from '../models';

/**
 * Get the full name of the first author from an authors array
 * @param authors - Array of Author objects
 * @returns Full name of the first author, or null if no authors
 */
export function getAuthorName(authors: Author[] | undefined | null): string | null {
  if (authors && authors.length > 0) {
    return `${authors[0].firstName} ${authors[0].lastName}`;
  }
  return null;
}

/**
 * Get a human-readable relative time string from a date
 * @param dateString - ISO date string
 * @returns Human-readable relative time (e.g., "2h ago", "3d ago")
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 7) {
    return `${Math.floor(diffDays / 7)}w ago`;
  } else if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Format a date for display
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}
