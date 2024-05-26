import baseDarkCss from "data-text:../lpp/dark.css";
import hackerSpecific from "data-text:./main.css";
import cursor from "data-base64:assets/images/cursors/hacker/cursor_normal.png"
import cursor_pointer from "data-base64:assets/images/cursors/hacker/cursor_pointer.png"

const cursorStyle = `
:root {
  --custom-cursor: url(${cursor});
  --custom-cursor-pointer: url(${cursor_pointer});
}
`

export default (baseDarkCss + cursorStyle + hackerSpecific);
