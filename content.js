(function () {
    const cleanseElement = (el) => {
        try {
            if (el.nodeType !== Node.ELEMENT_NODE) return;
            // <meta name="google" content="notranslate">
            if (
                el.tagName === "META" &&
                el.getAttribute("name") === "google" &&
                (el.getAttribute("content") || "").toLowerCase().includes("notranslate")
            ) {
                el.parentNode && el.parentNode.removeChild(el);
                return;
            }
            // class="notranslate"
            if (el.classList && el.classList.contains("notranslate")) {
                el.classList.remove("notranslate");
            }
            // translate="no" を許可方向へ
            if (el.getAttribute && el.getAttribute("translate") === "no") {
                el.setAttribute("translate", "yes");
            }
        } catch {}
    };

    const sweepTree = (root) => {
        cleanseElement(root);
        if (root.querySelectorAll) {
            root.querySelectorAll('meta[name="google"][content*="notranslate" i], .notranslate, [translate="no"]')
                .forEach((n) => cleanseElement(n));
        }
    };

    // できるだけ早く <html> を肯定に
    try {
        const html = document.documentElement;
        if (html) {
            if (html.getAttribute("translate") === "no") html.setAttribute("translate", "yes");
            // langが未設定ならそのまま。誤検出を避けるため無理に変更しない
        }
    } catch {}

    // 初回スイープ
    sweepTree(document);

    // 動的変更に追従
    const mo = new MutationObserver((muts) => {
        for (const m of muts) {
            if (m.type === "childList") {
                m.addedNodes && m.addedNodes.forEach((n) => sweepTree(n));
            } else if (m.type === "attributes") {
                cleanseElement(m.target);
            }
        }
    });
    mo.observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "translate", "name", "content"]
    });
})();
