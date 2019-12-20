import { DomEventsWrapperMixin } from "./DomEventsWrapperMixin.js";
import Bus from "./Bus.js"
import { SOLVE_AGAIN, RESIZE_SOLVE } from "./events.js"
import InputSliders from "./inputSlidersT.pug"



export class InputSliderC {
    constructor(sliceWidth, scale) {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerClassHandler(".slyder-head", "mousedown", this._mouseDown);
        this.registerClassHandler(".body-input", "change", this._scaleApply);
        this.registerHandler("plus", "click", this._plus);
        this.registerHandler("minus", "click", this._minus);
        this.enableAll();
        this.scale = scale;
        this.sliceWidth = sliceWidth;
        this.amount = 3;    

        const el = document.createElement("DIV");
        document.getElementById("application").append(el);
        el.style.width = this.sliceWidth + "vw";
        el.style.visible = "hidden";
        
        this.sliceWidth = el.offsetWidth;
    }

    create = (root) => {
        this.root = root;
        const slidersOptions = {
            amount: this.amount,
            scale: this.scale,
        }

        this.root.insertAdjacentHTML("beforeend", InputSliders({ slidersOptions }));
        this.enableAll();
    }

    destroy = () => {
        this.root.innerHTML = "";
        this.disableAll();
    }

    _redraw = () => {
        this.destroy();
        this.create(this.root);
    }



    _plus = (event) => {
        const container = document.getElementById("sliders_amount");
        let amount = Number(container.getAttribute("amount"));

        const flex = document.createElement("DIV");
        flex.classList.add("slyder-flex");

        const newSlider = document.createElement("DIV");
        newSlider.setAttribute("order", amount);
        newSlider.classList.add("slyder-body");
        const input = document.createElement("INPUT");
        input.value = 1;
        input.classList.add("body-input");

        const newHead = document.createElement("DIV");
        newHead.setAttribute("order", amount);
        newHead.classList.add("slyder-head");

        flex.insertAdjacentElement("beforeend", newSlider);
        flex.insertAdjacentElement("beforeend", newHead);
        newSlider.insertAdjacentElement("beforeend", input);
        container.insertAdjacentElement("beforeend", flex);

        amount++;
        container.setAttribute("amount", amount);
        this.amount = amount;

        this.disableAll();
        this.enableAll();
        Bus.emit(RESIZE_SOLVE);
    }

    _minus = (event) => {
        const container = document.getElementById("sliders_amount");
        let amount = Number(container.getAttribute("amount"));

        container.removeChild(container.children[amount - 1]);

        amount--;
        container.setAttribute("amount", amount);
        this.amount = amount;

        this.disableAll();
        this.enableAll();
        Bus.emit(RESIZE_SOLVE);
    }

    _onMouseMove = (event) => {
        this.activeHead.style.left = event.pageX - this.activeHead.offsetWidth / 2 + 'px';
        this.activeBody.style.width = this.activeHead.style.left;

        this.activeBody.firstChild.value = (this.activeBody.style.width.replace(/[px]/g, "")/this.sliceWidth) * this.scale; 
    }

    _mouseDown = (event) => {
        this.activeHead = event.target;
        this.activeBody = event.target.parentNode.children[0];

        this.activeHead.style.position = "absolute";
        this.activeHead.style.zIndex = 1000;

        this.activeHead.style.left = event.pageX - event.target.offsetWidth / 2 + 'px';
        this.activeBody.style.width = this.activeHead.style.left;

        document.addEventListener('mousemove', this._onMouseMove);
        this.activeHead.ondragstart = function () {
            return false;
        };

        document.onmouseup = (event) => {
            document.removeEventListener('mousemove', this._onMouseMove);
            document.onmouseup = null;
            this.activeHead.style.zIndex = 0;
            this._scaleApply();
        };
    }


    _scaleApply = () => {
        const allHeads = document.querySelectorAll(".slyder-head");
        const allBodyes = document.querySelectorAll(".slyder-body");


        const maxValue = Array.from(allBodyes).reduce(
            (previousValue, currentItem) => {
                if (Number(currentItem.firstChild.value) > previousValue) {
                    return Number(currentItem.firstChild.value);
                }
                return previousValue;
            },
            -Infinity
        );

        const sliceMap = new Map;
        for (const head of allHeads) {
            const keyVal = new Array(head);
            sliceMap.set(head.getAttribute("order"), keyVal);
        }
        for (const body of allBodyes) {
            const keyVal = sliceMap.get(body.getAttribute("order"));
            keyVal.push(body);
            sliceMap.set(body.getAttribute("order"), keyVal);
        }

        for (const [key, value] of sliceMap) {
            const currentValue = Number(value[1].firstChild.value);
            const prop = currentValue / maxValue;
            value[1].style.width = (this.sliceWidth * prop) + "px";
            value[0].style.left = value[1].style.width;
            this.scale = maxValue 
        }

        Bus.emit(SOLVE_AGAIN, this.amount);

    }
}

