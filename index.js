const LIMIT = 99999;

function lookForPrimes(limit) {
  let primes = [2];
  let isPrime;
  let i, k;

  for (i = 3; i < limit; i++) {
    isPrime = true;

    for (k = 0; k < primes.length; k++) {
      if (Math.pow(primes[k]) > i) {
        break;
      }
      if (i % primes[k] === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
  }
  return primes;
}

function printResult(label, time) {
  let p = document.createElement('p');
  p.innerText = `${label}: ${time}ms`;
  document.body.appendChild(p);
}

function printPrime(prime) {
  let span = document.createElement('span');
  span.innerText = `${prime}-`;
  document.body.appendChild(span);
}

function instantiate(bytes, imports) {
  return WebAssembly.compile(bytes).then(m => new WebAssembly.Instance(m, imports));
}

function logit() {
  console.log('this was invoked by Rust, written in JS');
}

const importObject = { imports: { logit } };

const rust = import('./prime-wasm/pkg/prime_wasm');

rust
  .then(module => {
    let results = [];

    const start = Date.now();
    const prime = module.WasmPrime.new(v => results.push(v));
    prime.start_looking_for_primes(LIMIT);
    const end = Date.now();
    printResult('PrimesWASM', end - start);
    console.log(results);
  })
  .then(() => {
    const start = Date.now();
    lookForPrimes(LIMIT);
    const end = Date.now();
    printResult('PrimesJs', end - start);
  })
  .catch(console.error);


