# HTML pagination

![Test workflow](https://github.com/dm1sh/html-pagination/actions/workflows/test.yaml/badge.svg)

It is a plugin for HTML document pagination to fit fixed-sized container. This operation is rather time-consuming, so, please, use this module carefully.

## How-to

In a browser environment import `HTMLPagination` class and create it's instance:

```js
import { HTMLPagination } from 'html-pagination';

const pg = new HTMLPagination(
  document.getElementById('content'), // HTML element with html content you want to paginate in it
  document.getElementById('container'), // HTML element which will display page content. It must add scrollbar on overflow
  100 // Initial number of characters per page. Good value will increase speed of first page computation
);
```

It will compute text and html elements positions for future use, so you have to run it after you added html content to element with `content` id.

Below you can see a common HTML+CSS implementation for `#content` and `#container` elements

HTML:

```html
<div id="content">
  <!-- HTML content -->
</div>
<div class="appContainer">
  <div id="container"></div>
</div>
```

CSS:

```css
#content {
  display: none;
}
.appContainer {
  height: 300px;
  width: 300px;
  display: flex;
}
#container {
  overflow: auto;
}
```

To display a page you must run HTMLPagination's method `getPage` with page number as argument (numeration starts from 1)

```js
const str = pg.getPage(5); // Displays page number 5 or last one if pages is not enough
```

There is no way to accurately display number of pages untill they all are computed. But you can still get estimated pages number based on `initialJump`. It is adjusted dynamically while pages computing, so, it will change over time.

```js
console.log(pg.pagesNumber);
```

You can also get current number of computed pages with the following property

```js
console.log(pg.computedPagesNumber);
```
