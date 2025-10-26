const buildTranslateUrl = (url, target = navigator.language || "ja") => {
    const tl = target.split("-")[0]; // "ja-JP" -> "ja"
    const u = encodeURIComponent(url);
    return `https://translate.google.com/translate?sl=auto&tl=${tl}&u=${u}`;
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "open-via-gt",
        title: "Google翻訳でこのページを開く",
        contexts: ["page", "selection", "frame", "link"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id || !tab?.url) return;
    const targetUrl = buildTranslateUrl(tab.url);
    chrome.tabs.update(tab.id, { url: targetUrl });
});

chrome.action.onClicked.addListener(async (tab) => {
    if (!tab?.id || !tab?.url) return;
    const targetUrl = buildTranslateUrl(tab.url);
    chrome.tabs.update(tab.id, { url: targetUrl });
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command !== "open-via-gt") return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab?.url) return;
    const targetUrl = buildTranslateUrl(tab.url);
    chrome.tabs.update(tab.id, { url: targetUrl });
});
