/* eslint-env node, browser */
import { skipWaiting, clientsClaim } from "workbox-core";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";

import localforage from "localforage";
import { processHtml } from "./process/html";
import { processJS } from "./process/js";
import { processCSS } from "./process/css";
import { processJSON } from "./process/json";

if (process.env.NODE_ENV === "production") {
  registerRoute(
    /^_next/,
    new CacheFirst({
      cacheName: "_next"
    })
  );
  setDefaultHandler(new NetworkFirst());
}

registerRoute(/https:\/\/cdn\.skypack\.dev\/-\//, new CacheFirst());

registerRoute(
  ({ url, request }) => {
    // request.referrer
    if (url.searchParams.has("sw") || request.referrer.indexOf("?sw") > -1) {
      return {};
    }
  },
  async ctx => {
    const { url, request } = ctx;
    const fs = await localforage.getItem("fs");
    const pathname = url.pathname.replace(/^\/-/, "");
    const file = fs[pathname];

    if (!file || file.content == null) {
      return new Response("", {
        status: 404
      });
    }
    // console.log(url, request, fs, pathname);

    if (request.destination === "iframe") {
      return new Response(processHtml(file.content), {
        status: 200,
        headers: { "Content-Type": "text/html" }
      });
    }

    if (request.destination === "script") {
      let content = "";
      if (pathname.endsWith(".css")) {
        content = processCSS(file.content, pathname, true);
      } else if (pathname.endsWith(".json")) {
        content = processJSON(file.content, true);
      } else if (pathname.endsWith(".js") || pathname.endsWith(".jsx")) {
        const deps = await localforage.getItem("dependencies");
        content = processJS(file.content, deps);
      }

      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8"
        }
      });
    }

    if (request.destination === "style") {
      const content = processCSS(file.content, pathname, false);
      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": "text/css; charset=utf-8"
        }
      });
    }

    return new Response("", {
      status: 500,
      headers: { "Content-Type": "text/html" }
    });
  }
);

skipWaiting();
clientsClaim();
