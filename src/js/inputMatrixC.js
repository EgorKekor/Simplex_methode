
import { DomEventsWrapperMixin } from "./DomEventsWrapperMixin.js";
import Bus from "./Bus.js"
import { SOLVE_AGAIN, RESIZE_SOLVE } from "./events.js"
import InputMatrix from "./inputMatrixT.pug"


export class InputMatrixC {
    constructor(root) {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("solve", "click", this._reSolve);
        this.amount = 3;
        Bus.on(RESIZE_SOLVE, this._resize);
    }

    _resize = () => {
        this.destroy();
        this.create(this.root);
    }

    create = (root) => {
        this.root = root;
        const container = document.getElementById("sliders_amount");
        let amount = Number(container.getAttribute("amount"));
        const matrixOptions = {
            rows: amount,
            cols: amount,
        }
        this.amount = amount;

        this.root.insertAdjacentHTML("beforeend", InputMatrix({ matrixOptions }));
        this.enableAll();
    }

    destroy = () => {
        this.root.innerHTML = "";
        this.disableAll();
    }

    _reSolve = () => {
        Bus.emit(SOLVE_AGAIN, this.amount);
    }

    _redraw = () => {
        this.destroy();
        this.create(this.root);
    }
}