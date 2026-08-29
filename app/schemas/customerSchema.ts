// schemas/userSchema.ts
import { jobStage, salesReps, jobType } from './constants';
export const customerSchema = {
    type: "object",
    properties: {
      first: { type: "string", minLength: 1, title: "First" },
      last: { type: "string", minLength: 1, title: "Last" },
      address: { type: "string", title: "Address" },
      phone: { type: "string", title: "Phone" },
      email: { type: "string",  title: "Email" },
      price: { type: "number", title: "Price", default: 0 },
      stage: { type: "string",  title: "Stage", "enum": jobStage},
      jobType: { type: "string", title: "Job Type", "enum": jobType},
      salesperson: { type: "string", title: "Sales Rep", "enum": salesReps }

    },
    required: ["first", "last", "address", "stage", "jobType", "salesperson"]
  };
  
  export const customerUiSchema = {
    type: "VerticalLayout",
    elements: [
      { type: "Control", scope: "#/properties/last" },
      { type: "Control", scope: "#/properties/first" },
      { type: "Control", scope: "#/properties/address" },
      { type: "Control", scope: "#/properties/phone" },
      { type: "Control", scope: "#/properties/email" },
      { type: "Control", scope: "#/properties/stage" },
      { type: "Control", scope: "#/properties/jobType" },
      { type: "Control", scope: "#/properties/salesperson" }
    ]
  };
  