import React, { useState } from "react";
import "./PolygonAccordion.css";
import { BiChevronUp } from "react-icons/bi";

const PolygonAccordion = ({ polygon, index }) => {
  const [expanded, setExpandedArray] = useState(false);

  const toggleExpand = () => {
    setExpandedArray((prev) => !prev);
  };


  return (
    <>
      <React.Fragment key={index}>
        <td onClick={toggleExpand} className="accordion-toggle">
          <div
            className="label-1"
          >
            Polygon {index}
            <span>
              <BiChevronUp className={expanded ? 'rotate-90' : 'rotate-0'} />
            </span>
          </div>

          <div className={'accordion-body ' + (expanded ? 'height-max' : '')}>
            <table className="nested-table">
              <thead>
                <tr>
                  <th>WP</th>
                  <th>Coordinates</th>
                  <th>Distance (m)</th>
                </tr>
              </thead>
              <tbody >
                {polygon.map((coord, coordIndex) => (
                  <tr key={coordIndex}>
                    <td>{String(coordIndex).padStart(2, "0")}</td>
                    <td>{coord.join(", ")}</td>
                    <td className="distance-cell">
                      {coordIndex === 0
                        ? "--"
                        : Math.hypot(
                            coord[0] - polygon[coordIndex - 1][0],
                            coord[1] - polygon[coordIndex - 1][1]
                          ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </React.Fragment>
    </>
  );
};

export default PolygonAccordion;
