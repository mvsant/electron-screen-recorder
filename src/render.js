const {desktopCapturer, remote} = require('electron');

const {Menu} = remote;

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
};