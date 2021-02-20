
// constants of cookies name
const
    flcFontSize = "fcFontSize",
    accFontSize = "acFontSize",
    tqcFontSize = "tqFontSize",
    bgcColor = "bgColor";

// Loading css
var cssId = 'mainCss';
if (!document.getElementById(cssId)) {
    var link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/styles.css?v=' + Math.floor(Math.random() * 99);
    link.media = 'all';
    document.querySelector("head").appendChild(link);
}

function cookieExists(cookieName) {
    if (document.cookie.split(';').
        some((item) => item.trim().startsWith(cookieName + '='))) {
        return true;
    }
    return false;
}

function getCookie(cookieName) {
    //console.log("Get " + document.cookie)
    var i, cookie, result = "";
    cookie = document.cookie.split(';');
    for (i = 0; i < cookie.length; i++) {
        if (cookie[i].indexOf(cookieName) > -1) {
            result = cookie[i].split("=")[1];
            break;
        }
    }
    return result;
}

function setCookie(cookieName, value, expired = false) {
    var expires = "Thu, 31 Dec 2099 20:00:00 UTC";
    if (expired) {
        expires = "Thu, 01 Jan 1970 00:00:00 GMT";
    }
    var cookie = cookieName + "=" + value + ";expires=" + expires + ";path=/; SameSite=None; Secure"
    document.cookie = cookie
    console.log("Set " + document.cookie);
}

function loadSettings() {
    if (
        cookieExists(flcFontSize) ||
        cookieExists(accFontSize) ||
        cookieExists(accFontSize) ||
        cookieExists(tqcFontSize) ||
        cookieExists(bgcColor)
    ) {
        var acc = document.getElementsByClassName("accordion");
        for (i = 0; i < acc.length; i++) {
            acc[i].style.fontSize = getCookie(accFontSize);
            acc[i].style.color = getCookie(bgcColor);
            acc[i].style.backgroundColor = invertColor(getCookie(bgcColor), false);
        }
        var myInput = document.getElementById("myInput");
        myInput.style.fontSize = getCookie(flcFontSize);
        var t_qosida = document.getElementsByClassName("t_qosida");
        for (i = 0; i < t_qosida.length; i++) {
            t_qosida[i].style.fontSize = getCookie(tqcFontSize);
            t_qosida[i].style.backgroundColor = getCookie(bgcColor);
            t_qosida[i].style.color = invertColor(getCookie(bgcColor));
        }
    }
}

function showClear() {
    if (document.getElementById("myInput").value.length > 0) {
        document.getElementById("clearButt").style.visibility = '';
    }
}

function hideClear() {
    document.getElementById("clearButt").style.visibility = 'hidden';
}

function clearInput() {
    document.getElementById("myInput").value = '';
    hideClear();
    filterTables();
    document.getElementById("myInput").focus();
    document.getElementById("myInput").onkeyup();
}

