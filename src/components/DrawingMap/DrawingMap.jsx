import React, { useEffect, useRef, useState  } from "react";
import "ol/ol.css";
import Draw from 'ol/interaction/Draw.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { Point , LineString } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";


const DrawingMap = ({ isDrawing, drawingType, onFinishDrawing, onDrawingCLear }) => {
  const mapRef = useRef(null); 
  const vectorSourceRef = useRef(null); 
  const drawRef = useRef(null);
  const lastClickedPointRef = useRef(null); 

  useEffect(() => {
    const vectorSource = new VectorSource({ wrapX: false });
    vectorSourceRef.current = vectorSource;

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
      }),
    });

    mapRef.current = map; 


    return () => {
      map.setTarget(null); 
    };
  }, []);

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === "Enter") {
        clearDrawing(); 
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const clearDrawing = () => {
    if (mapRef.current && drawRef.current) {
      const map = mapRef.current;
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
      lastClickedPointRef.current = null;
      onDrawingCLear(); 
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
  
    const map = mapRef.current;
    const vectorSource = vectorSourceRef.current;
  
    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }
  
    if (isDrawing) {
      const draw = new Draw({
        source: vectorSource,
        type: drawingType,
      });
  
      draw.on("drawend", () => {
        if (mapRef.current && drawRef.current) {
          const map = mapRef.current;
          map.removeInteraction(drawRef.current);
          drawRef.current = null;
          lastClickedPointRef.current = null; 
          isDrawing = null;
          onDrawingCLear();
        } 
      });
  
      map.addInteraction(draw);
      drawRef.current = draw;
  
        const handleClick = (event) => {
          if (isDrawing) {
            const clickedCoords = event.coordinate;      
            const lastClickedPoint = lastClickedPointRef.current;
            onFinishDrawing(clickedCoords);

            if (lastClickedPoint) {
              const line = new LineString([lastClickedPoint, clickedCoords]);
              const lineFeature = new Feature(line);
        
              lineFeature.setStyle(
                new Style({
                  stroke: new Stroke({
                    color: "black",
                    width: 1,
                  }),
                  zIndex: 0,
                })
              );
        
              vectorSource.addFeature(lineFeature);
            }
        
            const point = new Point(clickedCoords);
            const pointFeature = new Feature(point);
        
            pointFeature.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 5,
                  fill: new Fill({
                    color: drawingType === 'LineString' ? "blue" : "green",
                  }),
                  stroke: new Stroke({
                    color: "white",
                    width: 1,
                  }),
                }),
                zIndex: 1,
              })
            );
        
            vectorSource.addFeature(pointFeature);
            lastClickedPointRef.current = clickedCoords; 
          }
        };
  
      map.on("click", handleClick);

      return () => {
        map.un("click", handleClick);
      };
    }
  
    return () => {
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
        drawRef.current = null;
      }
    };
  }, [isDrawing, drawingType]); 
  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};
export default DrawingMap;
