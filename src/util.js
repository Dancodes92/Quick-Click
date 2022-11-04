export function getChromePath() {
  switch (process.platform) {
    case 'win32':
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    case 'darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    case 'linux':
      return '/usr/bin/google-chrome'
  }
}

