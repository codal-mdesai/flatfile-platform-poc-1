import api, { Flatfile } from "@flatfile/api";
import { FlatfileListener } from "@flatfile/listener";
import { ExcelExtractor } from "@flatfile/plugin-xlsx-extractor";
import { FlatfileRecord } from "@flatfile/hooks";
import { automap } from "@flatfile/plugin-automap";
import { bulkRecordHook, recordHook } from "@flatfile/plugin-record-hook";
/**
 * Example Listener
 */
export const listener = FlatfileListener.create((listener: FlatfileListener) => {
  let workbook: Flatfile.WorkbookResponse;
  listener.on("**", (event) => {
    try {
      console.log(`Received event: ${event.topic}`, event);
      if (event.topic == "space:created") {
        console.log("space created event", event);
        if ((typeof window !== 'undefined')) {
          localStorage.setItem("spaceId", event.context.spaceId)
        }
      }
    } catch (error) {
      console.error('General error:', error);
    }
  });
  // listener.use(
  //   bulkRecordHook("recipients-products", (records: FlatfileRecord[]) => {
  //     console.log("records", records)
  //     return records.map((r) => {
  //       // if (r.get("zip") === "08852") {
  //       //   r.addError("sku", `we do not supply alcohol with this zipcode `)
  //       // }
  //       return r;
  //     })
  //   },
  //     { chunkSize: 100, parallel: 2 })
  // );
  listener.use(
    recordHook("recipients-products", (record: FlatfileRecord) => {
      try {
        console.log("record", record)
        if (record.get("zip") === "08852") {
          record.addError("sku", `we do not supply alcohol with this zipcode `)
        }
        return record;
      } catch (error) {
        console.error('recordHook error:', error);
      }
    })
  );

  listener.on("file:created", (event) => {
    try {
      console.log(`Received event file:`, event);
      // Define optional options for the extractor
      const options = {
        raw: true,
        rawNumbers: true
      };

    // Initialize the Excel extractor
      const excelExtractor = ExcelExtractor(options);
      // Register the extractor as a middleware for the Flatfile listener
      listener.use(excelExtractor);
    } catch (error) {
      console.error('file:created error:', error);
    }
    
  })

  listener.on(
    "job:completed",
    { operation: "extract-plugin-excel" },
    async (event) => {
      
      try {
        const { fileId } = event.context;
      console.log("within job completed hook", event);

        const file = await api.files.get(fileId);
        const fileWorkbookId = file.data.workbookId;
        if (!fileWorkbookId) throw new Error("Workbook does not have an id");
        const fileWorkbook = await api.workbooks.get(fileWorkbookId);

        const workbookId = workbook.data.id;
        const sheets = (await api.workbooks.get(workbookId)).data.sheets;
        if (!sheets) throw new Error("Workbook does not have any sheets");
        const sheetId = sheets[0].id;

        const fileWorkbookSheets = fileWorkbook.data.sheets;
        if (!fileWorkbookId || !fileWorkbookSheets)
          throw new Error("Workbook does not have an id");
        const sourceSheetId = fileWorkbookSheets[0].id;
        await api.jobs.create({
          type: "workbook",
          operation: "map",
          source: fileWorkbookId,
          destination: workbookId,
          status: "planning",
          config: {
            destinationSheetId: sheetId,
            sourceSheetId: sourceSheetId,
          },
          trigger: "immediate",
        });
      } catch (err) {
        console.error("job:complete error", err);
      }
    }
  );

  listener.filter({ job: "workbook:submitActionFg" }, (configure) => {
    configure.on("job:ready", async ({ context: { jobId } }) => {
      try {
        await api.jobs.ack(jobId, {
          info: "Getting started.",
          progress: 10,
        });

        // Make changes after cells in a Sheet have been updated
        console.log("Make changes here when an action is clicked");
        // await api.jobs.complete(jobId);
        await api.jobs.complete(jobId, {
          outcome: {
            acknowledge: true,
            message: "This is now completed.",
            next: {
              type: "wait",
            },
          },
        });

      } catch (error: any) {
        console.error("workbook:submitActionFg :", error);

        await api.jobs.fail(jobId, {
          outcome: {
            message: "This job encountered an error.",
          },
        });
      }
    });
  });
  // listener.on("job:outcome-acknowledged", async (event) => {
  //   console.log("job:outcome-acknowledged --> ack data", await event.data())
  //   const {workbookId, jobId} = event.context
  //   const { data: workbookSheets } = await api.sheets.list({
  //     workbookId,
  //   });
  //   // const { data: records } = await api.records.get(workbookId);
  //   console.log({workbookSheets});
  //   const sheets = []
  //   for (const element of workbookSheets) {
  //     const { data: records } = await api.records.get(element.id);
  //     console.log({records});
      
  //   }
  //   const updateJob = await api.jobs.update(jobId, {
  //     status: 'complete',
  //   });
  //   console.log({updateJob});
    
  // })
});
