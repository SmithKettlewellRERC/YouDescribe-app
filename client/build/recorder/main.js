window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
    callBackFileSavedLocal = null;
var rafID = null;

function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {
    audioRecorder.exportWAV( doneEncoding );
}

function doneEncoding(blob) {
    // Recorder.processFile(blob);
    callBackFileSavedLocal(blob);
}

function startRecording() {
    if (!audioRecorder) return;

    audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
        audioRecorder.clear();
        audioRecorder.record();
    }).catch((error) => {
        console.log('Catch resume audiocontext', error);
        audioRecorder.clear();
        audioRecorder.record();
    });
}

function stopRecordingAndSave(callback) {
    callBackFileSavedLocal = callback;
    audioRecorder.stop();
    audioRecorder.getBuffers(gotBuffers);
}

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
}

function initAudioRecorder(callback) {
    // var promise = navigator.mediaDevices.getUserMedia(constraints);

    if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    };
    navigator.getUserMedia({
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false",
            },
            "optional": []
        },
    }, gotStream, function(e) {
        alert('You can just use this editor if you have a working microphone pluged in and if you allow access.');
        // console.log(e);
    });
}