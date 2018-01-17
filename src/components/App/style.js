import "./style.css"
import {cyan500 as primary} from 'material-ui/styles/colors';

const _10px = 10
const _5px = 5
export const style = {
  rootDiv: {},
  title: {
    color: primary,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  quesDiv: {
    padding: _10px,
    width: 320,
  },
  inputDiv: {
    display: "block",
    width:  "100%"
  },
  upFileDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }
}
