module.exports = () => {
  const isProduction = false;
  const apiVersion = 'v1';
  const protocol = 'http';
  const apiPort = isProduction ? '8080' : '8080';
  const baseUrl = isProduction ? `${protocol}://webng.io` : `${protocol}://localhost`;
  const apiUrl = `${baseUrl}:${apiPort}/${apiVersion}`;
  const audioClipsUploadsPath = `${baseUrl}:${apiPort}/uploads`;
  const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3';
  const youTubeApiKey = 'AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls';

  // Video Player Setup
  const videoPlayerWathcerInterval = 50; // Miliseconds
  const videoPlayerWathcerDelay = 0.01; // Seconds
  const seekToPositionDelayFix = 0.100; // Seconds

  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
    youTubeApiUrl,
    youTubeApiKey,
    videoPlayerWathcerInterval,
    videoPlayerWathcerDelay,
    seekToPositionDelayFix,
  };
};
