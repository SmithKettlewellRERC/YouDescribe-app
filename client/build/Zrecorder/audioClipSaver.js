
function saveAudioClip(blob, filename) {

    console.log('blob', blob);
    console.log('duration', blob.duration);
    
    const formData = new FormData();
    formData.append('label', 'The title from debug');
    formData.append('playbackType', 'inline');
    formData.append('startTime', '100.087');
    formData.append('endTime', '134.098');
    formData.append('duration', '10.000');
    formData.append('wavfile', blob);
    // formData.append('wavfile', file);
    console.log('Sending the request');
    const xhr = new XMLHttpRequest();

    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.withCredentials = true;
    // xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.open('POST', 'http://localhost:8080/v1/audioclips/qwe', true);
    xhr.onreadystatechange = function() {
      console.log(xhr.readyState);
      if (xhr.readyState == 4) {
          console.log(xhr.response);
      }
    }
    xhr.addEventListener('progress', updateProgress);
    xhr.addEventListener('load', transferComplete);
    xhr.addEventListener('error', transferFailed);
    xhr.addEventListener('abort', transferCanceled);
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=-- formdata --; charset=UTF-8');
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
    xhr.send(formData);
}

function updateProgress (oEvent) {
  if (oEvent.lengthComputable) {
      var percentComplete = oEvent.loaded / oEvent.total;
      console.log(percentComplete);
  } else {
      console.log('Unable to compute progress information since the total size is unknown');
  }
}

function transferComplete(evt) {
  console.log('The transfer is complete.');
}

function transferFailed(evt) {
  console.log('An error occurred while transferring the file.');
}

function transferCanceled(evt) {
  console.log('The transfer has been canceled by the user.');
}
