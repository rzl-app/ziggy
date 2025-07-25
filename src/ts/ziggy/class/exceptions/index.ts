export const prefixError = "Rzl-Ziggy";

/** ---------------------------------
 * * ***Custom Error for Invalid Router Config***
 * ---------------------------------
 */
export class RouterConfigError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
    prefix?: string
  ) {
    const trimmedPrefix = prefix?.trim() || prefixError;
    const trimmedMessage = message.trim();

    super(`${trimmedPrefix} - ${trimmedMessage}`);
    this.name = "RouterConfigError";

    // Preserve stack trace in non-production environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoutePropsError);
    }
  }
}

/** ---------------------------------
 * * ***Custom Error for Invalid Route Property***
 * ---------------------------------
 */
export class RoutePropsError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
    prefix?: string
  ) {
    const trimmedPrefix = prefix?.trim() || prefixError;
    const trimmedMessage = message.trim();

    super(`${trimmedPrefix} - ${trimmedMessage}`);
    this.name = "RoutePropsError";

    // Preserve stack trace in non-production environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoutePropsError);
    }
  }
}
