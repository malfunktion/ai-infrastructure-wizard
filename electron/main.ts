import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('create-directory', async (event, dir) => {
  try {
    await mkdir(dir, { recursive: true });
    event.sender.send('deployment-log', `Created directory: ${dir}`);
    return { success: true };
  } catch (error) {
    console.error('Error creating directory:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, { path, content }) => {
  try {
    await writeFile(path, content, 'utf8');
    event.sender.send('deployment-log', `Created file: ${path}`);
    return { success: true };
  } catch (error) {
    console.error('Error writing file:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('docker-compose-up', async (event, dir) => {
  try {
    event.sender.send('deployment-log', 'Pulling Docker images...');
    await execAsync('docker-compose pull', { cwd: dir });
    
    event.sender.send('deployment-log', 'Starting Docker containers...');
    await execAsync('docker-compose up -d', { cwd: dir });
    
    event.sender.send('deployment-log', 'Docker containers started successfully');
    return { success: true };
  } catch (error) {
    console.error('Error running docker-compose:', error);
    return { success: false, error: error.message };
  }
});
