const intercept = `
var origin_console_log = console.log;
console.log = function() {
  origin_console_log.apply(this, arguments)
  var output = Array.from(arguments).join(" ")
  top.postMessage({method: "CONSOLE_MESSAGE", type: "log", value: output}, top.location.origin)
}
window.addEventListener('error', function (event) {
  top.postMessage({method: "CONSOLE_MESSAGE", type: "error", value: event.message}, top.location.origin)
})
window.addEventListener('message', function(e) {
  const data = e.data;
  if (data.method === 'PAGE_RELOAD') {
    window.location.reload(true)
  }
})
`;

export const processHtml = content => {
  return `
  <!doctype html>
  <html>
<head>
<script>${intercept}</script>
</head>
<body>
${content}
</body>
</html>
  `;
};
