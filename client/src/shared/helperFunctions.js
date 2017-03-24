
export function convertISO8601ToSeconds(input) {
  const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  let hours = 0, minutes = 0, seconds = 0, totalseconds;
  if (reptms.test(input)) {
    const matches = reptms.exec(input);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
    totalseconds = hours * 3600  + minutes * 60 + seconds;
  }
  return (totalseconds);
}

export function convertSecondsToEditorFormat(timeInSeconds) {
  let hours = ~~(timeInSeconds / 3600);
  let minutes = ~~(timeInSeconds / 60);
  let seconds = ~~timeInSeconds;
  let milliseconds = ~~((timeInSeconds - ~~timeInSeconds) * 100);
  if (hours >= 24) hours = ~~(hours % 24);
  if (hours < 10) hours = '0' + hours;
  if (minutes >= 60) minutes = ~~(minutes % 60);
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds >= 60) seconds = ~~(seconds % 60);
  if (seconds < 10) seconds = '0' + seconds;
  if (milliseconds < 10) milliseconds = '0' + milliseconds;

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

//fetch function that work accross platform
export function ourFetch(url, JSONparsing = true, optionObj = { method: 'GET' }) {
  return new Promise( (resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(optionObj.method, url);
    if (optionObj.headers) {
      for (let key in optionObj.headers) {
        req.setRequestHeader(key,optionObj.headers[key]);
      }
    }
    req.onload = () => {
      if (req.status === 200) {
        if (JSONparsing) {
          resolve(JSON.parse(req.response));
        } else {
          resolve(req.response);
        }
      } else {
        reject(Error(req.statusText));
      }
    };
    req.send(optionObj.body);
  });
}

