mergeInto(LibraryManager.library, {
    $stringTable: {},

    $memToString: function(memory, ptr, len) {
        var u8 = new Uint8Array(memory.buffer);
        var str = '';
        for (var i = 0; i < len; ++i) {
            str += String.fromCharCode(u8[ptr + i]);
        }
        return str;
    },

    $stringToMem: function(memory, str, ptr) {
        var u8 = new Uint8Array(memory.buffer);
        var len = str.length;
        for (var i = 0; i < len; ++i) {
            u8[ptr + i] = str.charCodeAt(i);
        }
        return len;
    },

    $readITString__deps: ['$stringTable', '$memToString'],
    $readITString: function(ptr) {
        // Read IT-module string
        // ABI is first byte = length, followed by chars

        // If string has been read before, just reuse it
        var str = stringTable[ptr];
        if (str !== undefined) {
            return str;
        }

        // Read string out of memory, and cache it
        var memory = wasmMemory;
        var u8 = new Uint8Array(memory.buffer);
        var len = u8[ptr];
        str = memToString(memory, ptr + 1, len)
        stringTable[ptr] = str;
        return str;
    },

    $readITValue: function(ptr) {
        var str = readITString(ptr);
        return Module["asm"][str];
    },

    // Runtime functions
    string_len__asm: true,
    //string_len__sig: 'ir',
    string_len__sig: 'ii',
    string_len: function(str) {
        return str.length;
    },

    mem_to_string__asm: true,
    //mem_to_string__sig: 'rii',
    mem_to_string__sig: 'iii',
    mem_to_string__deps: ['$memToString'],
    mem_to_string: function(ptr, len) {
        return memToString(wasmMemory, ptr, len);
    },

    string_to_mem__asm: true,
    //string_to_mem__sig: 'iri',
    string_to_mem__sig: 'iii',
    string_to_mem__deps: ['$stringToMem'],
    string_to_mem: function(str, ptr) {
        return stringToMem(wasmMemory, str, ptr);
    },

    add_table_func__asm: true,
    add_table_func__sig: 'iii',
    add_table_func__deps: ['$readITValue'],
    add_table_func: function(namePtr) {
        // sets IT table index to a property on a module
        var table = wasmTable;
        var idx = table.length;
        table.grow(1);
        var val = readITValue(namePtr);
        table.set(idx, val);
        return idx;
    },

    console_log__asm: true,
    console_log__sig: 'vi',
    //console_log__sig: 'vr',
    console_log: function(str) {
        console.log(str);
    },

    console_logInt__asm: true,
    console_logInt__sig: 'vi',
    console_logInt: function(int) {
        console.log(int);
    }
});

DEFAULT_LIBRARY_FUNCS_TO_INCLUDE.push('string_len', 'mem_to_string', 'string_to_mem', 'add_table_func');