function fetchQosida(id, title, nash, bSplitter = "") {
    document.getElementById("accord" + id.toString()).innerHTML = title;
    var table = document.createElement("table");
    table.setAttribute("class", "t_qosida");
    table.id = "t_qosida" + id.toString();
    var lines = nash.split("\n");
    var tr, td, idBait = 1;
    for (var i = 0; i < lines.length; i++) {
        tr = document.createElement("tr");
        if (bSplitter !== "") {
            //Data cleansing
            var line =
                lines[i].substring(lines[i].indexOf("\t") + 1, lines[i].length - (id.toString().length + 1)).trim();
            if (line.indexOf(bSplitter) > -1) {
                var tdsplit = line.split(bSplitter);
                td = document.createElement("td");
                td.innerHTML = +tdsplit[1].indexOf("---") > -1 ? "" : idBait++;//
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = tdsplit[0];
                if (tdsplit[1].indexOf("---") > -1 && tdsplit[0].indexOf("---") < 0) {//Not a part of qosida
                    td.colSpan = 3;
                    tr.appendChild(td);
                } else {
                    tr.appendChild(td);
                    td = document.createElement("td");
                    td.innerHTML = "##";
                    tr.appendChild(td);
                    td = document.createElement("td");
                    td.innerHTML = tdsplit[1];
                    tr.appendChild(td);
                }
            } else {
                td = document.createElement("td");
                td.colSpan = 4;
                td.innerHTML = lines[i];
                tr.appendChild(td);
            }
        } else {
            td = document.createElement("td");
            td.innerHTML = lines[i];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    var trRef = document.createElement("tr");
    var tdRef = document.createElement("td");
    tdRef.colSpan = 4;
    ref = document.createElement("a");                 // Create a reference to node
    ref.href = "#accord" + id.toString();
    ref.innerHTML = "عودة إلى رأس القصيدة";
    tdRef.appendChild(ref);
    trRef.appendChild(tdRef);
    table.appendChild(trRef);
    document.getElementById("panel" + id.toString()).appendChild(table);
}

var i;

// Generate accordion containers begins
for (i = 0; i < 96; i++) { //tq000.txt - tq095.txt
    // Create accordion buttons
    var node = document.createElement("button");                 // Create a <buttons> node
    node.setAttribute("class", "accordion");
    node.id = "accord" + i.toString();
    node.innerHTML = "Qosida " + i.toString();
    document.body.appendChild(node);

    // Create accordion containers
    node = document.createElement("div");                 // Create a <div> node
    node.setAttribute("class", "panel");
    node.id = "panel" + i.toString();
    document.body.appendChild(node);

    // Load accordion contents
    var idQosida = i < 10 ? "0" : "";
    node = document.createElement("script");
    node.src = "data/tq0" + idQosida + i.toString() + ".js";
    document.body.appendChild(node);

}
// Generate accordion containers ends

var acc = document.getElementsByClassName("accordion");


for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

//Get the toTop button
var mybutton = document.getElementById("toTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function normalize_text(text) {

    //remove special characters
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');

    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');

    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
        text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    }

    return text;
}

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function appendWorker(id) {
    var script = document.createElement("script");
    script.type = "javascript/worker";
    script.innerHTML = `
self.addEventListener('message', function (e) {
    function normalize_text(text) {

        //remove special characters
        text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
    
        //normalize Arabic
        text = text.replace(/(آ|إ|أ)/g, 'ا');
        text = text.replace(/(ة)/g, 'ه');
        text = text.replace(/(ئ|ؤ)/g, 'ء')
        text = text.replace(/(ى)/g, 'ي');
    
        //convert arabic numerals to english counterparts.
        var starter = 0x660;
        for (var i = 0; i < 10; i++) {
            text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
        }
    
        return text;
    }
    var data = e.data, filter, i, j, k, invisble;
    filter = normalize_text(data.filter);
    tba = data.tba;
    var display = new Array(tba.length);
    //scope = data.scope;
    for (j = 0; j < tba.length; j++) {
        display[j] = new Array(tba[j].length)
        for (i = 0; i < tba[j].length; i++) {
            invisible = true;
            for (k = 0; k < tba[j][i].length; k++) {
                var td = normalize_text(tba[j][i][k]);
                if (td.indexOf(filter) > -1) {
                    display[j][i] = "block";
                    invisible = false;
                    break;
                }
            }
            if (invisible) {
                display[j][i] = "none"; 
            }
        }
    }
    self.postMessage(display);
    self.close();

}, false);
`;
    script.id = id;
    document.body.appendChild(script);
}

appendWorker("worker1");

function filterTables() {
    var input, filter, table, tagle, tr, tgr, td, tgd, i, j, k, txtValue;
    input = document.getElementById("myInput");

    // Only arabic letters
    if (input.value.search(/[a-zA-Z0-9]/g, "") > -1) {
        input.value.replace(/[a-zA-Z0-9]/g, "");
    };

    //console.log("setting up worker...");
    function doFilter(workerName) {
        //prepare the data

        //console.log("preparing data...");
        table = document.getElementsByClassName("t_qosida");
        var tba = new Array(table.length);
        for (j = 0; j < table.length; j++) {
            tr = table[j].getElementsByTagName("tr");
            tba[j] = new Array(tr.length);
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td");
                tba[j][i] = new Array(td.length);
                for (k = 0; k < td.length; k++) {
                    tba[j][i][k] = td[k].textContent || td[k].innerText;
                }
                //console.log("tba:" + i + "-"+j + " count=" + tba[j].length);
            }
        }

        var blob = new Blob([document.querySelector(workerName).textContent]);
        var worker = new Worker(window.URL.createObjectURL(blob));
        //console.log("sending data...");
        var msg = JSON.parse(JSON.stringify({
            'filter': input.value,
            'tba': tba,
        }));
        worker.postMessage(msg);

        //console.log("receiving data...");
        worker.addEventListener('message', function (e) {
            var display = e.data;
            //console.log("worker " + parts + " begin");
            table = document.getElementsByClassName("t_qosida");
            //console.log("processing data...");
            for (j = 0; j < table.length; j++) {
                //console.log("display[j=", j, "]: ", display[j]);
                var hidden = 0;
                tr = table[j].getElementsByTagName("tr");
                for (i = 0; i < tr.length; i++) {
                    //console.log("display[j-i=", j, "-", i, "]: ", display[j][i]);
                    if (display[j][i] != "none")
                        tr[i].style.display = ""; else {
                        tr[i].style.display = display[j][i];
                        hidden++;
                    }
                }
            }
            filterAccord();
            //console.log("worker " + parts + " end");
        }, false);
    }

    //console.log("start working...");
    doFilter("#worker1");
}

