import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

import {getIpcMain} from "./ipc_main.js";
const { BrowserWindow, dialog } = await getIpcMain();

function showMessage(message: string) {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow()!, 
    {message : message} )
}

class FileChooserUtils {

  static async selectFile(suggestedPath : string) {
    console.log("Opening file");
    const mainWindow = BrowserWindow.getFocusedWindow(); // Get the focused window
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openFile'],
      defaultPath: suggestedPath
    });
  
    if (!result.canceled) {
      const selectedFile = result.filePaths[0];
      return selectedFile;
    } else {
      return null;
    }
  }
}

class FileUtils {

  static async hasChildDirs(parentDir : string, subDirs : string[]) {

    const entries = await fs.readdir(parentDir, { withFileTypes: true });
    let missingDirs = [];
    for (const subDir of subDirs) {
      // const subDirPath = path.join(parentDir, subDir);
      const subDirExists = entries.some( 
        (entry) => entry.name === subDir && entry.isDirectory());

      if (!subDirExists)
        missingDirs.push(subDir)
    }
    return missingDirs;
  }

  static ImagesDir = '1-images';
  static OcrOutputDir = '2-ocr-output';
  static EditedOutputDir = '4-edited';

  static AllRequiredDirs = [ this.ImagesDir, this.OcrOutputDir, this.EditedOutputDir];

  static getMissingDirs(dataDir : string) {
    const missingDirs = this.hasChildDirs(dataDir, this.AllRequiredDirs);
    return missingDirs;
  }

  static async isFileInDir(dirPath : string, fileName : string) {
    try {
      const filePath = `${dirPath}/${fileName}`;
      const result = await fs.access(filePath);
      return true;
    } catch(ex) {
      return false;
    }
  }

  static getImageName(imageFilePath : string) {
    const baseName = path.basename(imageFilePath);
    const ext = path.extname(baseName);
    const imageName = baseName.slice(0, baseName.length - ext.length);
    return imageName;
  }

  static async saveFile(filePath : string, fileContents : string) {
    await fs.writeFile(filePath, fileContents);
  }

  static async readFile(filePath : string) {
    return await fs.readFile(filePath, 'utf8')
  }
}

async function verifyDataDir(dataDir: string) {

  const missingDirs = await FileUtils.getMissingDirs(dataDir);
  if (missingDirs.length > 0) {
    showMessage(`${dataDir} Missing sub-dirs ${missingDirs} `)
    return null;
  }
  return dataDir;
}

const defaultDataDir = path.join(os.homedir(), 'Desktop', 'mth_infotech');

export async function selectImageFilePath() {

  const imagesDir = path.join(defaultDataDir, FileUtils.ImagesDir);
  const imageFilePath = await FileChooserUtils.selectFile(imagesDir);
  if (!imageFilePath) {
    showMessage("Image File not selected");
    return null;
  }

  const candidateDataDir : string = path.dirname(path.dirname(imageFilePath));
  console.log("Candidate data directory is ", candidateDataDir);

  const dataDir : (string|null) = await verifyDataDir(candidateDataDir);
  if (!dataDir)
    return;
  console.log("Data directory is ", dataDir);

  const imageFileRelPath = path.relative(dataDir, imageFilePath);

  const imageName = FileUtils.getImageName(imageFilePath);

  const ocrOutputFileName = `${imageName}_ocr.txt`
  let   ocrOutputFileRelPath = path.join(FileUtils.OcrOutputDir, ocrOutputFileName);
  const ocrOutputDir = path.join(dataDir, FileUtils.OcrOutputDir);
  const ocrOutputFildFound = await FileUtils.isFileInDir(ocrOutputDir, ocrOutputFileName)
  if (!ocrOutputFildFound) {
    showMessage("No OCR Output file found " + ocrOutputFileRelPath);
    return null;
  }

  const editedTextFileName = `${imageName}_mod.txt`
  const editedFileRelPath = path.join(FileUtils.EditedOutputDir, editedTextFileName);
  const editedTextFileDir = path.join(dataDir, FileUtils.EditedOutputDir);
  const editedTextFileFound = await FileUtils.isFileInDir(editedTextFileDir, editedTextFileName);
  if (editedTextFileFound) {
    ocrOutputFileRelPath = editedFileRelPath;
  }

  const retObj = {
    'dataDirPath' : dataDir,
    'imageFileRelPath' : imageFileRelPath,
    'ocrOutputFileRelPath' : ocrOutputFileRelPath,
    'editedFileRelPath' : editedFileRelPath
  }
  console.log(retObj);
  return retObj;
}

export async function saveFile(dataDir : string, fileRelPath : string, fileContents : string) {
  const filePath = path.join(dataDir, fileRelPath);
  try {
    console.log("Saving file ", filePath, fileContents);
    await FileUtils.saveFile(filePath, fileContents);
    showMessage("Saved successfully " + filePath);
    return true;
  } catch(ex) {
    showMessage("Error saving file " + filePath + "\n" + ex);
    return false;
  }
}

export async function readFile(filePath : string) {
  try {
    console.log("Reading file ", filePath);
    return await FileUtils.readFile(filePath)
  }  catch(ex) {
    showMessage("Error reading file " + filePath + "\n" + ex);
  }
}
