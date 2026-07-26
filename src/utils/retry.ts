export async function retry<T>(operation: () => Promise<T>, options: { attempts?: number; delayMs?: number; condition?: (result: T) => boolean; onRetry?: (attempt: number, error?: unknown) => void }): Promise<T> {
  const attempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 1000;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const result = await operation();
      if (!options.condition || options.condition(result)) {
        return result;
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) {
      options.onRetry?.(attempt, lastError);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Operation failed after retries');
}
