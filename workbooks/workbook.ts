import { Flatfile } from "@flatfile/api";

export const workbook: Pick<
  Flatfile.CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "All Data",
  labels: ["pinned"],
  sheets: [
    {
      name: "Recipient & Product Association",
      slug: "recipients-products",
      allowAdditionalFields: true,
      fields: [
        {
          key: "firstName",
          type: "string",
          label: "Recipient First Name",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "lastName",
          type: "string",
          label: "Recipient Last Name",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "email",
          type: "string",
          label: "Recipient Email",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "sku",
          type: "enum",
          label: "Product",
          "constraints": [
            {
              "type": "required"
            }
          ],
          config:{
            options: [
              {
                "value": "PKMX1PKm",
                "label": "Party can cosmicpolitan",
                meta: {
                  foo: "bar"
                }
              },
              {
                "value": "PKMX1PK",
                "label": "Party can variety pack"
              },
              {
                "value": "PKMX1PK2",
                "label": "Party can variety pack 2",
                "color": "red"
              },
              {
                "value": "PKMX1PK23",
                "label": "Party can variety pack 3"
              }
            ]
          }
        },
        {
          key: "company",
          type: "string",
          label: "Company(Optional)",
        },
        {
          key: "addressLine1",
          type: "string",
          label: "Recipient Address",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "addressLine2",
          type: "string",
          label: "APT OR UNIT # (OPTIONAL)",
        },
        {
          key: "city",
          type: "string",
          label: "City",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "state",
          type: "string",
          label: "State",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "zip",
          type: "string",
          label: "zipcode",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "shippingMethod",
          type: "enum",
          label: "Shipping Method",
          "constraints": [
            {
              "type": "required"
            }
          ],
          "config": {
            "options": [
              {
                "value": "ground",
                "label": "Ground (Signature Required)",
                meta: {
                  foo: "bar"
                }
              },
              {
                "value": "3days",
                "label": "3 Days"
              },
              {
                "value": "2days",
                "label": "2 Days",
                "color": "red"
              },
              {
                "value": "overnight_shipping",
                "label": "Overnight Shipping"
              }
            ]
          }
        },
        {
          key: "phone",
          type: "string",
          label: "Phone(optional)",
          "constraints": [
            {
              "type": "required"
            }
          ]
        },
        {
          key: "giftMessage",
          type: "string",
          label: "Gift Message",
        },
      ],
    }
  ],
  actions: [
    {
      operation: "submitActionFg",
      mode: "foreground",
      label: "Submit foreground",
      description: "Submit data to webhook.site",
      primary: true,
    },
  ],
};
