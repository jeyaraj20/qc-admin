import React from "react";
import "./styles.css";
import emptyset from "../../../../../../assets/categoryIcons/emptyset.png";
import document from "../../../../../../assets/categoryIcons/document.png";
import rulers from "../../../../../../assets/categoryIcons/rulers.png";
import geometry from "../../../../../../assets/categoryIcons/geometry.png";
import measure from "../../../../../../assets/categoryIcons/measure.png";
import cube from "../../../../../../assets/categoryIcons/cube.png";
import board from "../../../../../../assets/categoryIcons/board.png";
import trigonometry from "../../../../../../assets/categoryIcons/trigonometry.png";
import square from "../../../../../../assets/categoryIcons/square.png";
import algebra from "../../../../../../assets/categoryIcons/algebra.png";
import calculator from "../../../../../../assets/categoryIcons/calculator.png";
import omega from "../../../../../../assets/categoryIcons/omega.png";
import sphere from "../../../../../../assets/categoryIcons/sphere.png";
import statistics from "../../../../../../assets/categoryIcons/statistics.png";
import parentheses from "../../../../../../assets/categoryIcons/parentheses.png";
import cube1 from "../../../../../../assets/categoryIcons/cube1.png";
import calculator1 from "../../../../../../assets/categoryIcons/calculator1.png";
import piegraph from "../../../../../../assets/categoryIcons/piegraph.png";
import sinus from "../../../../../../assets/categoryIcons/sinus.png";
import summation from "../../../../../../assets/categoryIcons/summation.png";
import book from "../../../../../../assets/categoryIcons/book.png";
import clipboard from "../../../../../../assets/categoryIcons/clipboard.png";
import cone from "../../../../../../assets/categoryIcons/cone.png";
import coordinateaxes from "../../../../../../assets/categoryIcons/coordinateaxes.png";
import dices from "../../../../../../assets/categoryIcons/dices.png";
import notebook from "../../../../../../assets/categoryIcons/notebook.png";
import venndiagram from "../../../../../../assets/categoryIcons/venndiagram.png";
import board1 from "../../../../../../assets/categoryIcons/board1.png";
import accounting from "../../../../../../assets/categoryIcons/accounting.png";
import blackboard from "../../../../../../assets/categoryIcons/blackboard.png";
import graph from "../../../../../../assets/categoryIcons/graph.png";
import protactor from "../../../../../../assets/categoryIcons/protactor.png";
import angle from "../../../../../../assets/categoryIcons/angle.png";
import diameter from "../../../../../../assets/categoryIcons/diameter.png";
import numberpi from "../../../../../../assets/categoryIcons/numberpi.png";
import parabola from "../../../../../../assets/categoryIcons/parabola.png";
import function1 from "../../../../../../assets/categoryIcons/function1.png";
import infinity from "../../../../../../assets/categoryIcons/infinity.png";
import compass from "../../../../../../assets/categoryIcons/compass.png";
import cylinder from "../../../../../../assets/categoryIcons/cylinder.png";
import radius from "../../../../../../assets/categoryIcons/radius.png";
import notepad from "../../../../../../assets/categoryIcons/notepad.png";
import abacus from "../../../../../../assets/categoryIcons/abacus.png";
import squareroot from "../../../../../../assets/categoryIcons/squareroot.png";
import compass1 from "../../../../../../assets/categoryIcons/compass1.png";
import hexagon from "../../../../../../assets/categoryIcons/hexagon.png";
import verniercaliper from "../../../../../../assets/categoryIcons/verniercaliper.png";
import laptop from "../../../../../../assets/categoryIcons/laptop.png";
import pyramid from "../../../../../../assets/categoryIcons/pyramid.png";
import board2 from "../../../../../../assets/categoryIcons/board2.png";
import contract from "../../../../../../assets/categoryIcons/contract.jpeg";
import test from "../../../../../../assets/categoryIcons/test.jpeg";
import edit from "../../../../../../assets/categoryIcons/edit.jpeg";

const makeLabel = (name, src) => {
    return (
        <span>
            <img className="logo" src={src} alt="" />
            <span className="label">{name}</span>
        </span>
    );
};

