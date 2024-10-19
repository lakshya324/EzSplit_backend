export const userOptions = {
  textLength: {
    username: {
      min: 4,
      max: 25,
    },
    title: {
      min: 2,
      max: 50,
    },
    description: {
      min: 10,
      max: 1000,
    },
  },
  imageMetadata: {
    portfolio: {
      min: 1,
      max: 5,
      type: ["image"], // ["image", "video"]
    },
  },
};
