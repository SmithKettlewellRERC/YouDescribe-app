module.exports = () => {
  const isProduction = true;
  const apiVersion = 'v1';
  const protocol = 'http';
  const apiPort = isProduction ? '8080' : '8080';
  const baseUrl = isProduction ? `${protocol}://webng.io` : `${protocol}://localhost`;
  const apiUrl = `${baseUrl}:${apiPort}/${apiVersion}`;
  const audioClipsUploadsPath = `${baseUrl}:${apiPort}/uploads`;
  const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3';
  const youTubeApiKey = 'AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls';
  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
    youTubeApiUrl,
    youTubeApiKey,
  };
};
