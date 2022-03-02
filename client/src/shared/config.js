module.exports = () => {
  const href = window.location.href;
  const apiVersion = "v1";

  // DON'T CHANGE THESE URLS!
  //let apiUrl = `https://api.youdescribe.org/${apiVersion}`;
  let apiUrl = `https://dev-api.youdescribe.org/${apiVersion}`;
  let audioClipsUploadsPath =
    "https://api.youdescribe.org/audio-descriptions-files";
  // let audioClipsUploadsPath =
  //   "https://api.youdescribe.org/audio-descriptions-files";
  //let apiUrl = `http://localhost:8080/${apiVersion}`;
  //let audioClipsUploadsPath = "https://api.youdescribe.org/audio-descriptions-files";
  const youTubeApiUrl = "https://www.googleapis.com/youtube/v3";

  // YouDescribe APIKey
  const youTubeApiKey = "AIzaSyDV8QMir3NE8S2jA1GyXvLXyTuSq72FPyE";

  // YouDescribe Google Client Id
  const googleClientId =
    "1061361249208-9799kv6172rjgmk4gad077639dfrck82.apps.googleusercontent.com";

  // Video player setup.
  const seekToPositionDelayFix = 1; // Seconds.

  // Nudge increment/decrement value.
  const nudgeIncrementDecrementValue = 0.15; // Seconds.

  // User feedbacks data source.
  const audioDescriptionFeedbacks = {
    1: "Needs better audio quality",
    2: "Needs better diction",
    3: "Needs more inline descriptions",
    4: "Needs more extended descriptions",
    5: "Do not step on the dialogue",
    6: "Needs less description",
    7: "Needs more description",
    8: "Description does not match video tone",
    9: "Description has innappropriate content",
    10: "Description given before action",
    11: "Needs to read all onscreen text",
  };

  const startDateTimeStamp = 1352707200000;

  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
    youTubeApiUrl,
    youTubeApiKey,
    seekToPositionDelayFix,
    googleClientId,
    nudgeIncrementDecrementValue,
    audioDescriptionFeedbacks,
    startDateTimeStamp,
  };
};
