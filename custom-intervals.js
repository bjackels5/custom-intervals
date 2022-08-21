
var intervals = [];
const newIntervalFormWrapperEl = document.getElementById("new-interval-form-wrapper");
const newIntervalFormEl = document.getElementById("new-interval-form");
const newIntervalSubmitEl = document.getElementById("new-interval-submit-button");
const newIntervalRestoreEl = document.getElementById("new-interval-restore-button");
const intervalsListEl = document.getElementById("intervals-list");

editIntervalClicked = (event) => {
    const buttonID = event.target.id;
    console.log("editIntervalClicked buttonID:", buttonID);
    const intervalID = parseInt(getIntervalIDFromButtonID(buttonID));
    console.log("editIntervalClicked intervalID:", intervalID);
    console.log("edit the interval:", intervalID);
    const interval = intervals.find(({ id }) => id === intervalID);
    if (interval) {
      const nameEl = document.getElementById("new-interval-name");
      const secondsEl = document.getElementById("new-interval-seconds");
      const repeatEl = document.getElementById("new-interval-repeats");
      console.log("interval:", interval);
      nameEl.value = interval.iName;
      secondsEl.value = interval.seconds;
      repeatEl.value = interval.repeat;
      const iID = interval.id;
      // show the interval editor (i.e. tne new interval form with the fields filled out)
      newIntervalFormEl.dataset.intervalid = interval.id
      console.log ("editIntervalClicked intervalid:", newIntervalFormEl.dataset.intervalid);

      document.querySelector('#newIntervalCollapse').classList.add("show");
    } else {
      console.log("interval not found");
    }
}

addIntervalButton = (interval) => {
    let intervalButtonEl = document.createElement("button");
    intervalButtonEl.classList.add("col", "btn", "btn-primary", "btn-sm");
    intervalButtonEl.textContent = interval.iName;
    intervalButtonEl.type = "button";
    intervalButtonEl.id = "interval-button-" + interval.id;
    intervalButtonEl.addEventListener("click", editIntervalClicked);
    return intervalButtonEl;
};

getIntervalIDFromButtonID = (buttonID) => {
    // strip out 'interval-button-"
    let len = "interval-button-".length;
    console.log("interval ID:", buttonID.slice(len));
    return buttonID.slice(len)
}

addIntervalEl = (interval) => {
    const intervalEl = document.createElement("div");
    intervalEl.value = interval.id;
    intervalEl.classList.add("row", "mb-3", "existing-interval");
    const intervalNameEl = addIntervalButton(interval);
    const intervalSecondsEl = document.createElement("div");
    intervalSecondsEl.classList.add("col");
    intervalSecondsEl.textContent = interval.seconds;
    const intervalRepeatEl = document.createElement("div");
    intervalRepeatEl.classList.add("col");
    intervalRepeatEl.textContent = interval.repeat;
    intervalEl.appendChild(intervalNameEl);
    intervalEl.appendChild(intervalSecondsEl);
    intervalEl.appendChild(intervalRepeatEl);
    intervalsListEl.appendChild(intervalEl);
}

loadIntervals = () => {
    retrieveIntervals();
    console.log("localStorage intervals length:", intervals.length, ", intervals:", intervals);

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
newIntervalFormEl.addEventListener("submit", formSubmitted)

loadIntervals();

