import React from "react";
import "./DropdownMenu.css";
import { BiHorizontalLeft } from "react-icons/bi";
import { BiHorizontalRight } from "react-icons/bi";

const DropdownMenu = ({ onInsertPolygonBefore, onInsertPolygonAfter }) => {
  return (
    <div className="dropdown-menu">
      <div
        className="dropdown-item"
        onClick={onInsertPolygonBefore}
      >
        <BiHorizontalLeft className="dropdown-icon"/> Insert Polygon Before
      </div>
      <div
        className="dropdown-item"
        onClick={onInsertPolygonAfter}
      >
        <BiHorizontalRight className="dropdown-icon" /> Insert Polygon After
      </div>
    </div>
  );
};

export default DropdownMenu;
