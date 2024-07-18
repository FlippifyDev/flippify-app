declare module 'mongoose-long' {
  import mongoose = require('mongoose');

  // Define the plugin function
  function mongooseLong(mongoose: typeof mongoose): void;

  // Export the function as the default export
  export = mongooseLong;
}
