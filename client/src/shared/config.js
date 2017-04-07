module.exports = () => {
  const href = window.location.href;
  const apiVersion = 'v1';

  // DON'T CHANGE THIS URLS!
  let apiUrl = `https://api.youdescribe.org/${apiVersion}`;
  let audioClipsUploadsPath = 'https://api.youdescribe.org/audio-descriptions-files';

  if (href.indexOf('localhost') != -1) {
    apiUrl = `http://localhost:8080/${apiVersion}`;
    audioClipsUploadsPath = 'http://localhost:8080/audio-descriptions-files';
  }

  const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3';
  const youTubeApiKey = 'AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls';
  const googleClientId = '1056671841574-e1r4soednlur8hl2sl0ooumpvftt1s2k.apps.googleusercontent.com';

  // Video Player Setup
  const videoPlayerWathcerInterval = 50; // Miliseconds
  const videoPlayerWathcerDelay = 0.01; // Seconds
  const seekToPositionDelayFix = 0.100; // Seconds

  // User Interface Setup
  const trackSinewaveAreaWidth = 756;

  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
    youTubeApiUrl,
    youTubeApiKey,
    videoPlayerWathcerInterval,
    videoPlayerWathcerDelay,
    seekToPositionDelayFix,
    trackSinewaveAreaWidth,
    googleClientId,
  };
};
