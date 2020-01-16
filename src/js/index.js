import "../css/style.scss";
import { MatrixA } from "./matrixA.js"
import { Simplex } from "./simplex.js"
import { InputSliderC } from "./inputSliderC.js"
import { InputMatrixC } from "./inputMatrixC.js"
import DataReader from "./dataReader.js"
import Chart from 'chart.js';

import Bus from "./Bus.js"
import { SOLVE_AGAIN, RESIZE_SOLVE } from "./events.js"


const app = document.getElementById("application");

const scale = 1;
const sliceWidth = 50;




const matrixOptions = {
  rows: 3,
  cols: 3,
}



const solve = (amount) => {
  const matrixA = new MatrixA(amount);
  DataReader.fillMatrixA(matrixA);

  const ObjVectorB = {
    vectorB: DataReader.getBVector(matrixA.size)
  }

  const indexString = DataReader.getIndex();

  if (matrixA.createBasis(ObjVectorB, indexString) === (-1)) {
    return;
  }

  const mode = document.getElementById("min_max").value;

  const simplex = new Simplex(indexString, matrixA, ObjVectorB.vectorB, mode);
  const result = simplex.solve();
  console.log(result);

  if (!result) {
    return;
  }


  const oilCanvas = document.getElementById("diagramm");
  Chart.defaults.global.defaultFontFamily = "Lato";
  Chart.defaults.global.defaultFontSize = 18;

  const allColors = [
    "#FF6384",
    "#63FF84",
    "#84FF63",
    "#8463FF",
    "#6384FF",
    "#43434F",
    "#515151"
  ];

  const Data = {
    labels: (() => {
      const params = new Array;
      for (let i = 0; i < result.size; i++) {
        params.push(`x[${i}]`);
      }
      return params;
    })(),
    datasets: [
      {
        data: (() => {
          const values = new Array;
          for (const [key, value] of result) {
            values.push(value);
          }
          return values;
        })(),
        backgroundColor: allColors.slice(0, result.size)
      }]
  };

  const pieChart = new Chart(oilCanvas, {
    type: 'pie',
    data: Data
  });
}


Bus.on(SOLVE_AGAIN, solve);


const sliders = document.createElement("DIV");
sliders.id = "sliders";
const inputs = document.createElement("DIV");
inputs.id = "inputs";
app.insertAdjacentElement("beforeend", sliders);
app.insertAdjacentElement("beforeend", inputs);



const inputSlidersC = new InputSliderC(sliceWidth, scale);
const inputMatrixC = new InputMatrixC();

inputSlidersC.create(sliders);
inputMatrixC.create(inputs);

const canvas = document.createElement("CANVAS");
canvas.id = "diagramm";
canvas.style.width = "600px";
canvas.style.height = "400";

app.insertAdjacentElement("beforeend", canvas);


solve();
