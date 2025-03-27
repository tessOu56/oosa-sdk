/**
 * 將 headers 的值轉為 string，避免 TypeScript 報錯
 */
export function normalizeHeaders(
    headers: Record<string, string | number | undefined> = {}
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    )
  }
  
  /**
   * 將 URL params 轉為 string，支援 URLSearchParams
   */
  export function normalizeParams(
    params: Record<string, string | number | undefined> = {}
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    )
  }