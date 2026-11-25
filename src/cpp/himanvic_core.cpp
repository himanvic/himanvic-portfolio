// File Name: himanvic_core.cpp
// Standalone C++20 WebAssembly Compute Engine (Zero libc / Emscripten bloat)
// Powers particle Euler dynamics, sorting traces, 3D orbital projection, and star generation.

#include <stdint.h>

namespace math {

constexpr float PI = 3.14159265358979323846f;
constexpr float TWO_PI = 6.28318530717958647692f;
constexpr float HALF_PI = 1.57079632679489661923f;

inline float absf(float x) {
  return x < 0.0f ? -x : x;
}

inline float clampf(float x, float lo, float hi) {
  return x < lo ? lo : (x > hi ? hi : x);
}

inline float sqrtf_fast(float x) {
  return x > 0.0f ? __builtin_sqrtf(x) : 0.0f;
}

inline float cbrtf_fast(float x) {
  if (x == 0.0f) return 0.0f;
  bool neg = x < 0.0f;
  float ax = neg ? -x : x;
  uint32_t bits = __builtin_bit_cast(uint32_t, ax);
  bits = bits / 3u + 0x2a517d3cu;
  float y = __builtin_bit_cast(float, bits);
  for (int i = 0; i < 4; ++i) {
    y = (2.0f * y + ax / (y * y)) * (1.0f / 3.0f);
  }
  return neg ? -y : y;
}

inline float wrap_angle(float x) {
  int k = static_cast<int>(x * (1.0f / TWO_PI));
  x -= static_cast<float>(k) * TWO_PI;
  if (x > PI) x -= TWO_PI;
  if (x < -PI) x += TWO_PI;
  return x;
}

inline float sinf_fast(float x) {
  x = wrap_angle(x);
  if (x > HALF_PI) x = PI - x;
  else if (x < -HALF_PI) x = -PI - x;
  float x2 = x * x;
  return x * (1.0f - x2 * (0.16666667f - x2 * (0.0083333338f - x2 * 0.0001984127f)));
}

inline float cosf_fast(float x) {
  return sinf_fast(x + HALF_PI);
}

struct XorShift32 {
  uint32_t state;
  explicit XorShift32(uint32_t seed) : state(seed ? seed : 0x9E3779B9u) {}
  inline uint32_t next_u32() {
    uint32_t x = state;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    state = x;
    return x;
  }
  inline float next_01() {
    return static_cast<float>(next_u32() & 0x00FFFFFFu) * (1.0f / 16777216.0f);
  }
};

} // namespace math

