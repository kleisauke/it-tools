async function run() {
    try {
        // Load modules
        let loader = require('./it_loader.js');
        let fizz = await loader.instantiate('out/it_fizz.wasm', {});
        let buzz = await loader.instantiate('out/it_buzz.wasm', {});
        let fizzbuzz = await loader.instantiate('out/it_fizzbuzz.wasm', {
            fizz, buzz,
            console: {
                log: console.log,
                logInt: console.log,
            },
        });

        // Run it
        fizzbuzz.fizzbuzz(20);
    } catch (e) {
        // Echo errors on stdout so make prints them
        console.log('[[shell.js ERROR]]')
        console.log(e);
    }
}

run();
