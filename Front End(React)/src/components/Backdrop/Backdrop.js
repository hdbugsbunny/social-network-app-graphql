import React from "react";
import { createPortal } from "react-dom";
import "./Backdrop.css";

const Backdrop = (props) =>
  createPortal(
    <div
      className={["backdrop", props.open ? "open" : ""].join(" ")}
      onClick={props.onClick}
    />,
    document.getElementById("backdrop-root")
  );

export default Backdrop;
