// http://youdescribe.org/player.php?v=A4Xit5osve4
// http://youdescribe.org/player.php?v=MPLV4h0Tr8c&prefer_d=DoubleJ
// http://youdescribe.org/player.php?v=_TEtfrHg1zw

const legacyUrlsController = {
  redirect: (req, res) => {
    const videoId = req.query.v;
    res.redirect(`/video/${videoId}`);
  }
};

module.exports = legacyUrlsController;
