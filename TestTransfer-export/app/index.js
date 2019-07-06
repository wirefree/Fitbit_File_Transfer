import document from "document";
import * as fs from "fs";
import { outbox } from "file-transfer";

let statusText = document.getElementById("status");
statusText.text = "Waiting...";
let fd = null;

function createFile() {
  let filename;
    let stringDateTime = new Date().getTime();
    stringDateTime = stringDateTime.toString().substring(6,12);	
    filename = "dt" + stringDateTime;

    console.log("Create Filename:" + filename);
    fd = fs.openSync(filename, "a+");
    let i = 0;
    
    while(i<10) {
      let stringDateTime = new Date().getTime();
      stringDateTime = stringDateTime.toString().substring(6,12);	
      let buffer = new ArrayBuffer(8);
      buffer[0] = stringDateTime;
      fs.writeSync(fd, buffer);
      i++;
    }

  fs.closeSync(fd);
  fd = null;
  sendFileOutbox(filename);
}

createFile();

async function sendFileOutbox(filename){
  console.log("Start sending");
  outbox
    .enqueueFile(filename)
    .then((ft) => {
      console.log("File " + filename + " successfully queued.");
    })
    .catch((error) => {
      console.log(`Failed to schedule transfer: $‌{error}`);
    })

    ft.unlinkSync(ft.name);
    console.log("Successful delete");
    createFile();
    countFilesOutgoingQueue();
 }

function countFilesOutgoingQueue() {
  let fileCountInQueue = 0;
  outbox.enumerate()
    .then(fileTransfers => {  
    //This for loop moves to the last first file that is created. 
    for (let each of fileTransfers) {
      //console.log("File " + each.name + " is " + each.readyState + "."); 
    }
    fileCountInQueue =  fileTransfers.length;
  })
    .catch(error => {
      console.log("listPendingFiles: failed = " + error.message + error.fileName + error.lineNumber);
      throw error;
   })
 console.log("Files in Queue: " +fileCountInQueue); 
  if(fileCountInQueue != null)
    return fileCountInQueue;
}

