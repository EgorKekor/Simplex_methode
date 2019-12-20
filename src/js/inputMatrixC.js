
import { DomEventsWrapperMixin } from "./DomEventsWrapperMixin.js";
import Bus from "./Bus.js"
import { SOLVE_AGAIN } from "./events.js"


export class InputMatrixC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("solve", "click", this._reSolve);
        this.enableAll();
    }

    _reSolve = () => {
        Bus.emit(SOLVE_AGAIN);
    }
}