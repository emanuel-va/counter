// script.js

import { icons } from './icons.js';

const settingsInputs = document.querySelector('.settings').getElementsByTagName('input');
const settingsAlert = document.querySelector('.settings').querySelector('.alert');
const settingsButtons = document.querySelector('.settings').getElementsByTagName('button');

const settingsKey = 'settings';
if (localStorage.getItem(settingsKey) === null) {
    localStorage.setItem(settingsKey, '');
}

let alertLabel, alertClass, alertIcon;
const setAlert = (label, className, icon) => {
    alertLabel = label;
    alertClass = className;
    alertIcon = icon;
}
const displayAlert = () => {
    settingsAlert.innerHTML = `${alertIcon}${alertLabel}`;
    settingsAlert.classList.add(alertClass);
    setTimeout(() => settingsAlert.classList.remove(alertClass), 5000);
}

let loadSettings = [];
const save = function() {
    for (let i = 0; i < settingsInputs.length; i ++) {
        loadSettings.push(settingsInputs[i].value);
    }
    if (loadSettings.join(',') === ',,,') {
        loadSettings = [];
        setAlert('You must fill all fields first.', 'alert--error', icons.error);
    } else {
        for (let i = 0; i < settingsInputs.length; i ++) {
            settingsInputs[i].value = loadSettings[i];
            settingsInputs[i].setAttribute('disabled', true);
        }
        loadSettings.push('disabled', 'enabled');
        loadSettings = loadSettings.join(',');
        localStorage.setItem(settingsKey, loadSettings);
        loadSettings = [];
        setAlert('Settings were successfuly saved.', 'alert--done', icons.check);
        settingsButtons[0].setAttribute('disabled', true);
        settingsButtons[1].removeAttribute('disabled');
    }
    displayAlert();
}
const reset = function() {
    for (let i = 0; i < settingsInputs.length; i ++) {
        settingsInputs[i].value = '';
        settingsInputs[i].removeAttribute('disabled');
    }
    setAlert('Settings were reset.', 'alert--info', icons.info);
    displayAlert();
    localStorage.setItem(settingsKey, '');
    settingsButtons[0].removeAttribute('disabled');
    settingsButtons[1].setAttribute('disabled', true);
}

const commands = [save, reset];
for (let i = 0; i < commands.length; i ++) {
    settingsButtons[i].addEventListener('click', commands[i]);
}

const settings = localStorage.getItem('settings').split(',');
let isSaveEnabled = settings[4] === undefined || settings[4] === 'enabled' ? true : false;
if (!isSaveEnabled) {
    for (let i = 0; i < settingsInputs.length; i ++) {
        settingsInputs[i].value = settings[i];
        settingsInputs[i].setAttribute('disabled', true);
    }
    settingsButtons[0].setAttribute('disabled', true);
    settingsButtons[1].removeAttribute('disabled');
}

//localStorage.clear();