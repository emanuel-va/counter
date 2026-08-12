// script.js

import { icons } from './icons.js';
import { Counter } from './counter.js';

const settingsInputs = document.querySelector('.settings').getElementsByTagName('input');
const alerts = document.querySelectorAll('.alert');
const buttons = document.getElementsByTagName('button');
const iterationSpan = document.querySelector('.iteration');
const statisticsValues = document.querySelectorAll('.value');
const addInput = document.querySelector('.add-input');

const settingsKey = 'settings';
const historyKey = 'history';
if (localStorage.getItem(settingsKey) === null && localStorage.getItem(historyKey) === null) {
    localStorage.setItem(settingsKey, '');
    localStorage.setItem(historyKey, 0);
}

let alertLabel, alertClass, alertIcon;
const setAlert = (label, className, icon) => {
    alertLabel = label;
    alertClass = className;
    alertIcon = icon;
}
const displayAlert = (alert) => {
    alert.innerHTML = `${alertIcon}${alertLabel}`;
    alert.classList.add(alertClass);
    setTimeout(() => alert.classList.remove(alertClass), 5000);
}
const capitalize = (word) => {
    return word.charAt(0).toUpperCase().concat(word.slice(1));
}
const setValues = (array, parameters, history, value) => {
    const counter = new Counter(parameters[2], parameters[3], history, value);
    array.push(
        `${counter.calculateTotal()} ${parameters[0]}`,
        `${counter.calculateRemaining()}`,
        `${Math.round(counter.calculateAverage())} per ${parameters[1]}`,
        `${counter.calculateMax()}`,
        `${counter.calculateMin()}`,
        `${counter.calculateIterations()}`,
        `${Math.round(counter.calculatePercentage())}%`
    );
    for (let i = 0; i < statisticsValues.length; i ++) {
        statisticsValues[i].textContent = array[i];
    }
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
        if (Number(loadSettings[2]) <= 0 || Number(loadSettings[3]) <= 0) {
            loadSettings = [];
            setAlert('Count target and minimum average must be greater than 0.', 'alert--error', icons.error);
        } else {
            for (let i = 0; i < settingsInputs.length; i ++) {
                if (i < 2) {
                    settingsInputs[i].value = capitalize(loadSettings[i]);
                } else {
                    settingsInputs[i].value = loadSettings[i];
                }
                settingsInputs[i].setAttribute('disabled', true);
            }
            iterationSpan.textContent = `${capitalize(loadSettings[1])} count:`;
            loadSettings.push('disabled');
            loadSettings = loadSettings.join(',');
            localStorage.setItem(settingsKey, loadSettings);
            loadSettings = [];
            setAlert('Settings were successfuly saved.', 'alert--done', icons.check);
            buttons[0].setAttribute('disabled', true);
            buttons[1].removeAttribute('disabled');
            buttons[2].removeAttribute('disabled');
        }
    }
    displayAlert(alerts[0]);
}
const reset = function() {
    for (let i = 0; i < settingsInputs.length; i ++) {
        settingsInputs[i].value = '';
        settingsInputs[i].removeAttribute('disabled');
    }
    setAlert('Settings were reset.', 'alert--info', icons.info);
    displayAlert(alerts[0]);
    localStorage.setItem(settingsKey, '');
    localStorage.setItem(historyKey, 0);
    buttons[0].removeAttribute('disabled');
    buttons[1].setAttribute('disabled', true);
    buttons[2].setAttribute('disabled', true);
    iterationSpan.textContent = '';
    for (let i = 0; i < statisticsValues.length; i ++) {
        statisticsValues[i].textContent = '-';
    }
}
let loadHistory = localStorage.getItem('history');
const count = function() {
    let value = Number(addInput.value);
    if (value === 0 || value < 0) {
        setAlert('Value must be greater than 0.', 'alert--error', icons.error);
    } else {
        loadHistory = loadHistory.concat(`,${value}`);
        localStorage.setItem('history', loadHistory);
        const parameters = localStorage.getItem('settings').split(',');
        parameters.pop();
        const loadValues = [];
        setValues(loadValues, parameters, loadHistory, value);
        setAlert('Done!', 'alert--done', icons.check);
    }
    displayAlert(alerts[1]);
    addInput.value = '';
}

const commands = [save, reset, count];
for (let i = 0; i < commands.length; i ++) {
    buttons[i].addEventListener('click', commands[i]);
}

const settings = localStorage.getItem('settings').split(',');
const history = localStorage.getItem('history').split(',');
let isSaveEnabled = settings[4] === undefined || settings[4] === 'enabled' ? true : false;
if (!isSaveEnabled) {
    for (let i = 0; i < settingsInputs.length; i ++) {
        settingsInputs[i].value = settings[i];
        settingsInputs[i].setAttribute('disabled', true);
    }
    buttons[0].setAttribute('disabled', true);
    buttons[1].removeAttribute('disabled');
    buttons[2].removeAttribute('disabled');
    iterationSpan.textContent = `${capitalize(settings[1])} count:`
    const values = [];
    setValues(values, settings, history.join(','), history[history.length - 1]);
    console.log()
}
//localStorage.setItem('history', 0);