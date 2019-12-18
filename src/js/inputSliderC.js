import { DomEventsWrapperMixin } from "./DomEventsWrapperMixin.js";


export class InputSliderC {
    constructor(sliceWidth, scale) {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerClassHandler(".slyder-head", "mousedown", this._mouseDown);
        this.enableAll();
        this.scale = scale;
        this.sliceWidth = sliceWidth;

        const el = document.createElement("DIV");
        document.getElementById("application").append(el);
        el.style.width = this.sliceWidth + "vw";
        el.style.visible = "hidden";
        
        this.sliceWidth = el.offsetWidth;
    }

    _onMouseMove = (event) => {
        this.activeHead.style.left = event.pageX - this.activeHead.offsetWidth / 2 + 'px';
        this.activeBody.style.width = this.activeHead.style.left;

        this.activeBody.value = (this.activeBody.style.width.replace(/[px]/g, "")/this.sliceWidth) * this.scale; 
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
            this._scaleApply();
        };
    }


    _scaleApply = () => {
        const allHeads = document.querySelectorAll(".slyder-head");
        const allBodyes = document.querySelectorAll(".slyder-body");


        const maxValue = Array.from(allBodyes).reduce(
            (previousValue, currentItem) => {
                if (Number(currentItem.value) > previousValue) {
                    return Number(currentItem.value);
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
            const currentValue = Number(value[1].value);
            const prop = currentValue / maxValue;
            value[1].style.width = (this.sliceWidth * prop) + "px";
            value[0].style.left = value[1].style.width;
            this.scale = maxValue 
        }

        console.log(sliceMap);
    }
}