function filterAccord() {
    var i, tagle, accord, Continue;
    tagle = document.getElementsByTagName("table");
    for (j = 0; j < tagle.length; j++) {
        accord = document.getElementById("accord" + (j).toString());
        accord.style.display = "";
        Continue = false;
        table = tagle[j];
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            if (tr[i].style.display !== "none") {
                Continue = true;
                break;
            }
        }
        if (Continue) {
            continue;
        }
        accord.style.display = "none"
    }
}

function getFontSize(el) {
    var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
    return parseFloat(style);
}

function changeFontSize(chgBy) {
    var i, tmpCookie, accord = document.getElementsByClassName("accordion");
    for (i = 0; i < accord.length; i++) {
        accord[i].style.fontSize = (getFontSize(accord[i]) + chgBy).toString() + "px";
        tmpCookie = accord[i].style.fontSize;
    }
    setCookie(accFontSize, tmpCookie);

    var myInput = document.getElementById("myInput");
    myInput.style.fontSize = (getFontSize(myInput) + chgBy).toString() + "px";
    setCookie(flcFontSize, myInput.style.fontSize);

    var t_qosida = document.getElementsByClassName("t_qosida");
    for (i = 0; i < t_qosida.length; i++) {
        t_qosida[i].style.fontSize = (getFontSize(t_qosida[i]) + chgBy).toString() + "px";
        tmpCookie = t_qosida[i].style.fontSize;
    }
    setCookie(tqcFontSize, tmpCookie);
}

function invertColor(hex, bw = true) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function changeColor() {
    var i,
        t_qosida = document.getElementsByClassName("t_qosida"),
        accord = document.getElementsByClassName("accordion");
    for (i = 0; i < t_qosida.length; i++) {
        t_qosida[i].style.backgroundColor = document.getElementById("khColor").value;
        t_qosida[i].style.color = invertColor(document.getElementById("khColor").value);
    }

    for (i = 0; i < accord.length; i++) {
        accord[i].style.color = document.getElementById("khColor").value;
        accord[i].style.backgroundColor = invertColor(document.getElementById("khColor").value, false);
    }
    setCookie(bgcColor, document.getElementById("khColor").value);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

loadSettings();
