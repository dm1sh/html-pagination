export abstract class CacheInterface {
  abstract g(key: string): string;
  abstract s(key: string, value: string): void;
}

/**
 * Function to get page with specific number
 * @param n Page number
 */
declare function getPage(n: number): string;

/**
 * Function to prepare unific data and compose page content getting function
 * @param content HTML element with html content to display paginationly
 * @param container HTML element which will store content to display
 * @param cache Class implementing `g` and `s` methods for getting and setting elements of KV storage
 */
export function setup(
  content: HTMLElement,
  container: HTMLElement,
  cache: CacheInterface
): typeof getPage;
