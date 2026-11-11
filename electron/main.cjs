const { app, BrowserWindow, Menu, protocol } = require('electron');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const scheme = 'sijill';
protocol.registerSchemesAsPrivileged([{
  scheme,
  privileges: {
    standard: true,
    secure: true,
    supportFetchAPI: true,
    corsEnabled: true,
    stream: true
  }
}]);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.wasm': 'application/wasm',
  '.gz': 'application/gzip',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

async function serveBundle(request) {
  try {
    const requestedPath = decodeURIComponent(new URL(request.url).pathname).replace(/^\/+/, '') || 'index.html';
    const bundleRoot = path.resolve(app.getAppPath(), 'dist');
    const filePath = path.resolve(bundleRoot, requestedPath);
    if (!isInside(bundleRoot, filePath)) return new Response('Not found', { status: 404 });
    const bytes = await readFile(filePath);
    return new Response(bytes, {
      status: 200,
      headers: { 'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream' }
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}

async function createWindow() {
  protocol.handle(scheme, serveBundle);
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 900,
    minHeight: 640,
    show: false,
    title: 'Sijill Cancer Registry',
    backgroundColor: '#f8fafc',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.once('ready-to-show', () => window.show());
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  await window.loadURL(`${scheme}://bundle/index.html`);
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  await createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
