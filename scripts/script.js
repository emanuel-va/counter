// script.js

// importing modules
import { icons } from './icons.js';
import { Counter } from './counter.js';

// selecting document elements
const headers = document.getElementsByTagName('h2');
const settingsInputs = document.querySelector('.settings').getElementsByTagName('input');
const alerts = document.querySelectorAll('.alert');
const buttons = document.getElementsByTagName('button');
const iterationSpan = document.querySelector('.iteration');
const statisticsSpans = document.querySelector('.statistics').querySelector('.wrapper').getElementsByTagName('span');
const statisticsValues = document.querySelectorAll('.value');
const progressBar = document.querySelector('.bar');
const addInput = document.querySelector('.add-input');
const historyBox = document.querySelector('.history');
const github = document.querySelector('.github');

// setting headers & buttons
const headerLabels = ['Settings', 'Statistics', 'Add', 'History']; // defining labels for headers
const headerIcons = [icons.settings, icons.bars, icons.add, icons.history]; // defining icons for headers
for (let i = 0; i < headers.length; i ++) {
    headers[i].innerHTML = `${headerIcons[i]}<span>${headerLabels[i]}</span>`; // defining format for headers
}
const buttonLabels = ['Save', 'Reset', 'Count']; // defining labels for buttons
const buttonIcons = [icons.save, icons.delete, icons.calculate]; // defining icons for buttons
for (let i = 0; i < buttons.length; i ++) {
    buttons[i].innerHTML = `${buttonIcons[i]}<span>${buttonLabels[i]}</span>`; // defining format for buttons
}
for (let i = 0; i < statisticsSpans.length; i ++) {
    if (i % 2 !== 0) { // selecting only odd indexes
        statisticsSpans[i].style.justifySelf = 'end'; // aligning at right
    }
}
github.innerHTML = `${icons.github}<span>GitHub</>`;

// starting local storage
const settingsKey = 'settings';
const historyKey = 'history';
const datesKey = 'dates';
if (localStorage.getItem(settingsKey) === null || localStorage.getItem(historyKey) === null || localStorage.getItem(datesKey) === null) { // validating if local storage keys exist
    localStorage.setItem(settingsKey, ''); // creating settings key
    localStorage.setItem(historyKey, 0); // creating history key
    localStorage.setItem(datesKey, 0); // creating dates key
}

// defining labels for alerts
const alertLabels = [
    'You must define all settings.',
    'Count target and minimum average must be greater than 0.',
    'Settings were successfuly saved.',
    'Settings were reset, please reload site.',
    'Value must be greater than 0.',
    'Done!'
];

// defining document implicit classes for elements
const classes = [
    'alert--error',
    'alert--done',
    'alert--info',
    'history__item',
    'value-warning',
    'value-ok'
];

// defining functions for internal use
let alertLabel, alertClass, alertIcon; // defining alert items
const setAlert = (label, className, icon) => { // defining a function for set alerts format
    alertLabel = label;
    alertClass = className;
    alertIcon = icon;
}
const displayAlert = (alert) => { // defining a function for display a formatted alert
    alert.innerHTML = `${alertIcon}<span>${alertLabel}</span>`; // displaying alert
    alert.classList.add(alertClass); // adding a class for alert
    setTimeout(() => alert.classList.remove(alertClass), 5000); // setting a timer for removing alert from document after 5 seconds
}
const capitalize = (word) => { // creating a function for turn first leter of a word into capital leter
    return word.charAt(0).toUpperCase().concat(word.slice(1));
}
const setValues = (array, parameters, history) => { // creating a function for define statistics values
    if (localStorage.getItem(historyKey) == 0) { // validating if history is empty
        for (let i = 0; i < statisticsValues.length; i ++) {
            array.push('-'); // if empty, statistics values will be null (-)
        }
    } else {
        const counter = new Counter(parameters[2], parameters[3], history);
        array.push( // if not empty statistics values will be calculated by counter class
            `${counter.calculateTotal().toLocaleString()}`,
            `${counter.calculateRemaining().toLocaleString()}`,
            `${Math.round(counter.calculateAverage()).toLocaleString()}`,
            `${counter.calculateMax().toLocaleString()}`,
            `${counter.calculateMin().toLocaleString()}`,
            `${counter.calculateIterations().toLocaleString()}`,
            `${Math.round(counter.calculatePercentage())}%`
        );
        progressBar.style.width = `${counter.calculatePercentage()}%`; // filling progress bar
        if (counter.calculatePercentage() >= 100) {
            progressBar.style.borderRadius = '0 0 15px 15px';
        }
    }
    for (let i = 0; i < statisticsValues.length; i ++) {
        statisticsValues[i].textContent = array[i]; // displaying values in document
    }
}
const addHistoryItem = (label, value, date) => { // defining a function for adding & displaying items to history section
    if (localStorage.getItem(historyKey) != 0) { // validating if history is not empty
        const item = document.createElement('div'); // creating history item box
        const itemLabel = document.createElement('span'); // creating item counter
        const itemValue = document.createElement('span'); // creating item value
        const itemDate = document.createElement('span'); // creating item save date
        item.classList.add(classes[3]); // adding a class for identify history items
        let itemDataClass = value < localStorage.getItem(settingsKey).split(',')[3] ? classes[4] : classes[5]; // defining item value class as a function of if it is less than setted minimum average
        itemLabel.classList.add(itemDataClass); // adding item label class
        itemLabel.textContent = label; // setting item counter
        itemValue.classList.add(itemDataClass); // adding item value class
        itemValue.textContent = `${Number(value).toLocaleString()} ${localStorage.getItem(settingsKey).split(',')[0]}`; // setting item value
        itemDate.textContent = date; // setting item save date
        const childs = [itemLabel, itemValue, itemDate];
        for (let i = 0; i < childs.length; i ++) {
            item.appendChild(childs[i]); // adding items data to item box
        }
        historyBox.appendChild(item); // adding item box to history
        historyBox.style.display = 'flex'; // showing items
    }
}

