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
}