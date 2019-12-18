

export class MatrixA {
    constructor(size) {
        this.size = size;
        this.currentStrings = 0;
        this.matrix = new Array;
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


    getBasis = () => {
        const basis = new Array;

        for (let col = 0; col < this.size * 2; col++) {
            let replyCounter = 0;
            for (const line of this.matrix) {
                if (line[col] !== 0) {
                    replyCounter++;
                }
            }
            if (replyCounter === 1) {
                basis.push(col);
            }
        }
        return basis;
    }

    getColumn = (col) => {
        return this.matrix.map(
            (line) => {
                return line[col];
            }
        );
    }
}

