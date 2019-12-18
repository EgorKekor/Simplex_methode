export class Simplex {
    constructor(indexString, matrixA, vectorB) {
        this.size = matrixA.size;
        this.indexString = indexString.map(
            (item) => {
                return item * (-1);
            }
        );
        for (let i = 0; i < this.size; i++) {
            this.indexString.push(0);
        }
        this.indexString
        this.matrixA = matrixA;
        this.vectorB = vectorB;
    }

    _getMin = (array) => {
        return array.reduce(
            (previousValue, currentItem, index, arr) => {
                if (index === 0) {
                    return [previousValue[0], previousValue[1]];
                }
                if (currentItem <= previousValue[0]) {
                    previousValue[0] = currentItem;
                    previousValue[1] = index;
                }
                return [previousValue[0], previousValue[1]];
            },
            [Infinity, 0]
        )[1] - 1;
    }

    _getRow = (col) => {
        const column = this.matrixA.getColumn(col);

        const minVector = column.map(
            (item, ind) => {
                return this.vectorB[ind] / item;
            }
        );

        let min = Infinity;
        let row = 0;
        let minRow;
        for (const item of minVector) {
            if ((item < min) && (item > 0)) {
                min = item;
                minRow = row;
            }
            row++;
        }

        return minRow
    }

    _isNegative = () => {
        for (const val of this.indexString) {
            if (val < 0) {
                return true;
            }
        }
        return false;
    }


    solve = () => {
        while (this._isNegative()) {
            const col = this._getMin(this.indexString);
            const row = this._getRow(col);
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
        }
        console.log(this.matrixA.basis);
        console.log(this.vectorB);
    }

}