// defining document command functions
let loadSettings = []; // defining an array to storage settings for load it to local storage
const save = function() { // defining a function for save settings into local storage
    for (let i = 0; i < settingsInputs.length; i ++) {
        loadSettings.push(settingsInputs[i].value); // adding settings input values into an array
    }
    if (loadSettings.join(',') === ',,,') { // validating if array is empty
        loadSettings = []; // reseting array
        setAlert(alertLabels[0], classes[0], icons.error); // if empty, displaying an alert
    } else {
        if (Number(loadSettings[2]) <= 0 || Number(loadSettings[3]) <= 0) { // validating if numeric inputs values are greater than 0
            loadSettings = [];
            setAlert(alertLabels[1], classes[0], icons.error);
        }
        else if (loadSettings[0] === '' || loadSettings[1] === '') { // validating if alpha inputs are empty
            loadSettings = [];
            setAlert(alertLabels[0], classes[0], icons.error);
        } else { // if fields are ok
            for (let i = 0; i < settingsInputs.length; i ++) {
                if (i < 2) {
                    settingsInputs[i].value = capitalize(loadSettings[i]); // setting capital leter to count & iteration names
                } else {
                    settingsInputs[i].value = loadSettings[i];
                }
                settingsInputs[i].setAttribute('disabled', true); // disabling settings inputs
            }
            iterationSpan.textContent = `${capitalize(loadSettings[1])} count:`; // displaying iteration formatted label
            loadSettings.push('disabled'); // adding save button state to settings
            loadSettings = loadSettings.join(','); // turning settings array into a string
            localStorage.setItem(settingsKey, loadSettings); // adding settings string to local storage
            loadSettings = [];
            buttons[0].setAttribute('disabled', true); // disabling 'save' button
            buttons[1].removeAttribute('disabled'); // enabling 'reset' button
            addInput.removeAttribute('disabled'); // enabling 'add' input
            buttons[2].removeAttribute('disabled'); // enabling 'count' button
            document.removeEventListener('keydown', saveEnterHandler); // removing 'enter' key from 'save' command
            document.addEventListener('keydown', countEnterHandler); // adding 'enter' key to 'count' command
            setAlert(alertLabels[2], classes[1], icons.check);
        }
    }
    displayAlert(alerts[0]); // displaying settings alerts in function of filled input fields
}
const reset = function() { // defining a function for reset all document settings
    for (let i = 0; i < settingsInputs.length; i ++) {
        settingsInputs[i].value = ''; // restarting settings input fields 
        settingsInputs[i].removeAttribute('disabled'); // enabling settings input fields
    }
    localStorage.setItem(settingsKey, ''); // emptying settings
    localStorage.setItem(historyKey, 0); // restarting history to 0
    localStorage.setItem(datesKey, 0); // restarting dates to 0
    buttons[0].removeAttribute('disabled'); // enabling 'save' button
    buttons[1].setAttribute('disabled', true); // disabling 'reset' button
    addInput.setAttribute('disabled', true); // disabling add input
    buttons[2].setAttribute('disabled', true); // disabling 'count' button
    iterationSpan.textContent = ''; // emptying iteration count span
    for (let i = 0; i < statisticsValues.length; i ++) {
        statisticsValues[i].textContent = '-'; // restarting statistics values to -
    }
    progressBar.style.width = '0%'; // emptying progress bar
    const historyItem = document.querySelectorAll(`.${classes[3]}`); // defining current history items elements
    historyBox.style.display = 'none'; // removing history box
    document.addEventListener('keydown', saveEnterHandler); // adding 'enter' key to 'save' command
    document.removeEventListener('keydown', countEnterHandler); // removing 'enter' key from 'count' command
    setAlert(alertLabels[3], classes[2], icons.info);
    displayAlert(alerts[0]);
}
let loadHistory = localStorage.getItem(historyKey); // getting history values from local storage and saving it in a variable
let loadDate = localStorage.getItem(datesKey); // getting dates from local storage and saving it in a variable
const date = new Date();
const count = function() { // defining a function for display all calculated values in document
    let value = Number(addInput.value); // user numeric input
    if (value === 0 || value < 0) { // validating if value is greater than 0
        setAlert(alertLabels[4], classes[0], icons.error);
    } else { // if grater than 0
        loadHistory = loadHistory.concat(`,${value}`); // updating history variable by adding user numeric input value
        localStorage.setItem(historyKey, loadHistory); // updating local storage by adding new history
        const parameters = localStorage.getItem(settingsKey).split(','); // getting settings from local storage and turning it into a array
        parameters.pop(); // removing 'save' button state setting from array
        const loadValues = []; // defining an new array to storage all calculated values
        setValues(loadValues, parameters, loadHistory); // displaying values in document
        let today = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`; // defining a formatted date
        loadDate = loadDate.concat(`,${today}`); // adding a ',' at string start for split multiple dates
        localStorage.setItem(datesKey, loadDate); // saving date into local storage
        let label = localStorage.getItem(historyKey).split(',').length - 1; // defining a label for count iterations
        addHistoryItem(label, value, today); // displaying history items
        setAlert(alertLabels[5], classes[1], icons.check); 
    }
    displayAlert(alerts[1]);
    addInput.value = ''; // emptying 'add' input after 'count' command
}

const commands = [save, reset, count];
for (let i = 0; i < commands.length; i ++) {
    buttons[i].addEventListener('click', commands[i]); // adding commands to buttons
}

// adding enter key to commands
const saveEnterHandler = e => { // defining a function for bind 'enter' key to 'save' command
    if (e.key === 'Enter') { // defining key
        save(); // defining command
    }
}
const countEnterHandler = e => { // defining a function for bind 'enter' key to 'count' command
    if (e.key === 'Enter') { // defining key
        count(); // defining command
    }
}

// adding 'enter' key to 'save' command at reload
document.addEventListener('keydown', saveEnterHandler);

// setting document data & values at reload
const settings = localStorage.getItem(settingsKey).split(','); // getting settings into a variable
const history = localStorage.getItem(historyKey).split(','); // getting history into a variable
const dates = localStorage.getItem(datesKey).split(','); // getting dates into a variable
let isSaveEnabled = settings[4] === undefined || settings[4] === 'enabled' ? true : false; // defining 'save' button state at site reload
if (!isSaveEnabled) { // validating if 'save' button is disabled
    for (let i = 0; i < settingsInputs.length; i ++) {
        if (i < 2) {
            settingsInputs[i].value = capitalize(settings[i]); // displaying count & iteration names in settings input fields at reload
        } else {
            settingsInputs[i].value = settings[i]; // displaying numeric values in settings input fields at reload
        }
        settingsInputs[i].setAttribute('disabled', true); // disabling settings input fields at reload
    }

    // setting button states at site reload
    buttons[0].setAttribute('disabled', true);
    buttons[1].removeAttribute('disabled');
    buttons[2].removeAttribute('disabled');
    iterationSpan.textContent = `${capitalize(settings[1])} count:`; // displaying iteration label at reload
    addInput.removeAttribute('disabled');
    const values = []; // defining an new array to storage all local storage returned values at reload
    setValues(values, settings, history.join(',')); // displaying values in document at reload
    history.shift(); // removing '0' value at start from history array
    dates.shift(); // removing '0' value at start from dates array
    for (let i = 0; i < history.length; i ++) {
        addHistoryItem(i + 1, Number(history[i]), dates[i]); // displaying history items getted from local storage
    }
    document.removeEventListener('keydown', saveEnterHandler); // removing 'enter' key from 'save' command at site reload
    document.addEventListener('keydown', countEnterHandler); // adding 'enter' key to 'count' command at site reload
}