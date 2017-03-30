module.exports = () => {
  const href = window.location.href;
  const apiVersion = 'v1';
  const env = 'prd';
  let apiUrl = `http://localhost:8080/${apiVersion}`;
  let audioClipsUploadsPath = 'http://localhost:8080/uploads';

  if (href.indexOf('localhost') != -1 || href.indexOf('dev') != -1) {
    apiUrl = `http://localhost:8080/${apiVersion}`;
    audioClipsUploadsPath = 'http://localhost:8080/uploads';
  }

  const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3';
  const youTubeApiKey = 'AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls';
  const googleClientId = '1056671841574-e1r4soednlur8hl2sl0ooumpvftt1s2k.apps.googleusercontent.com';

  // Video Player Setup
  const videoPlayerWathcerInterval = 50; // Miliseconds
  const videoPlayerWathcerDelay = 0.01; // Seconds
  const seekToPositionDelayFix = 0.100; // Seconds

  // User Interface Setup
  const trackSinewaveAreaWidth = 755;

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
