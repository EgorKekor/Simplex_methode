import "../css/style.scss";
import { MatrixA } from "./matrixA.js"
import { Simplex } from "./simplex.js"
import { InputSliderC } from "./inputSliderC.js"
import { InputMatrixC } from "./inputMatrixC.js"
import DataReader from "./dataReader.js"

import InputSliders from "./inputSlidersT.pug"
import InputMatrix from "./inputMatrixT.pug"
import Bus from "./Bus.js"
import { SOLVE_AGAIN } from "./events.js"


const solve = () => {
    const matrixA = new MatrixA(3);
    DataReader.fillMatrixA(matrixA);

    const ObjVectorB = {
        vectorB : DataReader.getBVector(matrixA.size)
    }

    const indexString = DataReader.getIndex();

    if (matrixA.createBasis(ObjVectorB, indexString) === (-1)) {
        return;
    } 


    const simplex = new Simplex(indexString, matrixA, ObjVectorB.vectorB, "min");
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
const inputMatrixC = new InputMatrixC();

solve();


