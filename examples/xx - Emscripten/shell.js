const Module = require('./out/fizzbuzz.js');

Module.postRun = (module) => module._fizzbuzz(20);
