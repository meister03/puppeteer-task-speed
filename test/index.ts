import puppeteer from 'puppeteer';
import { LogType, Queue, QueueItem } from '../dist/Queue';
const browser = await puppeteer.launch();
const page = await browser.newPage();

const manager = new Queue({
  log: log,
  auto: true,
  // Time to wait between each task
  timeout: 1,
});
manager.queue.push({
  run: function () { return page.goto('https://example.com'); },
  args: [],
  timeout: 1,
  label: 'Go to website'
});
manager.queue.push({
  run: async function () {
    const html = await page.content();
    logHTML(html)
    return html;
  },
  args: [],
  timeout: 1,
  label: 'Get HTML'
});
await manager.start();
await browser.close();
function logHTML(a) {
  console.log(a)
}

function log(type: LogType, item: QueueItem, time: { diff: number, start: number, end: number }) {
  if (type === 0) console.log(`[TASK DONE] ${item.label} ${time.diff.toFixed()}ms`)
  else if (type === 1) console.log(`[ALL TASKS DONE] ${time.diff.toFixed()}ms`)
}