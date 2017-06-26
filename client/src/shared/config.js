module.exports = () => {
  const href = window.location.href;
  const apiVersion = 'v1';

  // DON'T CHANGE THESE URLS!
  let apiUrl = `https://api.youdescribe.org/${apiVersion}`;
  let audioClipsUploadsPath = 'https://api.youdescribe.org/audio-descriptions-files';

  const devHost = 'localhost';
  // const devHost = 'beta.youdescribe.org';

  if (href.indexOf(devHost) !== -1) {
    apiUrl = `http://${devHost}:8080/${apiVersion}`;
    audioClipsUploadsPath = `http://${devHost}:8080/audio-descriptions-files`;
  }

  const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3';
  const youTubeApiKey = 'AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls';
  const googleClientId = '1056671841574-e1r4soednlur8hl2sl0ooumpvftt1s2k.apps.googleusercontent.com';

  // Video Player Setup
  const seekToPositionDelayFix = 1; // Seconds.

  // Nudge increment/decrement value.
  const nudgeIncrementDecrementValue = 1;// Seconds.

  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
    youTubeApiUrl,
    youTubeApiKey,
    seekToPositionDelayFix,
    googleClientId,
    nudgeIncrementDecrementValue,
  };
};