const iconOptions = [
    { value: "emptyset.png", label: makeLabel("Empty Set", emptyset) },
    { value: "document.png", label: makeLabel("Document", document) },
    { value: "rulers.png", label: makeLabel("Rulers", rulers) },
    { value: "geometry.png", label: makeLabel("Geometry", geometry) },
    { value: "measure.png", label: makeLabel("Measure", measure) },
    { value: "cube.png", label: makeLabel("Cube", cube) },
    { value: "board.png", label: makeLabel("Board", board) },
    { value: "trigonometry.png", label: makeLabel("Trigonometry", trigonometry) },
    { value: "square.png", label: makeLabel("Square", square) },
    { value: "algebra.png", label: makeLabel("Algebra", algebra) },
    { value: "calculator.png", label: makeLabel("Calculator", calculator) },
    { value: "omega.png", label: makeLabel("Omega", omega) },
    { value: "sphere.png", label: makeLabel("Sphere", sphere) },
    { value: "statistics.png", label: makeLabel("Statistics", statistics) },
    { value: "parentheses.png", label: makeLabel("Parentheses", parentheses) },
    { value: "cube1.png", label: makeLabel("Cube", cube1) },
    { value: "calculator1.png", label: makeLabel("Calculator", calculator1) },
    { value: "piegraph.png", label: makeLabel("Piegraph", piegraph) },
    { value: "sinus.png", label: makeLabel("Sinus", sinus) },
    { value: "summation.png", label: makeLabel("Summation", summation) },
    { value: "book.png", label: makeLabel("Book", book) },
    { value: "clipboard.png", label: makeLabel("Clipboard", clipboard) },
    { value: "cone.png", label: makeLabel("Cone", cone) },
    { value: "coordinateaxes.png", label: makeLabel("Coordinate axes", coordinateaxes) },
    { value: "dices.png", label: makeLabel("Dices", dices) },
    { value: "notebook.png", label: makeLabel("Notebook", notebook) },
    { value: "venndiagram.png", label: makeLabel("Venn Diagram", venndiagram) },
    { value: "board1.png", label: makeLabel("Board", board1) },
    { value: "accounting.png", label: makeLabel("Accounting", accounting) },
    { value: "blackboard.png", label: makeLabel("Blackboard", blackboard) },
    { value: "graph.png", label: makeLabel("Graph", graph) },
    { value: "protactor.png", label: makeLabel("Protactor", protactor) },
    { value: "angle.png", label: makeLabel("Angle", angle) },
    { value: "diameter.png", label: makeLabel("Diameter", diameter) },
    { value: "numberpi.png", label: makeLabel("NumberPi", numberpi) },
    { value: "parabola.png", label: makeLabel("Parabola", parabola) },
    { value: "function1.png", label: makeLabel("Function", function1) },
    { value: "infinity.png", label: makeLabel("Infinity", infinity) },
    { value: "compass.png", label: makeLabel("Compass", compass) },
    { value: "cylinder.png", label: makeLabel("Cylinder", cylinder) },
    { value: "radius.png", label: makeLabel("Radius", radius) },
    { value: "notepad.png", label: makeLabel("Notepad", notepad) },
    { value: "abacus.png", label: makeLabel("Abacus", abacus) },
    { value: "squareroot.png", label: makeLabel("Square Root", squareroot) },
    { value: "compass1.png", label: makeLabel("Compass", compass1) },
    { value: "hexagon.png", label: makeLabel("Hexagon", hexagon) },
    { value: "verniercaliper.png", label: makeLabel("Vernier Caliper", verniercaliper) },
    { value: "laptop.png", label: makeLabel("Laptop.png", laptop) },
    { value: "pyramid.png", label: makeLabel("Pyramid", pyramid) },
    { value: "board2.png", label: makeLabel("Board", board2) },
    { value: "test.png", label: makeLabel("Board", test) },
    { value: "contract.png", label: makeLabel("Board", contract) },
    { value: "edit.png", label: makeLabel("Board", edit) },
];

export default iconOptions;
