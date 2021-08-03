export type TextNode = Node & { nodeValue: string };

export const isTextNode = (el: Node): el is TextNode =>
  el.nodeType === Node.TEXT_NODE;

export const isElementNode = (el: Node): el is HTMLElement =>
  el.nodeType === Node.ELEMENT_NODE;
