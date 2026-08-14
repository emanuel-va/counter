// script.js

import { icons } from './icons.js';
import { Counter } from './counter.js';

const headers = document.getElementsByTagName('h2');
const settingsInputs = document.querySelector('.settings').getElementsByTagName('input');
const alerts = document.querySelectorAll('.alert');
const buttons = document.getElementsByTagName('button');
const iterationSpan = document.querySelector('.iteration');
const statisticsValues = document.querySelectorAll('.value');
const progressBar = document.querySelector('.bar');
const addInput = document.querySelector('.add-input');
const historyBox = document.querySelector('.history');

const headerLabels = ['Settings', 'Statistics', 'Add', 'History'];
const headerIcons = [icons.settings, icons.bars, icons.add, icons.history];
for (let i = 0; i < headers.length; i ++) {
    headers[i].innerHTML = `${headerIcons[i]}<span>${headerLabels[i]}</span>`;
}
const buttonLabels = ['Save', 'Reset', 'Count'];
const buttonIcons = [icons.save, icons.delete, icons.calculate];
for (let i = 0; i < buttons.length; i ++) {
    buttons[i].innerHTML = `${buttonIcons[i]}<span>${buttonLabels[i]}</span>`;
}

const settingsKey = 'settings';
const historyKey = 'history';
const datesKey = 'dates';
if (localStorage.getItem(settingsKey) === null || localStorage.getItem(historyKey) === null || localStorage.getItem(datesKey) === null) {
    localStorage.setItem(settingsKey, '');
    localStorage.setItem(historyKey, 0);
    localStorage.setItem(datesKey, 0);
}

const alertLabels = [
    'You must define all settings.',
    'Count target and minimum average must be greater than 0.',
    'Settings were successfuly saved.',
    'Settings were reset, please reload site.',
    'Value must be greater than 0.',
    'Done!'
];
const classes = [
    'alert--error',
    'alert--done',
    'alert--info',
    'history__item',
    'value-warning',
    'value-ok'
];

let alertLabel, alertClass, alertIcon;
const setAlert = (label, className, icon) => {
    alertLabel = label;
    alertClass = className;
    alertIcon = icon;
}
const displayAlert = (alert) => {
    alert.innerHTML = `${alertIcon}<span>${alertLabel}</span>`;
    alert.classList.add(alertClass);
    setTimeout(() => alert.classList.remove(alertClass), 5000);
}
const capitalize = (word) => {
    return word.charAt(0).toUpperCase().concat(word.slice(1));
}
const setValues = (array, parameters, history) => {
    if (localStorage.getItem(historyKey) == 0) {
        for (let i = 0; i < statisticsValues.length; i ++) {
            array.push('-');
        }
    } else {
        const counter = new Counter(parameters[2], parameters[3], history);
        array.push(
            `${counter.calculateTotal()} ${parameters[0]}`,
            `${counter.calculateRemaining()}`,
            `${Math.round(counter.calculateAverage())} per ${parameters[1]}`,
            `${counter.calculateMax()}`,
            `${counter.calculateMin()}`,
            `${counter.calculateIterations()}`,
            `${Math.round(counter.calculatePercentage())}%`
        );
        progressBar.style.width = `${counter.calculatePercentage()}%`;
    }
    for (let i = 0; i < statisticsValues.length; i ++) {
        statisticsValues[i].textContent = array[i];
    }
}
const addHistoryItem = (label, value, date) => {
    if (localStorage.getItem(historyKey) != 0) {
        const item = document.createElement('div');
        const itemLabel = document.createElement('span');
        const itemValue = document.createElement('span');
        const itemDate = document.createElement('span');
        item.classList.add(classes[3]);
        item.style.display = 'flex';
        let itemValueClass = value < localStorage.getItem(settingsKey).split(',')[3] ? classes[4] : classes[5];
        itemValue.classList.add(itemValueClass);
        itemLabel.textContent = label;
        itemValue.textContent = value;
        itemDate.textContent = date;
        const childs = [itemLabel, itemValue, itemDate];
        for (let i = 0; i < childs.length; i ++) {
            item.appendChild(childs[i]);
        }
        historyBox.appendChild(item);
    }
}

