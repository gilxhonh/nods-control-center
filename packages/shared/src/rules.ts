/** Default share of baseline a run must reach before a low-count ticket is raised. */
export const DEFAULT_COVERAGE_THRESHOLD = 0.9

/** Captured records as a share of baseline (0..n). Returns 0 when there is no baseline. */
export function coverage(captured: number, baseline: number): number {
  return baseline > 0 ? captured / baseline : 0
}

export function isBelowThreshold(captured: number, baseline: number, threshold = DEFAULT_COVERAGE_THRESHOLD): boolean {
  return coverage(captured, baseline) < threshold
}

/**
 * Projected finish: now + remaining share of the run times the domain's average run duration.
 * progress is 0..1, averageDurationMs comes from run history.
 */
export function projectedFinish(now: Date, progress: number, averageDurationMs: number): Date {
  const remaining = Math.max(0, 1 - progress)
  return new Date(now.getTime() + remaining * averageDurationMs)
}

/** Positive when the run is projected to finish before the deadline. */
export function deliveryBufferMs(deadline: Date, projected: Date): number {
  return deadline.getTime() - projected.getTime()
}
