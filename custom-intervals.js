
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
      alert("editIntervalClicked intervalid:" + JSON.stringify(newIntervalFormEl.dataset.intervalid));


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
    // if (newIntervalRowEl != undefined && newIntervalRowEl != null) {
    //     newIntervalRowEl.remove();

        while (intervalsListEl.firstChild) {
            intervalsListEl.removeChild(intervalsListEl.firstChild);
        }

        intervals.forEach( (interval) => { addIntervalEl(interval); });

        // intervalsListEl.appendChild(newIntervalRowEl);
    // }
}

// var newIntervalClicked = (event) => {
//     console.log("newIntervalClicked event:", event);
//     console.log("event.target.id:", event.target.id);
//     document.getElementById("intervalsCollapse").classList.remove('show');
//     newIntervalFormWrapperEl.classList.remove("invisible");
// }

retrieveIntervals = () => {
    intervals = JSON.parse(localStorage.getItem("CustomIntervalsIntervals") || "[]");
    if (intervals.length > 0) {
        if (intervals[0].id === undefined || intervals[0].id === null) {
            for (let i = 0; i < intervals.length; i++) {
                intervals[i].id = i;
            }
        }
    }
}

saveIntervals = () => {
    intervals.sort((a, b) => a.iName.localeCompare(b.iName));
    console.log("saveIntervals!!!");
    localStorage.setItem("CustomIntervalsIntervals", JSON.stringify(intervals));
}

newIntervalRestore = () => {
    const nameEl = document.getElementById("new-interval-name");
    const secondsEl = document.getElementById("new-interval-seconds");
    const repeatEl = document.getElementById("new-interval-repeats");
    nameEl.value = '';
    secondsEl.value = secondsEl.placeholder;
    repeatEl.value = repeatEl.placeholder;
}

function newIntervalSubmitClicked(event) {
    alert("newIntervalSubmitClicked");

    const nameEl = document.getElementById("new-interval-name");
    const iName = nameEl.value;

    if (iName.length > 0) {
        nameExists = intervals.some((interval) => iName === interval.iName); 
        if (!nameExists) {
            console.log("newIntervalSubmitClicked: form is valid");

            const secondsEl = document.getElementById("new-interval-seconds");
            const seconds = secondsEl.value;
            const repeatEl = document.getElementById("new-interval-repeats");
            const repeat = repeatEl.value;
            const interval = { id: intervals.length, iName, seconds, repeat };
            
            intervals.push(interval);
            saveIntervals();

            reloadIntervalsEls();

            newIntervalRestore();

            // playSound();
        }
        else {
            console.log("name exists!");
            nameEl.classList.add("is-invalid");
        }
    } else {
        console.log("name is required");
        nameEl.classList.add("is-invalid");
    }
}

newIntervalRestoreClicked = (event) => {
    newIntervalRestore();
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
        event.preventDefault()
        event.stopPropagation()
    } else {
        // alert("form valid");

        alert("formSubmitted intervalid:" + JSON.stringify(newIntervalFormEl.dataset.intervalid));

        // How can I get the new/edit interval accordion to stay open. adding "show" to the class
        // list does not seem to work, nor does buttonZ clicking
        document.querySelector('#newIntervalCollapse').classList.add("show");
        // document.querySelector('#newIntervalCollapse').collapse('show');
        // document.querySelector('#buttonZ').click();
  }

    newIntervalFormEl.classList.add('was-validated')
  }

// document.querySelector('#noisebutton').addEventListener('click', playSound);

newIntervalRestoreEl.addEventListener("click", newIntervalRestoreClicked);
newIntervalFormEl.addEventListener("submit", formSubmitted)

loadIntervals();

