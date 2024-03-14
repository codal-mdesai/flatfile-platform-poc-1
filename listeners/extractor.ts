import { ExcelExtractor } from "@flatfile/plugin-xlsx-extractor";
import { FlatfileListener, FlatfileEvent } from "@flatfile/listener";


export default async function (listener: FlatfileListener) {
    listener.on('file:created', (event) => {
        // Define optional options for the extractor
        const options = {
            raw: true,
            rawNumbers: true,
        };

        // Initialize the Excel extractor
        const excelExtractor = ExcelExtractor(options);

        // Register the extractor as a middleware for the Flatfile listener
        listener.use(excelExtractor);

        // When an Excel file is uploaded, the data will be extracted and processed using the extractor's parser.
    })
}