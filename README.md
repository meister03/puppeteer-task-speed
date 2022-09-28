<p align="center"><a href="https://nodei.co/npm/puppeteer-task-speed/"><img src="https://nodei.co/npm/puppeteer-task-speed.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/puppeteer-task-speed"> <img src="https://img.shields.io/npm/dm/puppeteer-task-speed?label=downloads"> <img src="https://img.shields.io/npm/l/puppeteer-task-speed"> <img src="https://img.shields.io/github/repo-size/meister03/puppeteer-task-speed">

# Puppeteer-task-speed

Util Package to measure the speed for each puppeteer execution.

## API Reference
### QueueOptions
| Property      | Description                         |
| ------------- | ------------------------------------- |
| auto | `boolean`: Whether the spawn queue should be managed automatically |
| timeout | `number`: Time to wait until executing next task |
| log | `log(type: LogType, item: QueueItem, time: {start: number, end: number, diff: number})`: Custom Function for the logger |
### Queue
| Property      | Description                         |
| ------------- | ------------------------------------- |
| start()       | Starts the task execution |
| next()        | When QueueOption.auto is on false, executes the next item |
| stop()        | Stops the Queue properly |
| resume()      | Resumes the queue from the position it got stopped |
| add(QueueItem)| Adds the Item as task, which will be executed |
| queue         | `QueueItem[]` Items to execute |

### QueueItem
| Property      | Description                         |
| ------------- | ------------------------------------- |
| run(...args: any): Promise<any>; | The function to execute |
| args: any[]; | The arguments to pass to the function |
| time?: number | The timestamp the task was pushed |
| timeout: number; | The time to wait until executing the next task |
| label: string; | The Description of the task |

## Example
```ts 
import puppeteer from 'puppeteer';
import { LogType, Queue, QueueItem } from 'puppeteer-task-speed';
const browser = await puppeteer.launch();
const page = await browser.newPage();

const manager = new Queue({
  log: log,
  auto: true,
  // Time to wait between each task
  timeout: 1,
});
manager.add({
  run: function () { 
    return page.goto('https://example.com'); 
  },
  args: [],
  timeout: 1,
  label: 'Go to website'
});
manager.add({
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
  if (type === LogType.taskExec) console.log(`[TASK DONE] ${item.label} ${time.diff.toFixed()}ms`)
  else if (type === LogType.QueueEmpty) console.log(`[ALL TASKS DONE] ${time.diff.toFixed()}ms`)
}
```
# Bugs, glitches and issues

If you encounter any problems feel free to open an issue in our <a href="https://github.com/meister03/discord-hybrid-sharding/issues">GitHub repository 
