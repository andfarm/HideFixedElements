(function() {
    var active = false,
        firstRun = false,
        css_injected = false,
        elements_hidden = false,
        uuid = "FCFB2A52_C7DC_4B44_B242_0DC15B13CA12",
        timeout = 0;

    if (window[uuid]) {
        console.warn("HideFixedElements: already injected!");
        return;
    }
    window[uuid] = "present";

    function activate() {
        if (!css_injected) {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(
                "." + uuid + " { opacity: 0 !important; transition: opacity 500ms !important; }"
            ));
            document.head.appendChild(style);
            css_injected = true;
        }
        active = true;
        firstRun = true;
        checkFixedElements();
    }

    function deactivate() {
        unhideFixedElements();
        active = false;
    }

    function hideFixedElements() {
        console.info("HideFixedElements: hiding");
        var elems = document.getElementsByTagName("*");
        for (var i = 0; i < elems.length; i++) {
            var e = elems[i];
            if (e.classList.contains(uuid))
                continue;
            var style = window.getComputedStyle(e);
            if (style.position == "fixed" || style.position == "sticky") {
                e.classList.add(uuid);
                elements_hidden = true;
            }
        }
        if (firstRun && !elements_hidden) {
            alert("Couldn't find anything to hide on this page!");
            active = false;
        }
        firstRun = false;
    }

    function unhideFixedElements() {
        console.info("HideFixedElements: unhiding");
        var elems = document.getElementsByClassName(uuid);
        for (var i = elems.length - 1; i >= 0; i--)
            elems[i].classList.remove(uuid);
        elements_hidden = false;
    }

    function checkFixedElements() {
        timeout = 0;
        if (active)
            hideFixedElements();
        else
            unhideFixedElements();
    }

    window.addEventListener("scroll", function() {
        if (active && !timeout)
            timeout = window.setTimeout(checkFixedElements, 250);
    });

    chrome.runtime.onMessage.addListener(function(msg) {
        if (msg === uuid + ":toggle") {
            if (!active)
                activate();
            else
                deactivate();
        }
    });
})();
