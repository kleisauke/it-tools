# Work in Progress - Emscripten integration

> Note: Not yet done.

This example demonstrates a possible Emscripten integration.

[`emscripten-reference-types.patch`](emscripten-reference-types.patch):
Patch to pass `--enable-reference-types` to Binaryen feature flags.

[`fizzbuzz.cpp`](fizzbuzz.cpp):
`fizz.cpp` and `buzz.cpp` combined.

[`interfaces_types.s`](interface_types.s):
All ITL IDL functions implemented in LLVM Assembly.

[`library.js`](library.js):
`it_loader.js` as Emscripten library.
