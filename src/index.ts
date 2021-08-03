import { CacheInterface } from "./cache";
import { isElementNode, isTextNode, TextNode } from "./types";

class HTMLPagination {
  content: HTMLElement;
  container: HTMLElement;
  cache: CacheInterface;

  elementPositions: [number, TextNode][];
  idPositions: Map<string, number>;

  /**
   * @param content HTML element with html content to display paginationly
   * @param container HTML element which will store content to display
   * @param cache Class implementing `g` and `s` methods for getting and setting elements of KV storage
   */
  constructor(
    content: HTMLElement,
    container: HTMLElement,
    cache: CacheInterface
  ) {
    this.content = content;
    this.container = container;
    this.cache = cache;

    this.elementPositions = new Array();
    this.idPositions = new Map();

    this.computeElementsPositions();
  }

  getPage(n: number): string {
    const from = 0;
    const to = 1;

    return this.getFromRange(from, to);
  }

  /**
   * Computes html elements and text nodes positions. Must be run only on first setup
   */
  computeElementsPositions(): void {
    const recursive = (currentPosition: number, root: Node): number => {
      if (isTextNode(root)) {
        this.elementPositions.push([currentPosition, root]);

        return currentPosition + root.nodeValue.length;
      } else if (isElementNode(root)) {
        if (root.id !== null) this.idPositions.set(root.id, currentPosition);

        return Array.from(root.childNodes).reduce(recursive, currentPosition);
      } else {
        return currentPosition;
      }
    };

    recursive(0, this.content);
  }

  /**
   * Finds node inside which `pos` is located. Returns node positions and itself
   */
  getElementForPosition(pos: number): [number, Node] {
    let s = 0,
      e = this.elementPositions.length - 1;

    while (s <= e) {
      const c = (s + e) >> 1;
      if (pos > this.elementPositions[c][0]) s = c + 1;
      else if (pos < this.elementPositions[c][0]) e = c - 1;
      else return this.elementPositions[c];
    }

    return this.elementPositions[s - 1];
  }

  /**
   * Sets `container` element content and return as string html content between `from` and `to`
   */
  getFromRange(from: number, to: number): string {
    this.container.innerHTML = "";
    const range = new Range();

    const [startPosition, startElement] = this.getElementForPosition(from);
    const startOffset = from - startPosition;
    range.setStart(startElement, startOffset);

    const [endPosition, endElement] = this.getElementForPosition(to);
    const endOffset = to - endPosition;
    range.setEnd(endElement, endOffset);

    // TODO: copy range with all its parent elements

    this.container.appendChild(range.cloneContents());

    return this.container.innerHTML;
  }
}

export { CacheInterface, HTMLPagination };
