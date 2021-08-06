/**
 * @jest-environment jsdom
 */

import { CacheInterface, HTMLPagination } from "../index";

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

describe("Text position stuff", () => {
  beforeEach(() => {
    content.innerHTML = "";
    content.innerHTML = "<div><p>aa</p><p>bb<span>cc</span>dd</p></div>";

    container.innerHTML = "";

    hp = new HTMLPagination(content, container, new Cache(), 100);
  });

  it("computes positions for each text node", () => {
    expect(hp.elementPositions.map((el) => el[0])).toEqual([0, 2, 4, 6]);
  });

  it("gets element by position", () => {
    expect(hp.getElementForPosition(0)[0]).toBe(0);
    expect(hp.getElementForPosition(1)[0]).toBe(0);
    expect(hp.getElementForPosition(2)[0]).toBe(2);
    expect(hp.getElementForPosition(3)[0]).toBe(2);
  });

  it("gets html content for range of text", () => {
    expect(hp.getContentFromRange(0, 8)).toEqual(
      "<p>aa</p><p>bb<span>cc</span>dd</p>"
    );
    expect(hp.getContentFromRange(0, 3)).toEqual("<p>aa</p><p>b</p>");
    expect(hp.getContentFromRange(5, 7)).toEqual("<span>c</span>d");
  });
});

// TODO: Add pagination tests using puppeteer

// let browser: puppeteer.Browser, page: puppeteer.Page;

// describe("Page splitting stuff", () => {
//   beforeAll(async () => {
//     browser = await puppeteer.launch({
//       defaultViewport: {
//         height: 150,
//         width: 150,
//       },
//     });
//     page = await browser.newPage();
//   });

//   it("Inserts page break to prevent scroll", async () => {
//     await page.goto("localhost:5000");
//   });
// });
