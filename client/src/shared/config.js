module.exports = () => {
  const isProduction = false;
  const apiVersion = 'v1';
  const protocol = 'http';
  const apiPort = isProduction ? '80' : '8080';
  const appPort = isProduction ? '80' : '3000';
  const baseUrl = isProduction ? `${protocol}://webng.io` : `${protocol}://localhost`;
  const apiUrl = `${baseUrl}:${apiPort}/${apiVersion}`;
  const appUrl = `${baseUrl}:${appPort}`;
  const audioClipsUploadsPath = `${baseUrl}:${apiPort}/uploads`;
  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
  };
};
