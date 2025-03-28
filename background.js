const uuid = "FCFB2A52_C7DC_4B44_B242_0DC15B13CA12";

browser.action.onClicked.addListener(async (tab) => {
    try {
        let r = await browser.scripting.executeScript({
            func: (id) => window[id],
            args: [uuid],
            target: { tabId: tab.id }
        });
        if (r[0].result !== uuid) {
            await browser.scripting.executeScript({
                files: ["content.js"],
                target: { tabId: tab.id }
            });
        }
        browser.tabs.sendMessage(tab.id, uuid + ":toggle");
    } catch (e) {
        console.error(e);
        browser.action.disable(tab.id);
        browser.action.setBadgeText({
            tabId: tab.id,
            text: "!"
        });
        browser.action.setTitle({
            tabId: tab.id,
            title: "Cannot hide fixed elements on this page"
        });
    }
})
