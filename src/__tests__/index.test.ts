/**
 * @jest-environment jsdom
 */

import { CacheInterface, HTMLPagination } from "../index";

describe("HTMLPagination", () => {
  let hp: HTMLPagination;

  const content = document.createElement("div");
  const container = document.createElement("div");
  class Cache extends CacheInterface {
    g(key: string) {
      return localStorage.getItem(key);
    }
    s(key: string, value: string) {
      localStorage.setItem(key, value);
    }
  }

  beforeEach(() => {
    content.innerHTML = "";
    content.innerHTML = "<div><p>aa</p><p>bb<span>cc</span>dd</p></div>";

    container.innerHTML = "";

    hp = new HTMLPagination(content, container, new Cache());
  });

  test("Computes positions for each text node", () => {
    expect(hp.elementPositions.map((el) => el[0])).toEqual([0, 2, 4, 6]);
  });

  test("Gets element by position", () => {
    expect(hp.getElementForPosition(0)[0]).toBe(0);
    expect(hp.getElementForPosition(1)[0]).toBe(0);
    expect(hp.getElementForPosition(2)[0]).toBe(2);
    expect(hp.getElementForPosition(3)[0]).toBe(2);
  });

  test("Gets html content for range of text", () => {
    expect(hp.getFromRange(0, 8)).toEqual(
      "<p>aa</p><p>bb<span>cc</span>dd</p>"
    );
    expect(hp.getFromRange(0, 3)).toEqual("<p>aa</p><p>b</p>");
    expect(hp.getFromRange(5, 7)).toEqual("<span>c</span>d");
  });
});
