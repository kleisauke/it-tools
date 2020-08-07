#include <emscripten/emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

extern void _it_init();
extern void it_log(const char *str);
extern void it_logInt(int i);

int main() {
    _it_init();
    return 0;
}

bool isBuzz(int n) {
    return n % 5 == 0;
}

const char *buzzStr() {
    return "Buzz";
}

bool isFizz(int n) {
    return n % 3 == 0;
}

const char *fizzStr() {
    return "Fizz";
}

void EMSCRIPTEN_KEEPALIVE fizzbuzz(int n) {
	auto fizz = fizzStr();
	auto buzz = buzzStr();
    for (int i = 1; i <= n; ++i) {
        if (isFizz(i) && isBuzz(i)) {
            it_log("Fizzier Buzz");
        } else if (isFizz(i)) {
            it_log(fizz);
        } else if (isBuzz(i)) {
            it_log(buzz);
        } else {
            it_logInt(i);
        }
    }
}

// Helper functions used in adapters
__attribute__((export_name("_it_strlen")))
int _it_strlen(const char *str) {
    int len = 0;
    while (*str++)
        len++;
    return len;
}

__attribute__((export_name("_it_writeStringTerm"))) 
void _it_writeStringTerm(char *str, int len) {
    // Writes null-terminator for imported strings
    str[len] = 0;
}

#ifdef __cplusplus
}
#endif
