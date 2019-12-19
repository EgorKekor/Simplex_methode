import "../css/style.scss";
import { MatrixA } from "./matrixA.js"
import { Simplex } from "./simplex.js"
import { InputSliderC } from "./inputSliderC.js"
import DataReader from "./dataReader.js"

import InputSliders from "./inputSlidersT.pug"
import InputMatrix from "./inputMatrixT.pug"
import Bus from "./Bus.js"
import { SOLVE_AGAIN } from "./events.js"


const solve = () => {
    const matrixA = new MatrixA(3);
    matrixA.pushString(new Array(1, 1, 4), "<=");
    matrixA.pushString(new Array(5, 3, 7), "<=");
    matrixA.pushString(new Array(5, 3, 2), "<=");

    const indexString = DataReader.getIndex();

    const bVector = [6, 2, 9];

    const simplex = new Simplex(indexString, matrixA, bVector);
    simplex.solve();
}


Bus.on(SOLVE_AGAIN, solve);


const scale = 1;
const sliceWidth = 50;

const slidersOptions = {
    amount: 3,
    scale: scale,
}

const matrixOptions = {
    rows: 3,
    cols: 3,
}


const app = document.getElementById("application");
app.insertAdjacentHTML("beforeend", InputSliders({ slidersOptions }));
app.insertAdjacentHTML("beforeend", InputMatrix({ matrixOptions }));


const inputSlidersC = new InputSliderC(sliceWidth, scale);

solve();


