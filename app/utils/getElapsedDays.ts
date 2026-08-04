export function getElapsedDays(createdAt: string): number {
  const createdAtDate = createdAt ? new Date(createdAt) : new Date();
  return Math.floor(
    (new Date().getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}
