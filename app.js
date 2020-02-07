const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let window = null;

let downloadItems = [];

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    // Set the initial width to 800px
    width: 800,
    // Set the initial height to 600px
    height: 600,
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    backgroundColor: "#D6D8DC",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false
  });

  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  window.webContents.session.on("will-download", function (event, item, webContents) {
    console.log("WILL DOWNLOAD ", item);

    downloadItems = [...downloadItems, item];

    item.on('updated', (event, state) => {
      console.log("state ", state, item.getFilename());
    });

    item.on("done", (event, state) => {
      console.log("state ", state);

      if (state === 'completed') {
        console.log("Successfully downloaded ", item.savePath);
      }

      const idx = downloadItems.indexOf(item);
      if (idx > -1) {
        downloadItems.splice(idx, 1);
      }
      console.log("Remaining items ", downloadItems);
    });
  });

  // Show window when page is ready
  window.once('ready-to-show', () => {
    window.show()
  })
});
