(() => {
    const uuid = "FCFB2A52_C7DC_4B44_B242_0DC15B13CA12";

    let active = false,
        cooldown = 0,
        timeout = 0;

    if (window[uuid]) {
        console.warn("HideFixedElements: already injected!");
        return;
    }
    window[uuid] = uuid;

    let style = document.createElement("style");
    style.appendChild(document.createTextNode(
        "." + uuid + " { display: none !important; opacity: 0 !important; visibility: hidden !important; }"
    ));
    document.head.appendChild(style);

    function activate() {
        let elems = document.getElementsByTagName("*");
        for (let i = 0; i < elems.length; i++) {
            let e = elems[i];
            if (e.classList.contains(uuid)) {
                continue;
            }
            let style = window.getComputedStyle(e);
            if (style.position == "fixed" || style.position == "sticky") {
                e.classList.add(uuid);
                active = true;
            }
        }
    }

    function deactivate() {
        let elems = document.getElementsByClassName(uuid);
        for (let i = elems.length - 1; i >= 0; i--) {
            elems[i].classList.remove(uuid);
        }
        if (timeout) {
            window.clearTimeout(timeout);
        }
        active = false;
    }

    window.addEventListener("scroll", () => {
        if (active && !timeout) {
            let now = new Date();
            let when = (now - cooldown < 500) ? 250 : 0;
            timeout = window.setTimeout(() => {
                activate();
                timeout = 0;
            }, when);
            cooldown = +now;
        }
    });

    browser.runtime.onMessage.addListener((msg) => {
        if (msg === uuid + ":toggle") {
            if (!active) {
                activate();
                if (!active) {
                    alert("Couldn't find anything to hide on this page!");
                }
            } else {
                deactivate();
            }
        }
    });
})();
