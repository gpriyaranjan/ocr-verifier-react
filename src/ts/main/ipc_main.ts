export interface IpcMain {
  app : any;
  BrowserWindow : any;
  ipcMain : any;
  dialog : any;
  screen : any;
}

export async function getIpcMain() : Promise<IpcMain> {
  const electron = await import('electron');
  const myModule = {
    app : electron.app,
    BrowserWindow : electron.BrowserWindow,
    ipcMain : electron.ipcMain,
    dialog : electron.dialog,
    screen : electron.screen
  };
  console.log("IpcMain ", myModule);
  return myModule;
}
