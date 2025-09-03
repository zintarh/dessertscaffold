/**
 * Simple utility to check if a mentor profile has been updated
 */

/**
 * Check if a mentor profile was recently updated
 * @param updatedAt - The updatedAt timestamp from the mentor profile
 * @param recentThresholdDays - Number of days to consider as "recent" (default: 7)
 * @returns boolean indicating if profile was recently updated
 */
export function isProfileRecentlyUpdated(
  updatedAt: string | null | undefined,
  recentThresholdDays: number = 7
): boolean {
  if (!updatedAt) return false;
  
  const updatedDate = new Date(updatedAt);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceUpdate <= recentThresholdDays;
}
