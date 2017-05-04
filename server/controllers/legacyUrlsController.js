const legacyUrlsController = {
  redirect: (req, res) => {
    const videoId = req.params.videoId;
    console.log('BOOOOOOM', videoId);
  }
};

module.exports = legacyUrlsController;
