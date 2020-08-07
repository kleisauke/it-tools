# imports
.functype string_len(externref) -> (i32)
.import_module string_len, env
.import_name string_len, string_len
.functype mem_to_string(i32, i32) -> (externref)
.import_module mem_to_string, env
.import_name mem_to_string, mem_to_string
.functype string_to_mem(externref, i32) -> ()
.import_module string_to_mem, env
.import_name string_to_mem, string_to_mem
.functype add_table_func(i32) -> (i32)
.import_module add_table_func, env
.import_name add_table_func, add_table_func
.functype console_log(externref) -> ()
.import_module console_log, env
.import_name console_log, console_log
.functype console_logInt(i32) -> ()
.import_module console_logInt, env
.import_name console_logInt, console_logInt

.globl _it_init
.globl _it_cppToString
.globl _it_stringToCpp

.globl it_log
.globl it_logInt

.globaltype tbl_offset, i32

_it_init:
  .functype _it_init() -> ()
  i32.const fizzbuzz_str
  call add_table_func
  global.set tbl_offset
  i32.const malloc_str
  call add_table_func
  i32.const _it_strlen_str
  call add_table_func
  i32.const _it_writeStringTerm_str
  call add_table_func
  end_function

fizzbuzz:
  .functype fizzbuzz(i32) -> ()
  local.get 0
  global.get tbl_offset
  call_indirect (i32) -> ()
  end_function

# C++ runtime builtin declarations
malloc:
  .functype malloc(i32) -> (i32)
  local.get 0
  global.get tbl_offset
  i32.const 1
  i32.add
  call_indirect (i32) -> (i32)
  end_function

_it_strlen:
  .functype _it_strlen(i32) -> (i32)
  local.get 0
  global.get tbl_offset
  i32.const 2
  i32.add
  call_indirect (i32) -> (i32)
  end_function

_it_writeStringTerm:
  .functype _it_writeStringTerm(i32, i32) -> ()
  local.get 0
  local.get 1
  global.get tbl_offset
  i32.const 3
  i32.add
  call_indirect (i32, i32) -> ()
  end_function

_it_cppToString:
  .functype _it_cppToString(i32) -> (externref)
  local.get 0
  local.get 0
  call _it_strlen
  call mem_to_string
  end_function

_it_stringToCpp:
  .functype _it_stringToCpp(externref) -> (i32)
  .local i32, i32
  local.get 0
  call string_len
  local.tee 1
  i32.const 1
  i32.add
  call malloc
  local.set 2
  local.get 0
  local.get 2
  call string_to_mem
  local.get 2
  local.get 1
  call _it_writeStringTerm
  local.get 2
  end_function

it_log:
  .functype it_log(i32) -> ()
  local.get 0
  call _it_cppToString
  # TESTME: Hackish way to test stringToCpp
  #call _it_stringToCpp
  #call _it_cppToString
  call console_log
  end_function

it_logInt:
  .functype it_logInt(i32) -> ()
  local.get 0
  call console_logInt
  end_function

.section .data,"",@
fizzbuzz_str:
  .int8 8 # length
  .ascii "fizzbuzz"
  .size fizzbuzz_str, 9

malloc_str:
  .int8 6 # length
  .ascii "malloc"
  .size malloc_str, 7

_it_strlen_str:
  .int8 10 # length
  .ascii "_it_strlen"
  .size _it_strlen_str, 11

_it_writeStringTerm_str:
  .int8 19 # length
  .ascii "_it_writeStringTerm"
  .size _it_writeStringTerm_str, 20

tbl_offset:
