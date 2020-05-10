import { CONSOLE_MESSAGE } from "./constant";

const intercept = `
var origin_console_log = console.log;
console.log = function() {
  origin_console_log.apply(this, arguments)
  var output = Array.from(arguments).join(" ")
  top.postMessage({method: "${CONSOLE_MESSAGE}", type: "log", value: output}, top.location.origin)
}
window.addEventListener('error', function (event) {
  top.postMessage({method: "${CONSOLE_MESSAGE}", type: "error", value: event.message}, top.location.origin)
})
`;

const defaultDoc = `
<!doctype html>
<html>
<head>
<script>${intercept}</script>
</head>
<body>
Error, entry template no found!
</body>
</html>
`;

export const makeDoc = (template?: string) => {
  if (!template) {
    return defaultDoc;
  }

  const parser = new DOMParser();

  const doc = parser.parseFromString(template, "text/html");

  const injectScript = document.createElement("script");
  injectScript.appendChild(document.createTextNode(intercept.trim()));

  const head = doc.querySelector("head");
  const body = doc.querySelector("body");

  // inject
  if (head) {
    head.appendChild(injectScript);
  } else if (body) {
    body.insertBefore(injectScript, body.firstChild);
  }

  // transform script and css

  return `<!DOCTYPE html><html>${doc.children[0].innerHTML}</html>`;
};
