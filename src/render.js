const {desktopCapturer, remote} = require('electron');

const {Menu, dialog} = remote;
const {writeFile} = require('fs');

// Buttons
const videoElement = document.querySelector('video');
const startButton = document.getElementById('start_button');
const stopButton = document.getElementById('stop_button');
const videoSelectionButton = document.getElementById('video_selection_button');

videoSelectionButton.onclick = getVideoSources;

// Get the available video sources
async function getVideoSources() {
const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
});

const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
        return {
            label: source.name,
            click: () => selectSource(source)
        };
    })
);
videoOptionsMenu.popup();
};

// Change the video source window to record.
async function selectSource(source){
    videoSelectionButton.innerText = source.name;

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };
    //Create a stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Preview the source in a video element
    videoElement.srcObject = stream;
    videoElement.play();

    // Create the Media Recorder
    const option = {mimeType: 'video/webm; codecs=vp9'};
    mediaRecorder = new mediaRecorder(stream, options);

    // Register event handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;

    // Captures all recorded chunks
    function handleDataAvailable(e) {
        console.log('Video data available');
        recordedChunks.push(e.data);
    }

    // Saves the video file on stop
    async function handleStop(e) {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm; codecs=vp9'
        });
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Save file funcionality
        const {filepath} = await dialog.showSaveDialog({
            buttonLabel: 'Save video',
            defaultPath: `video-${Date.now()}.webm`
        });
        console.log(filepath);
        writeFile(filepath,buffer, () => console.log('video saved successfully'));
    }
};

let mediaRecorder;// Media recorder instance to capture footage
const recordedChunks = [];