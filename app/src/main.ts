import App from './App.svelte';
import text from './text.json';

const content = text.article;
const meta = text.meta;
const footer = text.footer;

const app = new App({
  target: document.body,
  props: {
    content: content,
    meta: meta,
    footer: footer
  }
});

export default app;
