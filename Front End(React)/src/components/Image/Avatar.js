import React from "react";
import "./Avatar.css";
import Image from "./Image";

const Avatar = (props) => (
  <div
    className="avatar"
    style={{ width: props.size + "rem", height: props.size + "rem" }}
  >
    <Image imageUrl={props.image} />
  </div>
);

export default Avatar;
