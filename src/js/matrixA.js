

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

        let inputIndex = this.size - 1;
        for (let i = this.matrix[minIndex].length - 1; i >= 0; i--) {
            if ((this.matrix[minIndex][i] != 0) && (this.basis[minIndex] !== i)) {
                inputIndex = i;
                break;
            }
        }

        const mainDelim = this.matrix[minIndex][inputIndex];

        vectorB = vectorB.map((item, ind) => {
            if (ind === minIndex) {
                return (item / mainDelim);
            }
            return (item - (vectorB[minIndex] * this.matrix[ind][inputIndex]) / mainDelim)
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
                line[col] -= (this.matrix[minIndex][col] * this.matrix[ind][inputIndex]) / mainDelim;
            }
            return line
        });

        this.matrix = copyA;
        return [vectorB, inputIndex];
    }

    _recountIndexString = (indexString, vectorB) => {
        let pos = 0;
        for (const number of this.basis) {
            if (number < this.size) {
                const coeff = indexString[number + 1];
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
        
        // let inputIndex = this.size - 1;
        // if (this._haveNegative(vectorB)) {
        //     const ret = this._jordanoGauss(vectorB);
        //     vectorB = ret[0];
        //     inputIndex = ret[1];
        // }

        // let changeColumnStart = inputIndex;
        // let pos = 0;
        // for (const column of this.basis) {
        //     let replyCounter = 0;

        //     for (let row = 0; row < this.size; row++) {
        //         if (this.matrix[row][column] !== 0) {
        //             replyCounter++;
        //         }
        //     }

        //     if (replyCounter > 1) {
        //         let changeColReply = 0;
        //         for (let row = 0; row < this.size; row++) {
        //             if (this.matrix[row][changeColumnStart] !== 0) {
        //                 changeColReply++;
        //             }
        //         }
        //         if (changeColReply === 1) {
        //             this.basis[pos] = changeColumnStart--;
        //         }
        //     }
        //     pos++;
        // }
        // this._recountIndexString(indexString, vectorB);


        let protect = 0;
        while(this._haveNegative(vectorB)) {
            protect++;
            if (protect === 100) {
                console.log("Вектор Б содержит отрицательное значение");
                return (-1);
            }

            const ret = this._jordanoGauss(vectorB);
            vectorB = ret[0];
            const inputIndex = ret[1];

            let changeColumnStart = inputIndex;
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
    
            this._recountIndexString(indexString, vectorB);
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

