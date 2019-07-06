import { inbox } from "file-transfer";

async function processAllFiles() {
  let file;
  while ((file = await inbox.pop())) {
    console.log("Data Received: " + file.length);
    const payload = file.text();
    console.log("file contents:" + payload);
  }
}

inbox.addEventListener("newfile", processAllFiles);
processAllFiles();