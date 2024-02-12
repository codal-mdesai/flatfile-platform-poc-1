import api from "@flatfile/api";
import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";
import { ExcelExtractor } from "@flatfile/plugin-xlsx-extractor";
import { FlatfileRecord } from "@flatfile/hooks";
/**
 * Example Listener
 */
export const listener = FlatfileListener.create((listener) => {
  listener.on("**", (event) => {
    console.log(`Received event: ${event.topic}`, event);
    if (event.topic == "space:created") {
      console.log("space created event", event);
      localStorage.setItem("spaceId", event.context.spaceId)
    }
  });
  listener.on("file:created", (event) => {
    console.log(`Received event file:`,event);
  })
  listener.use(
    recordHook("recipients-products", (record: FlatfileRecord) => {
      console.log({record});
      
      return record
    })
  );
  listener.use(ExcelExtractor());
  listener.filter({ job: "workbook:submitActionFg" }, (configure) => {
    configure.on("job:ready", async ({ context: { jobId } }) => {
      try {
        await api.jobs.ack(jobId, {
          info: "Getting started.",
          progress: 10,
        });

        // Make changes after cells in a Sheet have been updated
        console.log("Make changes here when an action is clicked");

        await api.jobs.complete(jobId, {
          outcome: {
            acknowledge: true,
            message: "This is now complete.",
            next: {
              type: "wait",
            },
          },
        });
      } catch (error: any) {
        console.error("Error:", error.stack);

        await api.jobs.fail(jobId, {
          outcome: {
            message: "This job encountered an error.",
          },
        });
      }
    });
  });
});
