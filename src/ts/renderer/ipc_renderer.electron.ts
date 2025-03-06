export interface IRendererFuncs {
  invoke(channel: string, ...args: any[]): Promise<any>;
}

export interface IpcRenderer {
  ipcRenderer: any;
}

/*
export async function getIpcRenderer(): Promise<IpcRenderer> {
  const myModule = await import('electron');
  console.log(myModule);
  return myModule as IpcRenderer;
}
*/

export async function getIpcRenderer(): Promise<IpcRenderer|null> {
if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
  // We are in an Electron renderer process
  const myModule = await import('electron');
  console.log(myModule);
  return myModule;
} else {
  // We are in a browser or other environment
  console.log("Electron module not available in this environment.");
  return null; // Or handle appropriately
}
}
