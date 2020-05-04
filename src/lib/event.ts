import mitt from "mitt";

export const EVENT_TYPES = {
  ADD_PACKAGE: "ADD_PACKAGE",
  REMOVE_PACKAGE: "REMOVE_PACKAGE"
};

const emitter = mitt();

export default emitter;
