// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    searchAvinode: () => ipcRenderer.send('search-avinode'),
    selectAvinodeJets: () => ipcRenderer.send('select-avinode-jets'),
    searchFlightListPro: () => ipcRenderer.send('search-flightlistpro')
})
