
var intervals = [];
const newIntervalFormWrapperEl = document.getElementById("new-interval-form-wrapper");
const newIntervalFormEl = document.getElementById("new-interval-form");
const newIntervalSubmitEl = document.getElementById("new-interval-submit-button");
const newIntervalRestoreEl = document.getElementById("new-interval-restore-button");
const intervalsListEl = document.getElementById("intervals-list");

deleteIntervalClicked = (event) => {
  const intervalID = event.currentTarget.dataset.intervalid;
  const intervalIndex = intervals.findIndex(({ id }) => id === parseInt(intervalID));
  if (intervalIndex >= 0) {
    intervals.splice(intervalIndex, 1);
    saveIntervals();
    reloadIntervalsEls();
  } else {
    console.log("interval with id ", intervalID, " not found");
  }
}

editIntervalClicked = (event) => {
    const intervalID = event.currentTarget.dataset.intervalid;
    const interval = intervals.find(({ id }) => id === parseInt(intervalID));
    if (interval) {
      const nameEl = document.getElementById("new-interval-name");
      const secondsEl = document.getElementById("new-interval-seconds");
      const repeatEl = document.getElementById("new-interval-repeats");
      nameEl.value = interval.iName;
      secondsEl.value = interval.seconds;
      repeatEl.value = interval.repeat;
      const iID = interval.id;
      // show the interval editor (i.e. tne new interval form with the fields filled in)
      newIntervalFormEl.dataset.intervalid = interval.id

      document.querySelector('#newIntervalCollapse').classList.add("show");
    } else {
      console.log("interval not found");
    }
}

addIntervalButton = (interval) => {
    const intervalButtonEl = document.createElement("button");
    intervalButtonEl.classList.add("col-7", "btn", "btn-primary", "btn-sm");
    intervalButtonEl.textContent = interval.iName;
    intervalButtonEl.type = "button";
    intervalButtonEl.dataset.intervalid = interval.id;
    intervalButtonEl.addEventListener("click", editIntervalClicked);
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pencil", "mt-1");
    intervalButtonEl.appendChild(editIcon);

    return intervalButtonEl;
}

addIntervalDeleteButton = (interval) => {
  const intervalDeleteButtonEl = document.createElement("button");
  intervalDeleteButtonEl.classList.add("col-1", "btn", "btn-danger", "btn-sm");
  intervalDeleteButtonEl.type = "button";
  intervalDeleteButtonEl.dataset.intervalid = interval.id;
  intervalDeleteButtonEl.addEventListener("click", deleteIntervalClicked);
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can", "mt-1");
  intervalDeleteButtonEl.appendChild(deleteIcon);

  return intervalDeleteButtonEl;
}

addIntervalEl = (interval) => {
    const intervalEl = document.createElement("div");
    intervalEl.value = interval.id;
    intervalEl.classList.add("row", "mb-3", "existing-interval");
    const intervalNameEl = addIntervalButton(interval);
    const intervalSecondsEl = document.createElement("div");
    intervalSecondsEl.classList.add("col-2");
    intervalSecondsEl.textContent = interval.seconds;
    const intervalRepeatEl = document.createElement("div");
    intervalRepeatEl.classList.add("col-2");
    intervalRepeatEl.textContent = interval.repeat;
    const intervalDeleteEl = addIntervalDeleteButton(interval);
    intervalEl.appendChild(intervalNameEl);
    intervalEl.appendChild(intervalSecondsEl);
    intervalEl.appendChild(intervalRepeatEl);
    intervalEl.appendChild(intervalDeleteEl);
    intervalsListEl.appendChild(intervalEl);
}

loadIntervals = () => {
    retrieveIntervals();
    intervals.forEach( (interval) => { addIntervalEl(interval); });
}

reloadIntervalsEls = () => {
  while (intervalsListEl.firstChild) {
      intervalsListEl.removeChild(intervalsListEl.firstChild);
  }

  intervals.forEach( (interval) => { addIntervalEl(interval); });
}

retrieveIntervals = () => {
    intervals = JSON.parse(localStorage.getItem("CustomIntervalsIntervals") || "[]");
}

saveIntervals = () => {
    intervals.sort((a, b) => a.iName.localeCompare(b.iName));
    localStorage.setItem("CustomIntervalsIntervals", JSON.stringify(intervals));
}

restoreInterval = (interval) => {
  const nameEl = document.getElementById("new-interval-name");
  const secondsEl = document.getElementById("new-interval-seconds");
  const repeatEl = document.getElementById("new-interval-repeats");
  nameEl.value = interval.iName;
  secondsEl.value = interval.seconds.length > 0 ? interval.seconds : secondsEl.placeholder;
  repeatEl.value = interval.repeat.length > 0 ? interval.repeat : repeatEl.placeholder;
  newIntervalFormEl.dataset.intervalid = interval.id;
}

newIntervalRestoreExisting = (intervalID) => {
  const interval = intervals.find(({ id }) => id === parseInt(intervalID));
  restoreInterval(interval);
}


newIntervalRestoreToNew = () => {
  restoreInterval({id: 'new', iName: '', seconds: '', repeat: ''})
}

function getUniqueIntervalID() {
  if (intervals.length > 0) {
    const theIDs = intervals.map(x => x.id);
    const maxID = Math.max(...theIDs);
    return maxID + 1;
  } else {
    return 1;
  }
}

function newIntervalSave() {
    const nameEl = document.getElementById("new-interval-name");
    const iName = nameEl.value;
    const secondsEl = document.getElementById("new-interval-seconds");
    const seconds = secondsEl.value;
    const repeatEl = document.getElementById("new-interval-repeats");
    const repeat = repeatEl.value;
    const iDataID = newIntervalFormEl.dataset.intervalid;
    let iID;
    if (iDataID === undefined || iDataID === null || iDataID === "new") {
      iID = getUniqueIntervalID();
    } else {
      iID = parseInt(iDataID);
      // remove the old interval from the array
      const intervalIndex = intervals.findIndex(({ id }) => id === iID);
      intervals.splice(intervalIndex, 1);
    }
    
    const interval = { id: iID, iName, seconds, repeat };
    
    intervals.push(interval);
    saveIntervals();

    reloadIntervalsEls();

    newIntervalRestoreToNew();

    // playSound();
}

newIntervalRestoreClicked = (event) => {
  const iDataID = newIntervalFormEl.dataset.intervalid;
  if (iDataID === undefined || iDataID === null || iDataID === "new") {
    newIntervalRestoreToNew();
  } else {
    newIntervalRestoreExisting(iDataID);
  }
}

playSound = () => {
    let context = new AudioContext();

    const beep = (freq = 520, duration = 200, vol = 100) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        oscillator.frequency.value = freq;
        oscillator.type = "square";
        gain.connect(context.destination);
        gain.gain.value = vol * 0.01;
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration * 0.001);
    }

    beep();
}

formSubmitted = (event) => {
    console.log("form submitted");

    if (!newIntervalFormEl.checkValidity()) {
        console.log("form NOT VALID");
        newIntervalFormEl.classList.add('was-validated')
        event.preventDefault()
        event.stopPropagation()
    } else {
        newIntervalSave();

        // Make the accordion stay open and be ready to create a new interval
        newIntervalFormEl.classList.remove('was-validated')
        event.preventDefault()
        event.stopPropagation()
  }
  }

// document.querySelector('#noisebutton').addEventListener('click', playSound);

newIntervalRestoreEl.addEventListener("click", newIntervalRestoreClicked);
newIntervalFormEl.addEventListener("submit", formSubmitted);

loadIntervals();

