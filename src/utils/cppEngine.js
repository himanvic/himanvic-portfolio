// File Name: cppEngine.js
// Typed linear-memory bridge connecting React UI to compiled C++20 WebAssembly core

let wasmState = null;
let loadPromise = null;

const createViews = (instance) => {
  const exports = instance.exports;
  const mem = exports.memory.buffer;
  return {
    exports,
    memory: exports.memory,
    particleXY: new Float32Array(mem, exports.get_particle_xy_ptr(), 1024 * 2),
    sortArray: new Int32Array(mem, exports.get_sort_array_ptr(), 64),
    traceBuffer: new Int32Array(mem, exports.get_trace_buffer_ptr(), 2048 * 3),
    orbitOut: new Float32Array(mem, exports.get_orbit_out_ptr(), 8 * 5),
    sunVec: new Float32Array(mem, exports.get_sun_vec_ptr(), 3),
    starXyz: new Float32Array(mem, exports.get_star_xyz_ptr(), 3072 * 3),
  };
};

/**
 * Lazily instantiates /assets/wasm/himanvic_core.wasm once and caches typed views.
 * Returns null cleanly if WebAssembly is blocked so callers can fall back seamlessly.
 */
export async function initCppEngine() {
  if (wasmState) return wasmState;
  if (typeof window === "undefined" || typeof WebAssembly === "undefined") return null;

  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const res = await fetch("/assets/wasm/himanvic_core.wasm", { credentials: "same-origin" });
        if (!res.ok) return null;

        let result;
        if (typeof WebAssembly.instantiateStreaming === "function") {
          try {
            result = await WebAssembly.instantiateStreaming(res.clone());
          } catch {
            const bytes = await res.arrayBuffer();
            result = await WebAssembly.instantiate(bytes);
          }
        } else {
          const bytes = await res.arrayBuffer();
          result = await WebAssembly.instantiate(bytes);
        }

        wasmState = createViews(result.instance);
        return wasmState;
      } catch {
        return null;
      }
    })();
  }

  return loadPromise;
}

export function getCppEngineSync() {
  return wasmState;
}
