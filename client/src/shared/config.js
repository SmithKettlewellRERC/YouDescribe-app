module.exports = () => {
  const href = window.location.href;
  const apiVersion = 'v1';
  
  // DON'T CHANGE THESE URLS!
  let apiUrl = `https://api.youdescribe.org/${apiVersion}`;
  let audioClipsUploadsPath = 'https://api.youdescribe.org/audio-descriptions-files';
  
  if (href.indexOf('dev.youdescribe') !== -1) {
    apiUrl = `https://dev-api.youdescribe.org/${apiVersion}`;
    audioClipsUploadsPath = 'https://dev-api.youdescribe.org/audio-descriptions-files';
  }

  const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3';
  const youTubeApiKey = "AIzaSyDV8QMir3NE8S2jA1GyXvLXyTuSq72FPyE";                                    // project youdescribe-0126 in youdescribeadm@gmail.com
  // const youTubeApiKey = "AIzaSyBQFD0fJoEO2l8g0OIrqbtjj2qXXVNO__U";                                 // project youdescribe-0127 in youdescribeadm@gmail.com
  // const youTubeApiKey = "AIzaSyBWQ2o3N0MVc8oP96JvWVVwqjxpEOgkhQU";                                 // project youdescribe-0612 in youdescribeadm@gmail.com
  // const youTubeApiKey = "AIzaSyAfU2tpVpMKmIyTlRljnKfPUFWXrNXg21Q";                                 // project youdescribe-0613 in youdescribeadm@gmail.com
  // const youTubeApiKey = "AIzaSyBaJHiKgT4KW58WJ26tH4PIIQE6vbOvU8w";                                 // project youdescribe-0616 in youdescribeadm@gmail.com
  const googleClientId = '1056671841574-e1r4soednlur8hl2sl0ooumpvftt1s2k.apps.googleusercontent.com';

  // Video player setup.
  const seekToPositionDelayFix = 1; // Seconds.

  // Nudge increment/decrement value.
  const nudgeIncrementDecrementValue = 0.15; // Seconds.

  // User feedbacks data source.
  const audioDescriptionFeedbacks = {
    1: 'Needs better audio quality',
    2: 'Needs better diction',
    3: 'Needs more inline descriptions',
    4: 'Needs more extended descriptions',
    5: 'Do not step on the dialogue',
    6: 'Needs less description',
    7: 'Needs more description',
    8: 'Description does not match video tone',
    9: 'Description has innappropriate content',
    10: 'Description given before action',
    11: 'Needs to read all onscreen text',
  };

  const startDateTimeStamp = 1352707200000;

  return {
    apiUrl,
    apiVersion,
    audioClipsUploadsPath,
    youTubeApiUrl,
    youTubeApiKey,
    seekToPositionDelayFix,
    googleClientId,
    nudgeIncrementDecrementValue,
    audioDescriptionFeedbacks,
    startDateTimeStamp,
  };
};
