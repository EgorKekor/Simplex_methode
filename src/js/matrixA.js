

export class MatrixA {
    constructor(size) {
        this.size = size;
        this.currentStrings = 0;
        this.matrix = new Array;
        this.basis = new Array;
    }

    pushString = (array, sign = "<=") => {
        if (this.currentStrings === this.size) {
            console.log("Matrix A limit");
            return;
        }

        for (let i = 0; i < this.currentStrings; i++) {
            array.push(0);
        }

        if (sign === "<=") {
            array.push(1);
        } else {
            array.push(-1);
        }

        for (let i = this.currentStrings + 1; i < this.size; i++) {
            array.push(0);
        }

        this.currentStrings -= - 1;
        this.matrix.push(array);

    }

    _haveNegative = (vectorB) => {
        for (const item of vectorB) {
            if (item < 0) {
                return true;
            }
        }
        return false;
    }



    _jordanoGauss = (vectorB) => {
        let minIndex;
        let min = Infinity;
        for (let i = 0; i < vectorB.length; i++) {
            if (vectorB[i] < min) {
                min = vectorB[i];
                minIndex = i;
            }
        }

        const mainDelim = this.matrix[minIndex][this.size - 1];

        vectorB = vectorB.map((item, ind) => {
            if (ind === minIndex) {
                return (item / mainDelim);
            }
            return (item - (vectorB[minIndex] * this.matrix[ind][this.size - 1]) / mainDelim)
        });

        const copyA = this.matrix.map((item, ind) => {
            const line = new Array(...this.matrix[ind]);
            if (ind === minIndex) {
                for (let col = 0; col < this.size * 2; col++) {
                    line[col] /= mainDelim;
                }
                return line
            }
            for (let col = 0; col < this.size * 2; col++) {
                line[col] -= (this.matrix[minIndex][col] * this.matrix[ind][this.size - 1]) / mainDelim;
            }
            return line
        });

        this.matrix = copyA;
        return vectorB;
    }

    _recountIndexString = (indexString, vectorB) => {
        let pos = 0;
        for (const number of this.basis) {
            if (number < this.size) {
                const coeff = indexString[pos + 1];
                for (let i = 0; i < this.size * 2; i++) {
                    indexString[i + 1] -= (coeff * this.matrix[pos][i]);
                }
            }
            pos++
        }
    }


    createBasis = (ObjVectorB, indexString) => {
        for (let i = this.size; i < this.size * 2; i++) {
            this.basis.push(i);
        }

        let vectorB = ObjVectorB.vectorB;
        for (let col = this.size; col < this.size * 2; col++) {
            let replyCounter = 0;

            for (let i = 0; i < this.size; i++) {
                const line = this.matrix[i];

                if (line[col] !== 0) {
                    if (line[col] === (-1)) {
                        for (let j = 0; j < line.length; j++) {
                            if (line[j] !== 0) {
                                line[j] *= (-1);
                            }
                        }
                        if (vectorB[i] !== 0) {
                            vectorB[i] *= (-1);
                        }
                    }
                }
            }
        }

        if (this._haveNegative(vectorB)) {
            vectorB = this._jordanoGauss(vectorB);
        }

        let changeColumnStart = this.size - 1;
        let pos = 0;
        for (const column of this.basis) {
            let replyCounter = 0;

            for (let row = 0; row < this.size; row++) {
                if (this.matrix[row][column] !== 0) {
                    replyCounter++;
                }
            }

            if (replyCounter > 1) {
                let changeColReply = 0;
                for (let row = 0; row < this.size; row++) {
                    if (this.matrix[row][changeColumnStart] !== 0) {
                        changeColReply++;
                    }
                }
                if (changeColReply === 1) {
                    this.basis[pos] = changeColumnStart--;
                }
            }
            pos++;
        }

        // for (let col = this.size * 2 - 1; col >= 0; col--) {
        //     let replyCounter = 0;
        //     for (let i = 0; i < this.size; i++) {
        //         if (this.matrix[i][col] !== 0) {
        //             replyCounter++;
        //         }
        //     }

        //     if (replyCounter === 1) {

        //     }
        // }
        this._recountIndexString(indexString, vectorB);

        for (const item of vectorB) {
            if (item < 0) {
                console.log("Решения не существует: Вектор В содержит отрицательное значение");
                return (-1);
            }
        }

        ObjVectorB.vectorB = vectorB;
    }

    swapBasis = (row, col) => {
        this.basis[row] = col;
    }

    getColumn = (col) => {
        return this.matrix.map(
            (line) => {
                return line[col];
            }
        );
    }
}

