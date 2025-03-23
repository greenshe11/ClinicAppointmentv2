/***
 * Creates psuedo components for reusability
 */
export class Component {
    constructor(layout, styling=null){
        this.layout = layout
        this.styling = styling
    }

    /**
     * reads html file and css file, and inserts it into the target html element.
     * styling are inserted/appended to <head>
     * @param {} element 
     */
    async setToElement(element){

        const layoutText = await this._readFile(this.layout)
        const stylingText = await this._readFile(this.styling)

        // add CSS styles to document
        const styleElement = document.createElement('style');
        styleElement.textContent = stylingText;
        document.head.appendChild(styleElement);

        // put content inside an element's inner html
        element.innerHTML = layoutText;
        console.log('component loaded')
    }
    
    /**
     * reads a file
     * @param {*} src 
     * @returns 
     */
    async _readFile(src) {
        try {
            let text = ''

            const response = await fetch(src);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Cannot load html: ${src}`);
            }
            text = await response.text();
            return text
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    }

}
