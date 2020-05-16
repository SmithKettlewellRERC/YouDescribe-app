module.exports = () => {
  const href = window.location.href;
  const apiVersion = 'v1';
  
  // DON'T CHANGE THESE URLS!
  let apiUrl = `http://dev.youdescribe.org:8081/${apiVersion}`;                                       // 18.221.192.73:8081
  let audioClipsUploadsPath = 'http://dev.youdescribe.org:8081/audio-descriptions-files';             // 18.221.192.73:8081
  // let apiUrl = `http://127.0.0.1:8081/${apiVersion}`;
  // let audioClipsUploadsPath = 'http://127.0.0.1:8081/audio-descriptions-files';

  const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3';
  // const youTubeApiKey = "AIzaSyBQFD0fJoEO2l8g0OIrqbtjj2qXXVNO__U";                                 // project youdescribe-0127 in youdescribeadm@gmail.com
  const youTubeApiKey = "AIzaSyDV8QMir3NE8S2jA1GyXvLXyTuSq72FPyE";                                    // project youdescribe-0126 in youdescribeadm@gmail.com
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
