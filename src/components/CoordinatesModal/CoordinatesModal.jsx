
import React, { useState } from "react";
import "./CoordinatesModal.css";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import PolygonAccordion from "../PolygonAccordion/PolygonAccordion";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BiUpload } from "react-icons/bi";
import { BiDotsHorizontal } from "react-icons/bi";

const CoordinatesModal = ({ coordinates, drawType, onInsertPolygon, onClose, polygonCoordinates, finishDrawingPolygon, InsertionType }) => {
  const [dropdownIndex, setDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownIndex(index === dropdownIndex ? null : index);
  };


  const handleImportPoints = () => {
    setDropdownIndex(null);
  };

  return (
    <>
      {drawType === 'LineString' ? <div className="modal-overlay">
        <div className="modal-content">
          <div className="model-header">
            <h4>Mission Creation</h4>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="table-content">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>WP</th>
                  <th>Coordinates</th>
                  <th>Distance (m)</th>
                  <th className="upload-column"><BiUpload className="upload-icon" /></th>
                </tr>
              </thead>
              <tbody>
                {coordinates.map((item, index) => (
                  <tr key={index}>
                    <td>{String(index).padStart(2, "0")}</td>
                    {item.type === 'LineString' ?
                      <td>{item.coordinates?.join(", ")}</td>
                      : <PolygonAccordion
                        polygon={item.coordinates}
                        index={item.polygonIndex}
                      />
                    }
                    
                    {<td style={{textAlign:"center"}}>
                      {
                      (() => {
                        let previousIndex = index - 1;
                        while (previousIndex >= 0 && coordinates[previousIndex]?.type !== 'LineString') {
                          previousIndex--;
                        }
                    
                        if (previousIndex < 0 || coordinates[index]?.type !== 'LineString') {
                          return <BiDotsHorizontal /> 
                        }
                    
                        return Math.hypot(
                          item.coordinates[0] - coordinates[previousIndex].coordinates[0],
                          item.coordinates[1] - coordinates[previousIndex].coordinates[1]
                        ).toFixed(2);
                      })()
                      }
                    </td>}
                    <div className="dropdown-main">
                      <td>
                        <button className="dropdown-toggle" onClick={() => toggleDropdown(index)}><BiDotsVerticalRounded /></button>
                        {dropdownIndex === index && (
                          <DropdownMenu
                            onInsertPolygonBefore={() => onInsertPolygon(index, "before")}
                            onInsertPolygonAfter={() => onInsertPolygon(index, "after")}
                          />
                        )}
                      </td>
                    </div>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button className="generate-btn" disabled>
              Generated Data
            </button>
          </div>
        </div>
      </div>
        :
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="model-header">
              <h4>Polyon Tools</h4>
              <button className="close-button" onClick={onClose}>
                &times;
              </button>
            </div>
            <div className="table-content">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>WP</th>
                    <th>Coordinates</th>
                    <th>Distance (m)</th>

                  </tr>
                </thead>
                <tbody >
                  {polygonCoordinates.map((coord, index) => (
                    <tr key={index}>
                      <td>{String(index).padStart(2, "0")}</td>
                      <td>{coord.join(", ")}</td>
                      <td style={{textAlign:"center"}}>
                        {index === 0
                          ? <BiDotsHorizontal /> 
                          : Math.hypot(
                            coord[0] - polygonCoordinates[index - 1][0],
                            coord[1] - polygonCoordinates[index - 1][1]
                          ).toFixed(2)}
                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </div>
            <div className="polygon-modal-footer">
              <button className="discard-btn" disabled>
                Discard
              </button>
              <button type="button" className="import-btn" onClick={() =>{
                  handleImportPoints();
                 finishDrawingPolygon(polygonCoordinates, dropdownIndex, InsertionType)}}  style={{cursor:"pointer"}} >
                import Points
              </button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default CoordinatesModal;

