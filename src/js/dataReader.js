import { MatrixA } from "./matrixA";

class DataReader {
    constructor() {

    }

    getIndex = () => {
        const allValues = document.querySelectorAll(".body-input");
        const indexString = new Array(allValues.length * 2 + 1);

        for (let i = 0; i < indexString.length; i++) {
            indexString[i] = 0;
        }
        indexString[0] = 0;
        for (const value of allValues) {
            const order = value.parentNode.getAttribute("order");
            indexString[+order + 1] = Number(value.value);
        }
        return indexString;
    }

    fillMatrixA = (matrixA) => {
        const matrix = new Array();
        const signs = new Array(matrixA.size);

        for (let i = 0; i < matrixA.size; i++) {
            matrix.push(new Array(matrixA.size));
        }


        const cells = document.querySelectorAll(".flex-elem-input");
        for (const cell of cells) {
            if (cell.id.length === 1) {
                signs[Number(cell.id)] = cell.value;
                continue;
            }

            const row = Number(cell.id[0]);
            const col = Number(cell.id[1]);
            if ((row < matrixA.size) && (col < matrixA.size)) {
                matrix[row][col] = Number(cell.value);
            }
        }

        for (let i = 0; i < matrix.length; i++) {
            matrixA.pushString(matrix[i], signs[i]);
        }
    }


    getBVector = (size) => {
        const bVector = new Array(size);
        const inputs = document.querySelectorAll(".b_vector");
        for (const input of inputs) {
            bVector[input.id[0]] = Number(input.value);
        }
        return bVector;
    }
}
export default new DataReader;