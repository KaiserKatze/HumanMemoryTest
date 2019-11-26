

// @see: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var row = 5;
var col = 5;
var countdown = 5000; // 5000 milliseconds, by default
var size = row * col; // number of grids in the game board
var isGameInit = false;
var isGameStarted = false;
var isGameFailed = false;
var clickCounter = 0;
var hdlTimeout = null;

// html models
var elDivRows = null;
var elDivGrids = null;
var elDivBox = null;
var elDivBtn = null;
var elDivMsg = null;

function getInputValue(nodeInput) {
    return parseInt(nodeInput.value);
}

var arr = null;
var clicked = null;

function resetRule() {
    var inputRow = document.getElementById("row");
    var inputCol = document.getElementById("col");

    function updateSize() {
        console.log("Size updated ...");

        row = getInputValue(inputRow);
        col = getInputValue(inputCol);
        size = row * col;

        console.log("New width: " + col);
        console.log("New height: " + row);

        // new array
        arr = new Array(size);
        for (var i = 0; i < size;) {
            arr[i] = ++i;
        }
    
        clicked = new Array(size);

        renderHtml();
    }

    inputRow.onchange = inputCol.onchange = updateSize;
    updateSize();
}

// render html
function renderHtml() {
    console.log("Rendering HTML (width: " + col + ", height: " + row + ") ...");

    var elDivsContainer = document.getElementsByClassName("container");
    if (elDivsContainer) {
        var elDivContainer = elDivsContainer[0];

        if (elDivBox) {
            elDivContainer.removeChild(elDivBox);
        }
        elDivBox = document.createElement("div");
        elDivBox.className = "box";
        elDivContainer.appendChild(elDivBox);

        elDivRows = new Array();
        elDivGrids = new Array();

        for (var i = 0; i < row; i++) {
            var elDivRow = document.createElement("div");
            elDivRows.push(elDivRow);

            elDivRow.className = "row";

            for (var j = 0; j < col; j++) {
                var elDivGrid = document.createElement("div");
                elDivGrids.push(elDivGrid);
                
                elDivGrid.className = "col";
                elDivGrid.setAttribute("data-row", "" + i);
                elDivGrid.setAttribute("data-col", "" + j);

                var val = "" + arr[i * col + j];
                elDivGrid.setAttribute("data-value", val);
                elDivGrid.innerHTML = val;
                console.log("Grid (" + j + ", " + i + ") => " + val);
                
                elDivRow.appendChild(elDivGrid);

                elDivGrid.onclick = function() {
                    var x = this.getAttribute("data-col");
                    var y = this.getAttribute("data-row");
                    var v = this.getAttribute("data-value");
                    console.log("Clicked grid (" + x + ", " + y + ") = " + v + "!");
                    if (isGameStarted && !isGameFailed) {
                        // after button "Start" is clicked and 'countdown' is finished
                        // before the player fails in the game

                        // if the grid is already clicked
                        // ignore the event
                        var index = x + col * y;
                        if (clicked[index])
                            return;
                        clicked[index] = true;

                        // increase the counter
                        // VITAL
                        // used to validate if the player
                        // clicks hidden numbers in correct order
                        // that is, from 1 to `size`
                        ++clickCounter;

                        // show number
                        this.classList.remove("hide");
                        // show red number if failed
                        if (v != clickCounter) {
                            // failure
                            elDivMsg.innerHTML = "You failed. Please restart!";
                            // style class
                            this.classList.add("failure");
                            isGameFailed = true;

                            //setTimeout(resetGame, 1000);
                        } else {
                            this.classList.add("success");
                        }
                    }
                };
            }

            elDivBox.appendChild(elDivRow);
        }
    }

    elDivBtn = document.getElementById("start");

    elDivBtn.onclick = function() {
        console.log("Clicked button: start!");

        // stop timeout
        if (hdlTimeout) {
            clearTimeout(hdlTimeout);
        }
        // clear message
        elDivMsg.innerHTML = "";

        if (isGameInit) {
            // on clicking "Stop" button
            elDivBtn.innerHTML = "Start";
        } else {
            // on clicking "Start" button
            isGameInit = true;
            elDivBtn.innerHTML = "Stop";
            resetGame();
            hdlTimeout = setTimeout(startGame, countdown); // count down 1 second
        }
    };

    elDivMsg = document.getElementById("message");
}

function cleanFlag(flag) {
    for (var i = 0; i < elDivGrids.length; i++) {
        elDivGrids[i].classList.remove(flag);
    }
}

function cleanFlags() {
    cleanFlag("failure");
    cleanFlag("success");
    cleanFlag("hide");
}

function resetGame() {
    // shuffle array
    shuffle(arr);

    // reset click flag
    for (var i = 0; i < size; i++) {
        clicked[i] = false;
    }

    for (var i = 0; i < elDivGrids.length; i++) {
        var val = "" + arr[i];
        elDivGrids[i].innerHTML = val;
        elDivGrids[i].setAttribute("data-value", val);
    }

    cleanFlags();

    elDivBtn.innerHTML = "Start";

    isGameInit = false;
    isGameStarted = false;
    isGameFailed = false;
    clickCounter = 0;
    hdlTimeout = null;
}

function startGame() {
    isGameStarted = true;
    hideNumbers();
}

function hideNumbers() {
    for (var i = 0; i < row * col; i++) {
        elDivGrids[i].classList.add("hide");
    }
}

function detectLanguage() {
    // @see: https://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
    var language = window.navigator.userLanguage || window.navigator.language;
    console.log("Try to localise the game ...");
    if (language) {
        // Chinese localisation
        if (language.startsWith("zh")) {
            for (var el of document.getElementsByClassName("lang-en")) {
                el.classList.add("hidden");
            }
            for (var el of document.getElementsByClassName("lang-zh")) {
                el.classList.remove("hidden");
            }
        }
        // add other localisations below and in HTML
    }
}