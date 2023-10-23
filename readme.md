```js
const { Interceptor } = require("@enjoys/express-interceptor");
// import { Interceptor } from "@enjoys/express-interceptor";
const express = require("express");
cosnt app = express();
// ....
Interceptor.useInterceptors(app, {
  response: { test: "Interceptor Response " }, 
  // enter your custom interceptor in object format
  isEnable: false, 
  // default is false, to use interceptor isEnabled must be true
});
```
