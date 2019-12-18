import "../css/style.scss";
import { MatrixA } from "./matrixA.js"
import { Simplex } from "./simplex.js"


const matrixA = new MatrixA(3);
matrixA.pushString(new Array(1, 1, 4), "<=");
matrixA.pushString(new Array(5, 3, 7), "<=");
matrixA.pushString(new Array(5, 3, 2), "<=");



console.log(matrixA.matrix);
console.log(matrixA.getBasis());

const indexString = [0, 1, 2, 3];
const bVector = [6, 2, 9];

const simplex = new Simplex(indexString, matrixA, bVector);
simplex.solve();



