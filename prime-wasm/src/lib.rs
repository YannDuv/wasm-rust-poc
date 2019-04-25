extern crate js_sys;
extern crate wasm_bindgen;

use std::vec;
use wasm_bindgen::prelude::*;

fn squared(a: u32) -> u32 {
    return a*a;
}

#[wasm_bindgen]
pub struct WasmPrime {
    primes: Vec<u32>,
    js_callback: js_sys::Function
}

#[wasm_bindgen]
impl WasmPrime {

    pub fn new(js_callback: js_sys::Function) -> WasmPrime {
        let primes = vec![2];
        
        WasmPrime{
            primes,
            js_callback
        }
    }

    fn print_results(&mut self) {
        let this = JsValue::NULL;
        let end = self.primes.len() - 1;
        for i in (end - 10)..end {
            let v = JsValue::from(self.primes[i]);
            let _ = self.js_callback.call1(&this, &v);
        }
    }


    pub fn start_looking_for_primes(&mut self, limit: u16) -> usize {
        let mut prime: bool;
        
        for i in 3..limit {
            prime = true;

            for k in 0..self.primes.len() {
                if squared(self.primes[k]) > i as u32 {
                    break;
                }
                if i as u32 % self.primes[k] == 0 {
                    prime = false;
                    break;
                }
            }

            if prime {
                self.primes.push(i as u32);

                if self.primes.len() % 10 == 0 {
                    self.print_results();
                }
            }
        }
        
        return self.primes.len();
    }

    pub fn get_primes(&self) -> Vec<u32> {
        return self.primes.clone();
    }
}
