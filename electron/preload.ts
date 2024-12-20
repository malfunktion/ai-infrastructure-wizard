import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  createDirectory: async (dir: string) => {
    return ipcRenderer.invoke('create-directory', dir);
  },
  writeFile: async (path: string, content: string) => {
    return ipcRenderer.invoke('write-file', { path, content });
  },
  runDockerCompose: async (dir: string) => {
    return ipcRenderer.invoke('docker-compose-up', dir);
  },
  onDeploymentLog: (callback: (event: any, message: string) => void) => {
    ipcRenderer.on('deployment-log', callback);
    return () => {
      ipcRenderer.removeListener('deployment-log', callback);
    };
  }
});
