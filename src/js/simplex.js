export class Simplex {
    constructor(indexString, matrixA, vectorB, mode) {
        this.mode = mode;
        this.size = matrixA.size;
        this.indexString = indexString.map(
            (item) => {
                return item * (-1);
            }
        );

        this.indexString
        this.matrixA = matrixA;
        this.vectorB = vectorB;
    }

    _getCol = (array) => {
        let comparator;
        let startValue;

        if (this.mode === "max") {
            comparator = (a, b) => a <= b
            startValue = Infinity;
        } else {
            comparator = (a, b) => a >= b
            startValue = -Infinity;
        }


        return array.reduce(
            (previousValue, currentItem, index, arr) => {
                if (index === 0) {
                    return [previousValue[0], previousValue[1]];
                }
                if (comparator(currentItem, previousValue[0])) {
                    previousValue[0] = currentItem;
                    previousValue[1] = index;
                }
                return [previousValue[0], previousValue[1]];
            },
            [startValue, 0]
        )[1] - 1;
    }

    _getRow = (col) => {
        const column = this.matrixA.getColumn(col);
        let positive = false;
        for (const item of column) {
            if (item >= 0) {
                positive = true;
            }
        }
        if (!positive) {
            alert("Бесконечное множество решений: все значения столбца отрицательны");
            return (-1);
        }

        const minVector = column.map(
            (item, ind) => {
                if (item < 0) {
                    return -Infinity;
                }
                return this.vectorB[ind] / item;
            }
        );

        let min = Infinity;
        let row = 0;
        let minRow;
        for (const item of minVector) {
            if ((item < min) && (item >= 0)) {
                min = item;
                minRow = row;
            }
            row++;
        }

        return minRow
    }

    _solved = () => {
        for (const val of this.indexString) {
            if (this.mode === "max") {
                if (val < 0) {
                    return true;
                }
            } else if (this.mode === "min") {
                if (val > 0) {
                    return true;
                }
            }
        }
        return false;
    }



    solve = () => {
        let iteration = 0;
        while (this._solved()) {
            iteration -= - 1;
            if (iteration > 100) {
                console.log("No solve");
                return;
            }
            const col = this._getCol(this.indexString);
            const row = this._getRow(col);
            if (row === (-1)) {
                return null;
            }
            console.log(row);
            console.log(col);

            const mainDelimer = this.matrixA.matrix[row][col];
            const delimVector = this.matrixA.getColumn(col);

            const delimB = this.vectorB[row];
            const vectorBCopy = this.vectorB.map(
                (item, ind) => {
                    if (ind === row) {
                        return delimB / mainDelimer;
                    }
                    return (item - (delimVector[ind] * delimB) / mainDelimer);
                }
            );

            const delimInd = this.indexString[col + 1];
            const indexStringCopy = this.indexString.map(
                (item, ind) => {
                    let colElem = this.matrixA.matrix[row][ind - 1];
                    if (ind === 0) {
                        colElem = this.vectorB[row];
                    }
                    return (item - (colElem * delimInd) / mainDelimer);
                }
            );

            let i = 0;
            for (const line of this.matrixA.matrix) {
                if (i === row) {
                    i -= - 1;
                    continue;
                }
                const rowElem = this.matrixA.matrix[i][col];
                this.matrixA.matrix[i] = line.map(
                    (item, ind) => {
                        let colElem = this.matrixA.matrix[row][ind];
                        return (item - (colElem * rowElem) / mainDelimer);
                    }
                );
                i++;
            }
            this.matrixA.matrix[row] = this.matrixA.matrix[row].map(
                (item, ind) => {
                    return item / mainDelimer;
                }
            );

            this.vectorB = vectorBCopy;
            this.indexString = indexStringCopy;

            this.matrixA.swapBasis(row, col);

            // console.log(this.vectorB);
            // console.log(this.matrixA.matrix);
            // console.log(this.indexString);
            console.log(this.matrixA.basis);
        }
        console.log(this.matrixA.basis);
        console.log(this.vectorB);

        const result = new Map;

        for (let i = 0; i < this.matrixA.size; i++) {
            let pos = 0;
            for (const value of this.matrixA.basis) {
                if (value === i) {
                    break;
                }
                pos++
            }
            if (pos === this.matrixA.size) {
                console.log(`x[${i + 1}]=0`);
                result.set(i, 0);
            } else {
                result.set(i, this.vectorB[pos]);
                console.log(`x[${i + 1}]=${this.vectorB[pos]}`);
            }
        }
        return result;
    }

}

