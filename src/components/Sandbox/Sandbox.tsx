import styles from "./Sandbox.module.scss";
import { CONSOLE_MESSAGE } from "./constant";
import Console from "./Console";

const intercept = `
var origin_console_log = console.log;
console.log = function() {
  origin_console_log.apply(this, arguments)
  var output = Array.from(arguments).join(" ")
  top.postMessage({method: "${CONSOLE_MESSAGE}", type: "log", value: output}, top.location.origin)
}
window.addEventListener('error', event => {
  top.postMessage({method: "${CONSOLE_MESSAGE}", type: "error", value: event.message}, top.location.origin)
})
`;

const doc = `
<!doctype html>
<html>
<head>
<script>${intercept}</script>
</head>
<body>
hello world
<script>
for(let i =0; i < 100; i++) console.log(i)

</script>
</body>
</html>
`;

const Sandbox = () => {
  return (
    <div className={styles.Sandbox}>
      <div className={styles.iframe}>
        <iframe srcDoc={doc}></iframe>
      </div>
      <Console />
    </div>
  );
};

export default Sandbox;
