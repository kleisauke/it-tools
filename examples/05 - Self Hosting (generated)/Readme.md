# Example #5 - Autogenerated wasm IT polyfill

This is a polyfill for Interface Types. It generates one additional wasm module
per .itl input, and uses one shared JS loader as a runtime.

---

This example demonstrates how one might implement IT adapters in Wasm itself.

## How does it work?

Each module has two parts: the core wasm module, and an adapter wasm module.

### C++ user code

The core wasm module is built with no additional compiler support. The C++ here
is taken directly from Example #2, using the C++ DSL.

Looking at fizz.cpp, we have two normal C++ functions, isFizz and fizzStr, which
we export with a DSL annotation:

```c++
export {
    func isFizz(s32) -> u1;
    func fizzStr() -> string;
}

// This gets translated into the following C++ function declarations

__attribute__((export_name("isFizz"))) bool isFizz(int);
__attribute__((export_name("fizzStr"))) const char* fizzStr();
```

Which in turn become Wasm function exports.

In fizzbuzz.cpp, we have matching imports:

```c++
import "fizz" {
    func isFizz(s32) -> u1;
    func fizzStr() -> string;
}

// Which becomes

__attribute__((import_module("fizz"), import_name("isFizz"))) bool isFizz(int);
__attribute__((import_module("fizz"), import_name("fizzStr"))) const char* fizzStr();
```

### Generated ITL

Then the C++ DSL generates an .itl file, which represents its IT definition.

```
(export
    (func _it_isFizz "isFizz" (param s32) (result u1)
        (as u1 (call isFizz
            (as i32 (local 0))))
    )
    (func _it_fizzStr "fizzStr" (param ) (result string)
        (call _it_cppToString (call fizzStr))
    )
)
```

The general pattern of what these functions do:

1. translate the arguments from IT to C++
2. call the internal function
3. translate the return value from C++ back to IT

### IT .wat

From the ITL, we can generate a JS or wasm wrapper. Here, we're choosing wasm.

We can transcribe those functions into wasm that looks like:

```wasm
;; core wasm functions
(func $isFizz (param i32) (result i32)
    (call_indirect (param i32) (result i32)
        (local.get 0)
        (i32.const 0))
)
(func $fizzStr (param ) (result i32)
    (call_indirect (param ) (result i32)
         (i32.const 1))
)

;; exported IT-wrapped versions
(func $_it_isFizz (export "isFizz") (param i32) (result i32)
    (local )
    (call $isFizz (local.get 0))
)
(func $_it_fizzStr (export "fizzStr") (param ) (result anyref)
    (local )
    (call $_it_cppToString (call $fizzStr ))
)
```

TODO

* break down init function
* talk about how string literals are represented

### Loader JS

There's one shared JS file that handles loading any ITL-derived wasm modules.
Its main purpose is to provide the five key IT runtime functions needed:

* `string_len`: reads the length of any IT strings
* `mem_to_string`: reads a string out of wasm memory
* `string_to_mem`: writes a string into wasm memory
* `load_wasm`: loads and instantiates a wasm module (instance) from a filename
* `set_table_func`: stores a function reference in the IT module's table