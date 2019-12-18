import "../css/style.scss";
import { MatrixA } from "./matrixA.js"
import { Simplex } from "./simplex.js"
import { InputSliderC } from "./inputSliderC.js"

import InputSliders from "./inputSlidersT.pug"

const scale = 1;
const sliceWidth = 50;

const slidersOptions = {
    amount: 3,
    scale: scale,
}

const app = document.getElementById("application");
app.insertAdjacentHTML("beforeend", InputSliders({ slidersOptions }));



const inputSlidersC = new InputSliderC(sliceWidth, scale);



const matrixA = new MatrixA(3);
matrixA.pushString(new Array(1, 1, 4), "<=");
matrixA.pushString(new Array(5, 3, 7), "<=");
matrixA.pushString(new Array(5, 3, 2), "<=");



const indexString = [0, 1, 2, 3];
const bVector = [6, 2, 9];

const simplex = new Simplex(indexString, matrixA, bVector);
simplex.solve();



