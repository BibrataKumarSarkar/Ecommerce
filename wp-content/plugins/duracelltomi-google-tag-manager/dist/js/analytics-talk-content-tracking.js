"use strict";
"undefined" == typeof console && (window.console = {
        log: function() {}
    }),
    function() {
        var r, a = gtm4wp_scrollerscript_debugmode,
            t = gtm4wp_scrollerscript_callbacktime,
            l = gtm4wp_scrollerscript_readerlocation,
            o = 0,
            i = !1,
            c = !1,
            d = !1,
            m = (new Date).getTime();

        function n() {
            var e, t = window.innerHeight + window.scrollY,
                o = document.body.offsetHeight,
                n = 0;
            l < t && !i && (n = (new Date).getTime(), e = Math.round((n - m) / 1e3), a ? console.log("Started reading " + e) : window[gtm4wp_datalayer_name].push({
                event: "gtm4wp.reading.startReading",
                timeToScroll: e
            }), i = !0), ((null == (e = document.querySelector("#" + gtm4wp_scrollerscript_contentelementid)) ? void 0 : e.scrollTop) || 0) + ((null == (e = document.querySelector("#" + gtm4wp_scrollerscript_contentelementid)) ? void 0 : e.clientHeight) || 0) <= t && !c && (e = (new Date).getTime(), e = Math.round((e - n) / 1e3), a ? console.log("End content section " + e) : window[gtm4wp_datalayer_name].push({
                event: "gtm4wp.reading.contentBottom",
                timeToScroll: e
            }), c = !0), o <= t && !d && (e = (new Date).getTime(), r = Math.round((e - n) / 1e3), a ? (r < gtm4wp_scrollerscript_scannertime ? console.log('The visitor seems to be a "scanner"') : console.log('The visitor seems to be a "reader"'), console.log("Bottom of page " + r)) : (r < gtm4wp_scrollerscript_scannertime ? window[gtm4wp_datalayer_name].push({
                event: "gtm4wp.reading.readerType",
                readerType: "scanner"
            }) : window[gtm4wp_datalayer_name].push({
                event: "gtm4wp.reading.readerType",
                readerType: "reader"
            }), window[gtm4wp_datalayer_name].push({
                event: "gtm4wp.reading.pagebottom",
                timeToScroll: r
            })), d = !0)
        }
        a ? console.log("Article loaded") : window[gtm4wp_datalayer_name].push({
            event: "gtm4wp.reading.articleLoaded"
        }), document.addEventListener("scroll", function(e) {
            o && clearTimeout(o), o = setTimeout(n, t)
        })
    }((window, document));