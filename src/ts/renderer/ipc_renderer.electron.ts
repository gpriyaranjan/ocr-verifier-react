export interface IRendererFuncs {
  invoke(channel: string, ...args: any[]): Promise<any>;
}

export interface IpcRenderer {
  ipcRenderer: any;
}


export async function getIpcRenderer(): Promise<IpcRenderer|null> {
  const w = window as any;  
  if (w.process && w.process.type === 'renderer') {
    // We are in an Electron renderer process
    const myModule = await w.require('electron');
    console.log(myModule);
    return myModule;
  } else {
    // We are in a browser or other environment
    console.log("Electron module not available in this environment.");
    return null; // Or handle appropriately
  }
}
