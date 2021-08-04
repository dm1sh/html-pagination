import { CacheInterface } from "./cache";
import { isElementNode, isTextNode, TextNode } from "./types";
import { binSearch } from "./utils";

class HTMLPagination {
  content: HTMLElement;
  container: HTMLElement;
  cache: CacheInterface;

  elementPositions: [number, Node][];
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

    return this.getContentFromRange(from, to);
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
   * Finds position for next page break
   * initialJump may be computed in a clever way
   */
  getPageBreak(start: number, initialJump: number) {
    let previousEnd = this.getMaxPosition();
    let end = this.getNextSpaceForPosition(start + initialJump);

    this.getContentFromRange(start, end);
    while (!this.scrollNecessary() && end < this.getMaxPosition()) {
      previousEnd = end;
      end = this.getNextSpaceForPosition(end + 1);
      this.getContentFromRange(start, end);
    }

    while (this.scrollNecessary() && end > start) {
      previousEnd = end;
      end = this.getPreviousSpaceForPosition(end - 1);
      this.getContentFromRange(start, end);
    }

    if (start === end) return previousEnd;
    else return end;
  }

  /**
   * Gets next space or gap between elements for position
   */
  getNextSpaceForPosition(startPos: number): number {
    const nodeIndex = this.getElementIndexForPosition(startPos);
    const [nodePosition, node] = this.elementPositions[nodeIndex];

    let nodeOffset = startPos - nodePosition;
    const str = node.nodeValue || "";
    while (nodeOffset < str.length && str.charAt(nodeOffset) !== " ")
      nodeOffset++;

    if (nodeOffset === str.length) {
      if (nodeIndex === this.elementPositions.length - 1)
        return this.getMaxPosition();
      else return this.elementPositions[nodeIndex + 1][0];
    } else {
      return this.elementPositions[nodeIndex][0] + nodeOffset;
    }
  }

  /**
   * Gets previous space or gap between elements for position
   */
  getPreviousSpaceForPosition(startPos: number): number {
    const nodeIndex = this.getElementIndexForPosition(startPos);
    const [nodePosition, node] = this.elementPositions[nodeIndex];

    let nodeOffset = startPos - nodePosition;
    const str = node.nodeValue || "";
    while (nodeOffset > 0 && str.charAt(nodeOffset) !== " ") nodeOffset--;

    return this.elementPositions[nodeIndex][0] + nodeOffset;
  }

  /**
   * Checks if container is overflowing with content
   */
  scrollNecessary(): boolean {
    return this.container.clientHeight < this.container.scrollHeight;
  }

  /**
   * Returns end position of content
   */
  getMaxPosition(): number {
    const [offset, element] =
      this.elementPositions[this.elementPositions.length - 1];
    return offset + (element.nodeValue?.length || 0);
  }

  /**
   * Wrapper for `binSearch` util to find index of element for position
   */
  getElementIndexForPosition(pos: number): number {
    return binSearch(
      this.elementPositions,
      pos,
      (i) => this.elementPositions[i][0]
    );
  }

  /**
   * Finds node inside which `pos` is located. Returns node positions and itself
   */
  getElementForPosition(pos: number): [number, Node] {
    const elementIndex = this.getElementIndexForPosition(pos);

    return this.elementPositions[elementIndex];
  }

  /**
   * Sets `container` element content and return as string html content between `from` and `to`
   */
  getContentFromRange(from: number, to: number): string {
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
