export interface ValidationErrorResponse {
  statusCode: number;
  message: string[] | string;
  error: string;
}

export function formatValidationIssue(
  response: unknown,
): Record<string, string>[] | ValidationErrorResponse | undefined {
  if (
    typeof response === 'object' &&
    response !== null &&
    'message' in response
  ) {
    const r = response as ValidationErrorResponse;

    if (Array.isArray(r.message)) {
      return r.message.map((msg) => {
        // Clean up the message format
        // Convert "products.0.Quantity for product..." to cleaner format
        const cleanedMsg = msg.replace(
          /^products\.(\d+)\.(.+)$/,
          'Product #$1: $2',
        );
        return { error: cleanedMsg };
      });
    }

    return r;
  }

  return undefined;
}
