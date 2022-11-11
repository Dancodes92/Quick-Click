import { app, BrowserWindow, ipcMain } from 'electron';
// import puppeteer-core from 'puppeteer-core'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer-core')
import { getChromePath } from './util'
import { avinodeSearch } from './puppeteer'
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  ipcMain.on('search-avinode', () => {
    // call puppeteer function
    console.log('search-avinode')
    const executablePath = getChromePath()
    // launch puppeteer
    puppeteer.launch({
      executablePath,
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    }).then(async (browser: { newPage: () => any; close: () => any; }) => {
      const page = await browser.newPage()

      await page.goto("https://marketplace.avinode.com/sso/mvc/login");
      // wait for user to login
      await page.type("#username", 'pschneider@luxury.aero'); //use environment variable for this
      await page.type("#password", 'Luxury1!'); //use environment variable for this
      await page.click(
        "body > div.avi-page > div > div > div > div > form > div.avi-button-group.avi-is-section-group > div > button"
      );
      await page.waitForTimeout(1000);
      // await page.waitForNavigation({ timeout: 120000 });
      await page.goto(
     "https://marketplace.avinode.com/marketplace/mvc/search#preSearch"
   );

   await page.waitForNavigation({ timeout: 120000 });

        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        // when the user clicks click avinode button on electron app, call avinodeSearch function
       ipcMain.on('select-avinode-jets', async () => {
          await avinodeSearch(page)
      });
      });
  });

  ipcMain.on('search-flightlistpro', () => {
    // call puppeteer function
    console.log('search-flightlistpro');
    const executablePath = getChromePath()
    // launch puppeteer
    puppeteer.launch({
      executablePath,
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    }).then(async (browser: { newPage: () => any; close: () => any; }) => {
      const page = await browser.newPage()

      await page.goto("https://flightlistpro.com/index.php");
      await page.waitForNavigation({ timeout: 120000 });
      await page.waitForNavigation({ timeout: 120000 });

      const flightPick = async () => {
        // an array of each plane clicked
        await page.evaluate(() => {
          const opAndJet: string[] = [];
          const companyName = document.querySelectorAll(
            "#frmSelect > table > tbody > tr > td:nth-child(2) > a"
          ) as NodeListOf<HTMLElement>;
          const jetType = document.querySelectorAll(
            "#frmSelect > table > tbody > tr > td:nth-child(3) > a"
          ) as NodeListOf<HTMLElement>;
          const button = document.querySelectorAll(
            "#frmSelect > table > tbody > tr > td.phone-column > input[type=checkbox]"
          ) as NodeListOf<HTMLElement>;
          const tailNumber = document.querySelectorAll(
            " #frmSelect > table > tbody > tr > td:nth-child(5)"
          ) as NodeListOf<HTMLElement>;

          console.log("tailNumber char at 6", tailNumber[0].innerText.charAt(1));

          for (let i = 0; i < companyName.length - 1; i++) {
            const curCompanyName = companyName[i];
            const curJet = jetType[i];
            const compAndType = `${curCompanyName.innerText} ${curJet.innerText}`;

            if (
              !opAndJet.includes(compAndType) &&
              tailNumber[i].innerText.charAt(1) === "N"
            ) {
              button[i].click();
              opAndJet.push(`${curCompanyName.innerText} ${curJet.innerText}`);
            }
          }
          // we need to return the opAndJet array so that it can be used in the next page function and add it to the allSelects array
          return opAndJet;
        });

        // if there is a next page button then click it
        const nextPage = await page.evaluate(() => {
          const nextPage = document.querySelectorAll(
            "#frmSelect > table > tbody > tr:nth-child(3) > td > a"
          ) as NodeListOf<HTMLElement>;
          const theNextPage = nextPage[nextPage.length - 2];
          // find the inner text of the next page button
          const nextPageText = theNextPage?.innerText
          if (nextPageText === "Next") {
            theNextPage.click();
            return true;
          } else {
            return false;
          }
        });

        if (nextPage) {
          await page.waitForNavigation();
          await flightPick();
          await page.waitForTimeout(1000);
        } else {
          // if there is no next page button then return the opAndJet array
          return;
        }
      };

      await flightPick();

    })
  })
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
