run: build
	node --experimental-wasm-anyref shell.js
.PHONY: run

serve: build
	emrun --no_browser --port 8080 .

build: out out/fizzbuzz.js

out:
	mkdir -p out

out/%.js: %.cpp interface_types.s
	emcc --js-library library.js $^ -o $@ -s ALLOW_TABLE_GROWTH=1 -O0 -g4 --source-map-base http://localhost:8080/
	wasm2wat --enable-reference-types out/fizzbuzz.wasm -o out/fizzbuzz.wat
