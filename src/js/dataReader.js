
class DataReader {
    constructor() {

    }

    getIndex = () => {
        const allValues = document.querySelectorAll(".body-input");
        const indexString = new Array(allValues.length + 1);
        indexString[0] = 0;
        for (const value of allValues) {
            const order = value.parentNode.getAttribute("order");
            indexString[+order + 1] = value.value;
        }
        return indexString;
    }
}
export default new DataReader;