namespace engine {

// 1. Quantum Particle Morph Engine Buffers (SoA layout in WASM linear memory)
constexpr int MAX_PARTICLES = 1024;
static float particle_xy[MAX_PARTICLES * 2];
static float p_vx[MAX_PARTICLES];
static float p_vy[MAX_PARTICLES];
static float p_tx[MAX_PARTICLES];
static float p_ty[MAX_PARTICLES];
static float p_seed[MAX_PARTICLES];
static uint32_t rng_seed = 0x13572468u;

// 2. Sorting Trace Engine Buffers
constexpr int MAX_SORT = 64;
constexpr int MAX_TRACE = 2048;
static int32_t sort_array[MAX_SORT];
static int32_t trace_buffer[MAX_TRACE * 3]; // [op (0=cmp, 1=swap), idx_a, idx_b]
static int trace_count = 0;

inline void push_trace(int32_t op, int32_t a, int32_t b) {
  if (trace_count >= MAX_TRACE) return;
  int base = trace_count * 3;
  trace_buffer[base] = op;
  trace_buffer[base + 1] = a;
  trace_buffer[base + 2] = b;
  trace_count++;
}

int partition_lomuto(int low, int high) {
  int32_t pivot = sort_array[high];
  int i = low - 1;
  for (int j = low; j < high; ++j) {
    push_trace(0, j, high);
    if (sort_array[j] < pivot) {
      i++;
      int32_t tmp = sort_array[i];
      sort_array[i] = sort_array[j];
      sort_array[j] = tmp;
      push_trace(1, i, j);
    }
  }
  int32_t tmp = sort_array[i + 1];
  sort_array[i + 1] = sort_array[high];
  sort_array[high] = tmp;
  push_trace(1, i + 1, high);
  return i + 1;
}

void quicksort_impl(int low, int high) {
  if (low >= high) return;
  int pi = partition_lomuto(low, high);
  quicksort_impl(low, pi - 1);
  quicksort_impl(pi + 1, high);
}

void bubblesort_impl(int count) {
  for (int i = 0; i < count - 1; ++i) {
    bool swapped = false;
    for (int j = 0; j < count - i - 1; ++j) {
      push_trace(0, j, j + 1);
      if (sort_array[j] > sort_array[j + 1]) {
        int32_t tmp = sort_array[j];
        sort_array[j] = sort_array[j + 1];
        sort_array[j + 1] = tmp;
        push_trace(1, j, j + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}

// 3. Solar Orbital & Solar Vector Buffers
constexpr int MAX_PLANETS = 8;
static float orbit_out[MAX_PLANETS * 5]; // [x, y, zIndex, scale, opacity]
static float sun_vec[3];

// 4. Spherical Starfield Buffer
constexpr int MAX_STARS = 3072;
static float star_xyz[MAX_STARS * 3];

} // namespace engine

extern "C" {

// --- Memory Buffer Accessors ---
[[clang::export_name("get_particle_xy_ptr")]]
float* get_particle_xy_ptr() { return engine::particle_xy; }

[[clang::export_name("get_sort_array_ptr")]]
int32_t* get_sort_array_ptr() { return engine::sort_array; }

[[clang::export_name("get_trace_buffer_ptr")]]
int32_t* get_trace_buffer_ptr() { return engine::trace_buffer; }

[[clang::export_name("get_orbit_out_ptr")]]
float* get_orbit_out_ptr() { return engine::orbit_out; }

[[clang::export_name("get_sun_vec_ptr")]]
float* get_sun_vec_ptr() { return engine::sun_vec; }

[[clang::export_name("get_star_xyz_ptr")]]
float* get_star_xyz_ptr() { return engine::star_xyz; }

// --- Particle Euler Physics ---
[[clang::export_name("set_particle_pos")]]
void set_particle_pos(int idx, float x, float y, float vx, float vy, float tx, float ty, float seed) {
  if (idx < 0 || idx >= engine::MAX_PARTICLES) return;
  engine::particle_xy[idx * 2] = x;
  engine::particle_xy[idx * 2 + 1] = y;
  engine::p_vx[idx] = vx;
  engine::p_vy[idx] = vy;
  engine::p_tx[idx] = tx;
  engine::p_ty[idx] = ty;
  engine::p_seed[idx] = seed;
}

[[clang::export_name("set_particle_target")]]
void set_particle_target(int idx, float tx, float ty, float burst_vx, float burst_vy) {
  if (idx < 0 || idx >= engine::MAX_PARTICLES) return;
  engine::p_tx[idx] = tx;
  engine::p_ty[idx] = ty;
  engine::p_vx[idx] += burst_vx;
  engine::p_vy[idx] += burst_vy;
}

[[clang::export_name("trigger_shockwave")]]
void trigger_shockwave(int count, float cx, float cy) {
  int n = count < engine::MAX_PARTICLES ? count : engine::MAX_PARTICLES;
  math::XorShift32 rng(engine::rng_seed);
  for (int i = 0; i < n; ++i) {
    float dx = engine::particle_xy[i * 2] - cx;
    float dy = engine::particle_xy[i * 2 + 1] - cy;
    float dist = math::sqrtf_fast(dx * dx + dy * dy);
    if (dist < 260.0f && dist > 0.001f) {
      float push = (1.0f - dist / 260.0f) * 32.0f;
      float jitter = (rng.next_01() - 0.5f) * 0.25f;
      float nx = dx / dist;
      float ny = dy / dist;
      engine::p_vx[i] += (nx - ny * jitter) * push;
      engine::p_vy[i] += (ny + nx * jitter) * push;
    }
  }
  engine::rng_seed = rng.state;
}

[[clang::export_name("step_particles")]]
void step_particles(int count, float t_sec, float mouse_x, float mouse_y, int mouse_active) {
  int n = count < engine::MAX_PARTICLES ? count : engine::MAX_PARTICLES;
  for (int i = 0; i < n; ++i) {
    float px = engine::particle_xy[i * 2];
    float py = engine::particle_xy[i * 2 + 1];
    float seed = engine::p_seed[i];

    float jx = math::sinf_fast(t_sec * 2.5f + seed) * 0.65f;
    float jy = math::cosf_fast(t_sec * 2.2f + seed * 1.3f) * 0.65f;

    float dx = engine::p_tx[i] + jx - px;
    float dy = engine::p_ty[i] + jy - py;
    float vx = (engine::p_vx[i] + dx * 0.055f) * 0.84f;
    float vy = (engine::p_vy[i] + dy * 0.055f) * 0.84f;

    if (mouse_active) {
      float mdx = px - mouse_x;
      float mdy = py - mouse_y;
      float dist = math::sqrtf_fast(mdx * mdx + mdy * mdy);
      if (dist < 110.0f && dist > 0.001f) {
        float push = (1.0f - dist / 110.0f) * 16.0f;
        vx += (mdx / dist) * push;
        vy += (mdy / dist) * push;
      }
    }

    engine::p_vx[i] = vx;
    engine::p_vy[i] = vy;
    engine::particle_xy[i * 2] = px + vx;
    engine::particle_xy[i * 2 + 1] = py + vy;
  }
}

// --- Native Sorting Execution ---
[[clang::export_name("sort_run")]]
int sort_run(int algo_id, int count) {
  if (count <= 1 || count > engine::MAX_SORT) return 0;
  engine::trace_count = 0;
  if (algo_id == 0) {
    engine::quicksort_impl(0, count - 1);
  } else {
    engine::bubblesort_impl(count);
  }
  return engine::trace_count;
}

// --- 3D Orbital Billboarding & UTC Solar Vector ---
[[clang::export_name("compute_planet_orbits")]]
void compute_planet_orbits(float base_angle, float rx, float ry, int count, int hovered_idx) {
  int n = count < engine::MAX_PLANETS ? count : engine::MAX_PLANETS;
  constexpr float TILT_RAD = -10.0f * math::PI / 180.0f;
  float cos_tilt = math::cosf_fast(TILT_RAD);
  float sin_tilt = math::sinf_fast(TILT_RAD);
  float step_angle = math::TWO_PI / static_cast<float>(n);

  for (int i = 0; i < n; ++i) {
    float angle = base_angle + static_cast<float>(i) * step_angle;
    float ca = math::cosf_fast(angle);
    float sa = math::sinf_fast(angle);
    float x0 = rx * ca;
    float y0 = ry * sa;

    float x = x0 * cos_tilt - y0 * sin_tilt;
    float y = x0 * sin_tilt + y0 * cos_tilt;
    float depth = sa;

    float z_index = 20.0f;
    float scale = 1.0f;
    float opacity = 1.0f;

    if (hovered_idx == i) {
      z_index = 50.0f;
      scale = 1.12f;
      opacity = 1.0f;
    } else if (depth > 0.0f) {
      z_index = 30.0f;
      scale = 0.98f + 0.2f * depth;
      opacity = 0.9f + 0.1f * depth;
    } else {
      z_index = 10.0f;
      scale = 0.8f + 0.18f * (depth + 1.0f);
      opacity = 0.45f + 0.45f * (depth + 1.0f);
    }

    int base = i * 5;
    engine::orbit_out[base] = x;
    engine::orbit_out[base + 1] = y;
    engine::orbit_out[base + 2] = z_index;
    engine::orbit_out[base + 3] = scale;
    engine::orbit_out[base + 4] = opacity;
  }
}

[[clang::export_name("compute_utc_sun_vector")]]
void compute_utc_sun_vector(float utc_hours) {
  float theta = (utc_hours / 24.0f) * math::TWO_PI;
  float vx = -math::cosf_fast(theta);
  float vy = 0.25f;
  float vz = -math::sinf_fast(theta);
  float inv_len = 1.0f / math::sqrtf_fast(vx * vx + vy * vy + vz * vz);
  engine::sun_vec[0] = vx * inv_len;
  engine::sun_vec[1] = vy * inv_len;
  engine::sun_vec[2] = vz * inv_len;
}

// --- Spherical Uniform Star Sampler ---
[[clang::export_name("fill_sphere_points")]]
void fill_sphere_points(int count, float radius, uint32_t seed) {
  int n = count < engine::MAX_STARS ? count : engine::MAX_STARS;
  math::XorShift32 rng(seed);
  for (int i = 0; i < n; ++i) {
    float theta = rng.next_01() * math::TWO_PI;
    float z = 2.0f * rng.next_01() - 1.0f;
    float r_xy = math::sqrtf_fast(math::clampf(1.0f - z * z, 0.0f, 1.0f));
    float r = radius * math::cbrtf_fast(rng.next_01());

    int base = i * 3;
    engine::star_xyz[base] = r * r_xy * math::cosf_fast(theta);
    engine::star_xyz[base + 1] = r * r_xy * math::sinf_fast(theta);
    engine::star_xyz[base + 2] = r * z;
  }
}

} // extern "C"
