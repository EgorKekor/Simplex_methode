import "../css/style.scss";
import { MatrixA } from "./matrixA.js"
import { Simplex } from "./simplex.js"
import { InputSliderC } from "./inputSliderC.js"
import { InputMatrixC } from "./inputMatrixC.js"
import DataReader from "./dataReader.js"
import Chart from 'chart.js';

import Bus from "./Bus.js"
import { SOLVE_AGAIN, RESIZE_SOLVE } from "./events.js"

// const pieChart = new Chart(votesCanvas, {
//     type: 'pie',
//     data: votesData,
//     options: chartOptions
// });

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
        vectorB : DataReader.getBVector(matrixA.size)
    }

    const indexString = DataReader.getIndex();

    if (matrixA.createBasis(ObjVectorB, indexString) === (-1)) {
        return;
    } 

    const simplex = new Simplex(indexString, matrixA, ObjVectorB.vectorB, "min");
    const result = simplex.solve();
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
canvas.id = "speedChart";
canvas.style.width = "600px";
canvas.style.height = "400";

app.insertAdjacentElement("beforeend", canvas);


const speedCanvas = document.getElementById("speedChart");

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

const speedData = {
  labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
  datasets: [{
    label: "Car Speed (mph)",
    data: [0, 59, 75, 20, 20, 55, 40],
    backgroundColor: "white", 
  }]
};

const chartOptions = {
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'white'
    }
  }
};

const lineChart = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});

solve();
