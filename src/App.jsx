import React, { useState } from "react";
import DrawingMap from "./components/DrawingMap/DrawingMap";
import CoordinatesModal from "./components/CoordinatesModal/CoordinatesModal.jsx";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const App = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [drawingType, setDrawingType] = useState("LineString");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [InsertionType, setInsertionType] = useState('before');
  const [polygonIndex, setPolygonIndex] = useState(0);
  

  const handleDrawClick = () => setIsDrawing(true);

  const finishDrawingPolygon = (polygonCoordinates, indexToInsert, PositionType) => {
    setPolygonIndex((prev) => { return prev + 1});
    setCoordinates((prevCoords) => {
      const newPolygon = {
        type: "Polygon",
        coordinates: polygonCoordinates,
        polygonIndex: polygonIndex
      };

      setDrawingType('LineString');
      const updatedCoords = [...prevCoords];
      const insertIndex = PositionType === "before" ? indexToInsert : indexToInsert + 1;
      updatedCoords.splice(insertIndex, 0, newPolygon);
      return updatedCoords;
    });
    setPolygonCoordinates([]);
  }

  const handleFinishDrawing = (newCoords) => {
    if (drawingType === 'Polygon') {
      setPolygonCoordinates((prevCoords) => [...prevCoords,  newCoords]);
    } else {
      const lineStringObj = {
        type : 'LineString',
        coordinates : newCoords
      };
      setCoordinates((prevCoords) => [...prevCoords, lineStringObj]);
    }
    setIsModalOpen(true);
  };

  const onDrawingCLear = () => {
    setIsDrawing(false);
  }
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInsertPolygon = (index, position) => {
    setDrawingType("Polygon");
    setInsertionType(position);
    setIsDrawing(true);
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <div className="geometry-selection">
          <button onClick={handleDrawClick}>Draw</button>
        </div>
        <DrawingMap
          isDrawing={isDrawing}
          drawingType={drawingType}
          onFinishDrawing={handleFinishDrawing}
          onDrawingCLear={onDrawingCLear}
        />

        {isModalOpen && (
          <CoordinatesModal
            coordinates={coordinates}
            onClose={handleCloseModal}
            drawType={drawingType}
            onInsertPolygon={handleInsertPolygon}
            polygonCoordinates={polygonCoordinates}
            finishDrawingPolygon={finishDrawingPolygon}
            InsertionType={InsertionType}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
