function getLang() {
  let defaultLang = 'en-us';
  if (navigator.languages !== undefined) {
    defaultLang = navigator.languages[0];
  } else  {
    defaultLang = navigator.language;
  }
  return defaultLang.toLowerCase();
}

function convertTimeToCardFormat(time) {
  const year = 31536000000;
  const month = 2629740000;
  const day = 86400000;
  const hour = 3600000;
  const min = 60000;

  if (time >= year) {
    const years = Math.floor(time / year);
    years === 1 ? time = `${years} year ago` : time = `${years} years ago`;
  } else if (time >= month) {
    const months = Math.floor(time / month);
    months === 1 ? time = `${months} month ago` : time = `${months} months ago`;
  } else if (time >= day) {
    const days = Math.floor(time / day);
    days === 1 ? time = `${days} day ago` : time = `${days} days ago`;
  } else if (time >= hour) {
    const hours = Math.floor(time / hour);
    hours === 1 ? time = `${hours} hour ago` : time = `${hours} hours ago`;
  } else {
    const minutes = Math.floor(time / min);
    minutes === 1 ? time = `${minutes} minutes ago` : time = `${minutes} minutes ago`;
  }

  return time;
}

function convertViewsToCardFormat(views) {
  if (views >= 1000000000) views = `${(views / 1000000000).toFixed(1)}B views`;
  else if (views >= 1000000) views = `${(views / 1000000).toFixed(1)}M views`;
  else if (views >= 1000) views = `${(views / 1000).toFixed(0)}K views`;
  else if (views === 1) views = `${views} view`;
  else views = `${views} views`;

  return views;
}

function convertLikesToCardFormat(likes) {
  if (likes >= 1000000000) likes = `${(likes / 1000000000).toFixed(1)}B`;
  else if (likes >= 1000000) likes = `${(likes / 1000000).toFixed(1)}M`;
  else if (likes >= 1000) likes = `${(likes / 1000).toFixed(0)}K`;
  else if (likes === 1) likes = `${likes}`;
  else likes = `${likes}`;

  return likes;
}

function convertISO8601ToSeconds(input) {
  const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let totalseconds;
  if (reptms.test(input)) {
    const matches = reptms.exec(input);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
    totalseconds = (hours * 3600) + (minutes * 60) + seconds;
  }
  return (totalseconds);
}

function convertISO8601ToDate(input) {
  let d = new Date(input);
  d = String(d).split(' ').slice(1, 4);
  d[1] += ',';
  return d.join(' ');
}

function convertSecondsToCardFormat(timeInSeconds) {
  let hours = Math.floor(timeInSeconds / 3600);
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = Math.floor(timeInSeconds);
  // let milliseconds = Math.floor((timeInSeconds - Math.floortimeInSeconds) * 100);
  if (hours >= 24) hours = Math.floor(hours % 24);
  // if (hours < 10) hours = '0' + hours;
  if (minutes >= 60) minutes = Math.floor(minutes % 60);
  if (minutes < 10 && timeInSeconds >= 3600) minutes = `0${minutes}`;
  if (seconds >= 60) seconds = Math.floor(seconds % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  // if (milliseconds < 10) milliseconds = `0${milliseconds}`;

  return timeInSeconds < 3600 ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

function convertSecondsToEditorFormat(timeInSeconds) {
  let hours = Math.floor(timeInSeconds / 3600);
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = Math.floor(timeInSeconds);
  let milliseconds = Math.floor((timeInSeconds - Math.floor(timeInSeconds)) * 100);
  if (hours >= 24) hours = Math.floor(hours % 24);
  if (hours < 10) hours = `0${hours}`;
  if (minutes >= 60) minutes = Math.floor(minutes % 60);
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds >= 60) seconds = Math.floor(seconds % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  if (milliseconds < 10) milliseconds = `0${milliseconds}`;

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// fetch function that work accross platform
function ourFetch(url, JSONparsing = true, optionObj = { method: 'GET' }) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(optionObj.method, url);
    if (optionObj.headers) {
      for (let key in optionObj.headers) {
        req.setRequestHeader(key, optionObj.headers[key]);
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
        reject(JSON.parse(req.response));
      }
    };
    req.send(optionObj.body);
  });
}

export {
  convertTimeToCardFormat,
  convertViewsToCardFormat,
  convertLikesToCardFormat,
  convertISO8601ToSeconds,
  convertISO8601ToDate,
  convertSecondsToCardFormat,
  convertSecondsToEditorFormat,
  ourFetch,
  getLang,
};
