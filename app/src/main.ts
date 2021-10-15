import App from './App.svelte';
import sotc from './stateoftheclimate.json';
import wh from './whatshappening.json';
import cap from './climateactionprogress.json';

const urlParams = new URLSearchParams(window.location.search);

const script = document.currentScript;
const dataPage = script.getAttribute('data-page');

const gdocs = { sotc, wh, cap };

if (!gdocs[dataPage]) throw new Error(`Page doesn't exist`);

const app = new App({
  target: document.body,
  props: {
    embed: urlParams.get('embed'),
    gdocs: gdocs[dataPage]
  }
});

export default app;