let loadSettings = [];
const save = function() {
    for (let i = 0; i < settingsInputs.length; i ++) {
        loadSettings.push(settingsInputs[i].value);
    }
    if (loadSettings.join(',') === ',,,') {
        loadSettings = [];
        setAlert(alertLabels[0], classes[0], icons.error);
    } else {
        if (Number(loadSettings[2]) <= 0 || Number(loadSettings[3]) <= 0) {
            loadSettings = [];
            setAlert(alertLabels[1], classes[0], icons.error);
        }
        else if (loadSettings[0] === '' || loadSettings[1] === '') {
            loadSettings = [];
            setAlert(alertLabels[0], classes[0], icons.error);
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
            buttons[0].setAttribute('disabled', true);
            buttons[1].removeAttribute('disabled');
            buttons[2].removeAttribute('disabled');
            addInput.removeAttribute('disabled');
            document.removeEventListener('keydown', saveEnterHandler);
            document.addEventListener('keydown', countEnterHandler);
            setAlert(alertLabels[2], classes[1], icons.check);
        }
    }
    displayAlert(alerts[0]);
}
const reset = function() {
    for (let i = 0; i < settingsInputs.length; i ++) {
        settingsInputs[i].value = '';
        settingsInputs[i].removeAttribute('disabled');
    }
    localStorage.setItem(settingsKey, '');
    localStorage.setItem(historyKey, 0);
    localStorage.setItem(datesKey, 0);
    buttons[0].removeAttribute('disabled');
    buttons[1].setAttribute('disabled', true);
    buttons[2].setAttribute('disabled', true);
    iterationSpan.textContent = '';
    for (let i = 0; i < statisticsValues.length; i ++) {
        statisticsValues[i].textContent = '-';
    }
    progressBar.style.width = '0%';
    const historyItem = document.querySelectorAll(`.${classes[3]}`);
    for (let i = 0; i < historyItem.length; i ++) {
        historyItem[i].style.display = 'none';
    }
    addInput.setAttribute('disabled', true);
    document.addEventListener('keydown', saveEnterHandler);
    document.removeEventListener('keydown', countEnterHandler);
    setAlert(alertLabels[3], classes[2], icons.info);
    displayAlert(alerts[0]);
}
let loadHistory = localStorage.getItem(historyKey);
let loadDate = localStorage.getItem(datesKey);
const date = new Date();
const count = function() {
    let value = Number(addInput.value);
    if (value === 0 || value < 0) {
        setAlert(alertLabels[4], classes[0], icons.error);
    } else {
        loadHistory = loadHistory.concat(`,${value}`);
        localStorage.setItem(historyKey, loadHistory);
        const parameters = localStorage.getItem(settingsKey).split(',');
        parameters.pop();
        const loadValues = [];
        setValues(loadValues, parameters, loadHistory);
        let today = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
        loadDate = loadDate.concat(`,${today}`);
        localStorage.setItem(datesKey, loadDate);
        let label = `${localStorage.getItem(historyKey).split(',').length - 1}.`;
        addHistoryItem(label, value, today);
        setAlert(alertLabels[5], classes[1], icons.check);
    }
    displayAlert(alerts[1]);
    addInput.value = '';
}

const commands = [save, reset, count];
for (let i = 0; i < commands.length; i ++) {
    buttons[i].addEventListener('click', commands[i]);
}
const saveEnterHandler = e => {
    if (e.key === 'Enter') {
        save();
    }
}
const countEnterHandler = e => {
    if (e.key === 'Enter') {
        count();
    }
}
document.addEventListener('keydown', saveEnterHandler);

const settings = localStorage.getItem(settingsKey).split(',');
const history = localStorage.getItem(historyKey).split(',');
const dates = localStorage.getItem(datesKey).split(',');
let isSaveEnabled = settings[4] === undefined || settings[4] === 'enabled' ? true : false;
if (!isSaveEnabled) {
    for (let i = 0; i < settingsInputs.length; i ++) {
        if (i < 2) {
            settingsInputs[i].value = capitalize(settings[i]);
        } else {
            settingsInputs[i].value = settings[i];
        }
        settingsInputs[i].setAttribute('disabled', true);
    }
    buttons[0].setAttribute('disabled', true);
    buttons[1].removeAttribute('disabled');
    buttons[2].removeAttribute('disabled');
    iterationSpan.textContent = `${capitalize(settings[1])} count:`
    const values = [];
    setValues(values, settings, history.join(','));
    history.shift();
    dates.shift();
    for (let i = 0; i < history.length; i ++) {
        addHistoryItem(`${i + 1}.`, history[i], dates[i]);
    }
    document.removeEventListener('keydown', saveEnterHandler);
    document.addEventListener('keydown', countEnterHandler);
}