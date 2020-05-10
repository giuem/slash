/* eslint-env node, browser */
import { skipWaiting, clientsClaim } from "workbox-core";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";

import localforage from "localforage";
import { processHtml } from "./process/html";
import { processJS } from "./process/js";

setDefaultHandler(new NetworkFirst());

if (process.env.NODE_ENV === "production") {
  registerRoute(
    /^_next/,
    new CacheFirst({
      cacheName: "_next"
    })
  );
}

registerRoute(/https:\/\/cdn\.pika\.dev\/-\//, new CacheFirst());

registerRoute(
  ({ url }) => {
    if (url.pathname.indexOf("/-/") > -1) {
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
    console.log(url, request, fs, pathname);

    if (request.destination === "iframe") {
      return new Response(processHtml(file.content), {
        status: 200,
        headers: { "Content-Type": "text/html" }
      });
    }

    if (request.destination === "script") {
      return new Response(processJS(file.content), {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8"
        }
      });
    }

    return new Response("", {
      status: 500,
      headers: { "Content-Type": "text/html" }
    });
  }
);

// skipWaiting();
// clientsClaim();
