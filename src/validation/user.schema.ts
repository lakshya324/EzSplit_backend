import { checkSchema } from "express-validator";

export const splitValidationSchema = checkSchema({
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Invalid Split Name",
    },
    trim: true,
  },
  amount: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Invalid Split Amount",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Invalid Description",
    },
    trim: true,
  },
  splitWith: {
    in: ["body"],
    // optional: true,
    isArray: {
      options: { min: 1 },
      errorMessage: "At least one user is required to split",
    },
  },
  "splitWith.*": {
    in: ["body"],
    isString: {
      errorMessage: "Invalid User ID",
    },
    trim: true,
  },
});

export const percentageSplitValidationSchema = checkSchema({
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Invalid Split Name",
    },
    trim: true,
  },
  amount: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Invalid Split Amount",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Invalid Description",
    },
    trim: true,
  },
  splitWith: {
    in: ["body"],
    // optional: true,
    isArray: {
      options: { min: 1 },
      errorMessage: "At least one user is required to split",
    },
  },
  "splitWith.*.user_id": {
    in: ["body"],
    isString: {
      errorMessage: "Invalid User ID",
    },
    trim: true,
  },
  "splitWith.*.percentage": {
    in: ["body"],
    isNumeric: {
      errorMessage: "Invalid Percentage",
    },
  },
});

export const customSplitValidationSchema = checkSchema({
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Invalid Split Name",
    },
    trim: true,
  },
  // will be calculated from splitWith
  // amount: {
  //     in: ["body"],
  //     isNumeric: {
  //     errorMessage: "Invalid Split Amount",
  //     },
  // },
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Invalid Description",
    },
    trim: true,
  },
  splitWith: {
    in: ["body"],
    // optional: true,
    isArray: {
      options: { min: 1 },
      errorMessage: "At least one user is required to split",
    },
  },
  "splitWith.*.user_id": {
    in: ["body"],
    isString: {
      errorMessage: "Invalid User ID",
    },
    trim: true,
  },
  "splitWith.*.amount": {
    in: ["body"],
    isNumeric: {
      errorMessage: "Invalid Amount",
    },
  },
});
