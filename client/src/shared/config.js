module.exports = () => {
  const isProduction = false;
  const apiVersion = 'v1';
  const protocol = 'http';
  const apiPort = isProduction ? '8080' : '8080';
  const baseUrl = isProduction ? `${protocol}://webng.io` : `${protocol}://localhost`;
  const apiUrl = `${baseUrl}:${apiPort}/${apiVersion}`;
  const audioClipsUploadsPath = `${baseUrl}:${apiPort}/uploads`;
  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
  };
};
