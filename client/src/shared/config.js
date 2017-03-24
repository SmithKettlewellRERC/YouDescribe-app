module.exports = () => {
  const isProduction = false;
  const apiVersion = 'v1';
  const protocol = 'http';
  const apiPort = isProduction ? '8080' : '8080';
  const baseUrl = isProduction ? `${protocol}://webng.io` : `${protocol}://192.168.0.101`;
  const apiUrl = `${baseUrl}:${apiPort}/${apiVersion}`;
  const audioClipsUploadsPath = `${baseUrl}:${apiPort}/uploads`;
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
