import App from './App.svelte';

const urlParams = new URLSearchParams(window.location.search);
const script = document.currentScript;
const dataPage = script.getAttribute('data-page');

const app = new App({
  target: document.body,
  props: {
    embed: urlParams.get('embed'),
    page: dataPage
  }
});

export default app;
