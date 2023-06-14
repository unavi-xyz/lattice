// @ts-nocheck

let wasmPath = ""

var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (l) {
  let p = 0;
  return function () {
    return p < l.length ? { done: !1, value: l[p++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (l) {
  return { next: $jscomp.arrayIteratorImpl(l) };
};
$jscomp.makeIterator = function (l) {
  const p =
    "undefined" != typeof Symbol && Symbol.iterator && l[Symbol.iterator];
  return p ? p.call(l) : $jscomp.arrayIterator(l);
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.getGlobal = function (l) {
  l = [
    "object" == typeof globalThis && globalThis,
    l,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (let p = 0; p < l.length; ++p) {
    const m = l[p];
    if (m && m.Math == Math) return m;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (l, p, m) {
        if (l == Array.prototype || l == Object.prototype) return l;
        l[p] = m.value;
        return l;
      };
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
const $jscomp$lookupPolyfilledValue = function (l, p) {
  let m = $jscomp.propertyToPolyfillSymbol[p];
  if (null == m) return l[p];
  m = l[m];
  return void 0 !== m ? m : l[p];
};
$jscomp.polyfill = function (l, p, m, r) {
  p &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(l, p, m, r)
      : $jscomp.polyfillUnisolated(l, p, m, r));
};
$jscomp.polyfillUnisolated = function (l, p, m, r) {
  m = $jscomp.global;
  l = l.split(".");
  for (r = 0; r < l.length - 1; r++) {
    const k = l[r];
    if (!(k in m)) return;
    m = m[k];
  }
  l = l[l.length - 1];
  r = m[l];
  p = p(r);
  p != r &&
    null != p &&
    $jscomp.defineProperty(m, l, { configurable: !0, value: p, writable: !0 });
};
$jscomp.polyfillIsolated = function (l, p, m, r) {
  let k = l.split(".");
  l = 1 === k.length;
  r = k[0];
  r = !l && r in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (let C = 0; C < k.length - 1; C++) {
    const h = k[C];
    if (!(h in r)) return;
    r = r[h];
  }
  k = k[k.length - 1];
  m = $jscomp.IS_SYMBOL_NATIVE && "es6" === m ? r[k] : null;
  p = p(m);
  null != p &&
    (l
      ? $jscomp.defineProperty($jscomp.polyfills, k, {
          configurable: !0,
          value: p,
          writable: !0,
        })
      : p !== m &&
        (void 0 === $jscomp.propertyToPolyfillSymbol[k] &&
          ((m = (1e9 * Math.random()) >>> 0),
          ($jscomp.propertyToPolyfillSymbol[k] = $jscomp.IS_SYMBOL_NATIVE
            ? $jscomp.global.Symbol(k)
            : $jscomp.POLYFILL_PREFIX + m + "$" + k)),
        $jscomp.defineProperty(r, $jscomp.propertyToPolyfillSymbol[k], {
          configurable: !0,
          value: p,
          writable: !0,
        })));
};
$jscomp.polyfill(
  "Promise",
  function (l) {
    function p() {
      this.batch_ = null;
    }
    function m(h) {
      return h instanceof k
        ? h
        : new k(function (q, w) {
            q(h);
          });
    }
    if (
      l &&
      (!(
        $jscomp.FORCE_POLYFILL_PROMISE ||
        ($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
          "undefined" === typeof $jscomp.global.PromiseRejectionEvent)
      ) ||
        !$jscomp.global.Promise ||
        -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))
    )
      return l;
    p.prototype.asyncExecute = function (h) {
      if (null == this.batch_) {
        this.batch_ = [];
        const q = this;
        this.asyncExecuteFunction(function () {
          q.executeBatch_();
        });
      }
      this.batch_.push(h);
    };
    const r = $jscomp.global.setTimeout;
    p.prototype.asyncExecuteFunction = function (h) {
      r(h, 0);
    };
    p.prototype.executeBatch_ = function () {
      for (; this.batch_ && this.batch_.length; ) {
        const h = this.batch_;
        this.batch_ = [];
        for (let q = 0; q < h.length; ++q) {
          const w = h[q];
          h[q] = null;
          try {
            w();
          } catch (B) {
            this.asyncThrow_(B);
          }
        }
      }
      this.batch_ = null;
    };
    p.prototype.asyncThrow_ = function (h) {
      this.asyncExecuteFunction(function () {
        throw h;
      });
    };
    var k = function (h) {
      this.state_ = 0;
      this.result_ = void 0;
      this.onSettledCallbacks_ = [];
      this.isRejectionHandled_ = !1;
      const q = this.createResolveAndReject_();
      try {
        h(q.resolve, q.reject);
      } catch (w) {
        q.reject(w);
      }
    };
    k.prototype.createResolveAndReject_ = function () {
      function h(B) {
        return function (v) {
          w || ((w = !0), B.call(q, v));
        };
      }
      var q = this,
        w = !1;
      return { reject: h(this.reject_), resolve: h(this.resolveTo_) };
    };
    k.prototype.resolveTo_ = function (h) {
      if (h === this)
        this.reject_(new TypeError("A Promise cannot resolve to itself"));
      else if (h instanceof k) this.settleSameAsPromise_(h);
      else {
        a: switch (typeof h) {
          case "object":
            var q = null != h;
            break a;
          case "function":
            q = !0;
            break a;
          default:
            q = !1;
        }
        q ? this.resolveToNonPromiseObj_(h) : this.fulfill_(h);
      }
    };
    k.prototype.resolveToNonPromiseObj_ = function (h) {
      let q = void 0;
      try {
        q = h.then;
      } catch (w) {
        this.reject_(w);
        return;
      }
      "function" == typeof q
        ? this.settleSameAsThenable_(q, h)
        : this.fulfill_(h);
    };
    k.prototype.reject_ = function (h) {
      this.settle_(2, h);
    };
    k.prototype.fulfill_ = function (h) {
      this.settle_(1, h);
    };
    k.prototype.settle_ = function (h, q) {
      if (0 != this.state_)
        throw Error(
          "Cannot settle(" +
            h +
            ", " +
            q +
            "): Promise already settled in state" +
            this.state_
        );
      this.state_ = h;
      this.result_ = q;
      2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
      this.executeOnSettledCallbacks_();
    };
    k.prototype.scheduleUnhandledRejectionCheck_ = function () {
      const h = this;
      r(function () {
        if (h.notifyUnhandledRejection_()) {
          const q = $jscomp.global.console;
          "undefined" !== typeof q && q.error(h.result_);
        }
      }, 1);
    };
    k.prototype.notifyUnhandledRejection_ = function () {
      if (this.isRejectionHandled_) return !1;
      let h = $jscomp.global.CustomEvent,
        q = $jscomp.global.Event,
        w = $jscomp.global.dispatchEvent;
      if ("undefined" === typeof w) return !0;
      "function" === typeof h
        ? (h = new h("unhandledrejection", { cancelable: !0 }))
        : "function" === typeof q
        ? (h = new q("unhandledrejection", { cancelable: !0 }))
        : ((h = $jscomp.global.document.createEvent("CustomEvent")),
          h.initCustomEvent("unhandledrejection", !1, !0, h));
      h.promise = this;
      h.reason = this.result_;
      return w(h);
    };
    k.prototype.executeOnSettledCallbacks_ = function () {
      if (null != this.onSettledCallbacks_) {
        for (let h = 0; h < this.onSettledCallbacks_.length; ++h)
          C.asyncExecute(this.onSettledCallbacks_[h]);
        this.onSettledCallbacks_ = null;
      }
    };
    var C = new p();
    k.prototype.settleSameAsPromise_ = function (h) {
      const q = this.createResolveAndReject_();
      h.callWhenSettled_(q.resolve, q.reject);
    };
    k.prototype.settleSameAsThenable_ = function (h, q) {
      const w = this.createResolveAndReject_();
      try {
        h.call(q, w.resolve, w.reject);
      } catch (B) {
        w.reject(B);
      }
    };
    k.prototype.then = function (h, q) {
      function w(I, J) {
        return "function" == typeof I
          ? function (Q) {
              try {
                B(I(Q));
              } catch (R) {
                v(R);
              }
            }
          : J;
      }
      let B,
        v,
        D = new k(function (I, J) {
          B = I;
          v = J;
        });
      this.callWhenSettled_(w(h, B), w(q, v));
      return D;
    };
    k.prototype.catch = function (h) {
      return this.then(void 0, h);
    };
    k.prototype.callWhenSettled_ = function (h, q) {
      function w() {
        switch (B.state_) {
          case 1:
            h(B.result_);
            break;
          case 2:
            q(B.result_);
            break;
          default:
            throw Error("Unexpected state: " + B.state_);
        }
      }
      var B = this;
      null == this.onSettledCallbacks_
        ? C.asyncExecute(w)
        : this.onSettledCallbacks_.push(w);
      this.isRejectionHandled_ = !0;
    };
    k.resolve = m;
    k.reject = function (h) {
      return new k(function (q, w) {
        w(h);
      });
    };
    k.race = function (h) {
      return new k(function (q, w) {
        for (
          let B = $jscomp.makeIterator(h), v = B.next();
          !v.done;
          v = B.next()
        )
          m(v.value).callWhenSettled_(q, w);
      });
    };
    k.all = function (h) {
      let q = $jscomp.makeIterator(h),
        w = q.next();
      return w.done
        ? m([])
        : new k(function (B, v) {
            function D(Q) {
              return function (R) {
                I[Q] = R;
                J--;
                0 == J && B(I);
              };
            }
            var I = [],
              J = 0;
            do
              I.push(void 0),
                J++,
                m(w.value).callWhenSettled_(D(I.length - 1), v),
                (w = q.next());
            while (!w.done);
          });
    };
    return k;
  },
  "es6",
  "es3"
);
$jscomp.owns = function (l, p) {
  return Object.prototype.hasOwnProperty.call(l, p);
};
$jscomp.assign =
  $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign
    ? Object.assign
    : function (l, p) {
        for (let m = 1; m < arguments.length; m++) {
          const r = arguments[m];
          if (r) for (const k in r) $jscomp.owns(r, k) && (l[k] = r[k]);
        }
        return l;
      };
$jscomp.polyfill(
  "Object.assign",
  function (l) {
    return l || $jscomp.assign;
  },
  "es6",
  "es3"
);
$jscomp.checkStringArgs = function (l, p, m) {
  if (null == l)
    throw new TypeError(
      "The 'this' value for String.prototype." +
        m +
        " must not be null or undefined"
    );
  if (p instanceof RegExp)
    throw new TypeError(
      "First argument to String.prototype." +
        m +
        " must not be a regular expression"
    );
  return l + "";
};
$jscomp.polyfill(
  "String.prototype.startsWith",
  function (l) {
    return l
      ? l
      : function (p, m) {
          const r = $jscomp.checkStringArgs(this, p, "startsWith");
          p += "";
          const k = r.length,
            C = p.length;
          m = Math.max(0, Math.min(m | 0, r.length));
          for (var h = 0; h < C && m < k; ) if (r[m++] != p[h++]) return !1;
          return h >= C;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Array.prototype.copyWithin",
  function (l) {
    function p(m) {
      m = Number(m);
      return Infinity === m || -Infinity === m ? m : m | 0;
    }
    return l
      ? l
      : function (m, r, k) {
          const C = this.length;
          m = p(m);
          r = p(r);
          k = void 0 === k ? C : p(k);
          m = 0 > m ? Math.max(C + m, 0) : Math.min(m, C);
          r = 0 > r ? Math.max(C + r, 0) : Math.min(r, C);
          k = 0 > k ? Math.max(C + k, 0) : Math.min(k, C);
          if (m < r)
            for (; r < k; )
              r in this ? (this[m++] = this[r++]) : (delete this[m++], r++);
          else
            for (k = Math.min(k, C + r - m), m += k - r; k > r; )
              --k in this ? (this[--m] = this[k]) : delete this[--m];
          return this;
        };
  },
  "es6",
  "es3"
);
$jscomp.typedArrayCopyWithin = function (l) {
  return l ? l : Array.prototype.copyWithin;
};
$jscomp.polyfill(
  "Int8Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint8Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint8ClampedArray.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Int16Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint16Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Int32Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint32Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Float32Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Float64Array.prototype.copyWithin",
  $jscomp.typedArrayCopyWithin,
  "es6",
  "es5"
);
const DracoEncoderModule = (function () {
  let l =
    "undefined" !== typeof document && document.currentScript
      ? document.currentScript.src
      : void 0;
  "undefined" !== typeof __filename && (l = l || __filename);
  return function (p) {
    function m(f) {
      return a.locateFile ? a.locateFile(f, L) : L + f;
    }
    function r() {
      const f = ba.buffer;
      a.HEAP8 = O = new Int8Array(f);
      a.HEAP16 = ea = new Int16Array(f);
      a.HEAP32 = S = new Int32Array(f);
      a.HEAPU8 = fa = new Uint8Array(f);
      a.HEAPU16 = new Uint16Array(f);
      a.HEAPU32 = T = new Uint32Array(f);
      a.HEAPF32 = ha = new Float32Array(f);
      a.HEAPF64 = new Float64Array(f);
    }
    function k(f) {
      if (a.onAbort) a.onAbort(f);
      f = "Aborted(" + f + ")";
      W(f);
      na = !0;
      f = new WebAssembly.RuntimeError(
        f + ". Build with -sASSERTIONS for more info."
      );
      ca(f);
      throw f;
    }
    function C(f) {
      try {
        if (f == wasmPath && X) return new Uint8Array(X);
        if (ia) return ia(f);
        throw "both async and sync fetching of the wasm failed";
      } catch (b) {
        k(b);
      }
    }
    function h() {
      if (!X && (oa || Y)) {
        if ("function" == typeof fetch && !wasmPath.startsWith("file://"))
          return fetch(wasmPath, { credentials: "same-origin" })
            .then(function (f) {
              if (!f.ok) throw "failed to load wasm binary file at '" + wasmPath + "'";
              return f.arrayBuffer();
            })
            .catch(function () {
              return C(wasmPath);
            });
        if (ja)
          return new Promise(function (f, b) {
            ja(
              wasmPath,
              function (c) {
                f(new Uint8Array(c));
              },
              b
            );
          });
      }
      return Promise.resolve().then(function () {
        return C(wasmPath);
      });
    }
    function q(f) {
      for (; 0 < f.length; ) f.shift()(a);
    }
    function w(f) {
      this.excPtr = f;
      this.ptr = f - 24;
      this.set_type = function (b) {
        T[(this.ptr + 4) >> 2] = b;
      };
      this.get_type = function () {
        return T[(this.ptr + 4) >> 2];
      };
      this.set_destructor = function (b) {
        T[(this.ptr + 8) >> 2] = b;
      };
      this.get_destructor = function () {
        return T[(this.ptr + 8) >> 2];
      };
      this.set_refcount = function (b) {
        S[this.ptr >> 2] = b;
      };
      this.set_caught = function (b) {
        O[(this.ptr + 12) >> 0] = b ? 1 : 0;
      };
      this.get_caught = function () {
        return 0 != O[(this.ptr + 12) >> 0];
      };
      this.set_rethrown = function (b) {
        O[(this.ptr + 13) >> 0] = b ? 1 : 0;
      };
      this.get_rethrown = function () {
        return 0 != O[(this.ptr + 13) >> 0];
      };
      this.init = function (b, c) {
        this.set_adjusted_ptr(0);
        this.set_type(b);
        this.set_destructor(c);
        this.set_refcount(0);
        this.set_caught(!1);
        this.set_rethrown(!1);
      };
      this.add_ref = function () {
        S[this.ptr >> 2] += 1;
      };
      this.release_ref = function () {
        const b = S[this.ptr >> 2];
        S[this.ptr >> 2] = b - 1;
        return 1 === b;
      };
      this.set_adjusted_ptr = function (b) {
        T[(this.ptr + 16) >> 2] = b;
      };
      this.get_adjusted_ptr = function () {
        return T[(this.ptr + 16) >> 2];
      };
      this.get_exception_ptr = function () {
        if (pa(this.get_type())) return T[this.excPtr >> 2];
        const b = this.get_adjusted_ptr();
        return 0 !== b ? b : this.excPtr;
      };
    }
    function B() {
      function f() {
        if (!da && ((da = !0), (a.calledRun = !0), !na)) {
          qa = !0;
          q(ka);
          ra(a);
          if (a.onRuntimeInitialized) a.onRuntimeInitialized();
          if (a.postRun)
            for (
              "function" == typeof a.postRun && (a.postRun = [a.postRun]);
              a.postRun.length;

            )
              sa.unshift(a.postRun.shift());
          q(sa);
        }
      }
      if (!(0 < U)) {
        if (a.preRun)
          for (
            "function" == typeof a.preRun && (a.preRun = [a.preRun]);
            a.preRun.length;

          )
            ta.unshift(a.preRun.shift());
        q(ta);
        0 < U ||
          (a.setStatus
            ? (a.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  a.setStatus("");
                }, 1);
                f();
              }, 1))
            : f());
      }
    }
    function v() {}
    function D(f) {
      return (f || v).__cache__;
    }
    function I(f, b) {
      let c = D(b),
        d = c[f];
      if (d) return d;
      d = Object.create((b || v).prototype);
      d.ptr = f;
      return (c[f] = d);
    }
    function J(f) {
      if ("string" === typeof f) {
        for (var b = 0, c = 0; c < f.length; ++c) {
          var d = f.charCodeAt(c);
          127 >= d
            ? b++
            : 2047 >= d
            ? (b += 2)
            : 55296 <= d && 57343 >= d
            ? ((b += 4), ++c)
            : (b += 3);
        }
        b = Array(b + 1);
        c = 0;
        d = b.length;
        if (0 < d) {
          d = c + d - 1;
          for (let e = 0; e < f.length; ++e) {
            let g = f.charCodeAt(e);
            if (55296 <= g && 57343 >= g) {
              const t = f.charCodeAt(++e);
              g = (65536 + ((g & 1023) << 10)) | (t & 1023);
            }
            if (127 >= g) {
              if (c >= d) break;
              b[c++] = g;
            } else {
              if (2047 >= g) {
                if (c + 1 >= d) break;
                b[c++] = 192 | (g >> 6);
              } else {
                if (65535 >= g) {
                  if (c + 2 >= d) break;
                  b[c++] = 224 | (g >> 12);
                } else {
                  if (c + 3 >= d) break;
                  b[c++] = 240 | (g >> 18);
                  b[c++] = 128 | ((g >> 12) & 63);
                }
                b[c++] = 128 | ((g >> 6) & 63);
              }
              b[c++] = 128 | (g & 63);
            }
          }
          b[c] = 0;
        }
        f = n.alloc(b, O);
        n.copy(b, O, f);
        return f;
      }
      return f;
    }
    function Q(f) {
      if ("object" === typeof f) {
        const b = n.alloc(f, O);
        n.copy(f, O, b);
        return b;
      }
      return f;
    }
    function R(f) {
      if ("object" === typeof f) {
        const b = n.alloc(f, ea);
        n.copy(f, ea, b);
        return b;
      }
      return f;
    }
    function V(f) {
      if ("object" === typeof f) {
        const b = n.alloc(f, S);
        n.copy(f, S, b);
        return b;
      }
      return f;
    }
    function Z(f) {
      if ("object" === typeof f) {
        const b = n.alloc(f, ha);
        n.copy(f, ha, b);
        return b;
      }
      return f;
    }
    function P() {
      throw "cannot construct a VoidPtr, no constructor in IDL";
    }
    function M() {
      this.ptr = ua();
      D(M)[this.ptr] = this;
    }
    function z() {
      this.ptr = va();
      D(z)[this.ptr] = this;
    }
    function G() {
      this.ptr = wa();
      D(G)[this.ptr] = this;
    }
    function E() {
      this.ptr = xa();
      D(E)[this.ptr] = this;
    }
    function N() {
      this.ptr = ya();
      D(N)[this.ptr] = this;
    }
    function H() {
      this.ptr = za();
      D(H)[this.ptr] = this;
    }
    function F() {
      this.ptr = Aa();
      D(F)[this.ptr] = this;
    }
    function x() {
      this.ptr = Ba();
      D(x)[this.ptr] = this;
    }
    function u() {
      this.ptr = Ca();
      D(u)[this.ptr] = this;
    }
    function y() {
      this.ptr = Da();
      D(y)[this.ptr] = this;
    }
    function A(f) {
      f && "object" === typeof f && (f = f.ptr);
      this.ptr = Ea(f);
      D(A)[this.ptr] = this;
    }
    p = void 0 === p ? {} : p;
    var a = "undefined" != typeof p ? p : {},
      ra,
      ca;
    a.ready = new Promise(function (f, b) {
      ra = f;
      ca = b;
    });
    let Fa = !1,
      Ga = !1;
    a.onRuntimeInitialized = function () {
      Fa = !0;
      if (Ga && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
    };
    a.onModuleParsed = function () {
      Ga = !0;
      if (Fa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
    };
    a.isVersionSupported = function (f) {
      if ("string" !== typeof f) return !1;
      f = f.split(".");
      return 2 > f.length || 3 < f.length
        ? !1
        : 1 == f[0] && 0 <= f[1] && 5 >= f[1]
        ? !0
        : 0 != f[0] || 10 < f[1]
        ? !1
        : !0;
    };
    var Ha = Object.assign({}, a),
      oa = "object" == typeof window,
      Y = "function" == typeof importScripts,
      Ia =
        "object" == typeof process &&
        "object" == typeof process.versions &&
        "string" == typeof process.versions.node,
      L = "";
    if (Ia) {
      const Ja = require("fs"),
        la = require("path");
      L = Y ? la.dirname(L) + "/" : __dirname + "/";
      var Ka = function (f, b) {
        f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
        return Ja.readFileSync(f, b ? void 0 : "utf8");
      };
      var ia = function (f) {
        f = Ka(f, !0);
        f.buffer || (f = new Uint8Array(f));
        return f;
      };
      var ja = function (f, b, c) {
        f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
        Ja.readFile(f, function (d, e) {
          d ? c(d) : b(e.buffer);
        });
      };
      1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
      process.argv.slice(2);
      a.inspect = function () {
        return "[Emscripten Module object]";
      };
    } else if (oa || Y)
      Y
        ? (L = self.location.href)
        : "undefined" != typeof document &&
          document.currentScript &&
          (L = document.currentScript.src),
        l && (L = l),
        (L =
          0 !== L.indexOf("blob:")
            ? L.substr(0, L.replace(/[?#].*/, "").lastIndexOf("/") + 1)
            : ""),
        (Ka = function (f) {
          const b = new XMLHttpRequest();
          b.open("GET", f, !1);
          b.send(null);
          return b.responseText;
        }),
        Y &&
          (ia = function (f) {
            const b = new XMLHttpRequest();
            b.open("GET", f, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }),
        (ja = function (f, b, c) {
          const d = new XMLHttpRequest();
          d.open("GET", f, !0);
          d.responseType = "arraybuffer";
          d.onload = function () {
            200 == d.status || (0 == d.status && d.response)
              ? b(d.response)
              : c();
          };
          d.onerror = c;
          d.send(null);
        });
    a.print || console.log.bind(console);
    var W = a.printErr || console.warn.bind(console);
    Object.assign(a, Ha);
    Ha = null;
    let X;
    a.wasmBinary && (X = a.wasmBinary);
    "object" != typeof WebAssembly && k("no native wasm support detected");
    var ba,
      na = !1,
      O,
      fa,
      ea,
      S,
      T,
      ha,
      ta = [],
      ka = [],
      sa = [],
      qa = !1,
      U = 0,
      ma = null,
      aa = null;

    wasmPath.startsWith("data:application/octet-stream;base64,") || (wasmPath = m(wasmPath));
    let nc = 0,
      oc = {
        a: function () {
          k("");
        },
        b: function (f, b, c) {
          new w(f).init(b, c);
          nc++;
          throw f;
        },
        c: function (f) {
          const b = fa.length;
          f >>>= 0;
          if (2147483648 < f) return !1;
          for (let c = 1; 4 >= c; c *= 2) {
            let d = b * (1 + 0.2 / c);
            d = Math.min(d, f + 100663296);
            let e = Math;
            d = Math.max(f, d);
            e = e.min.call(e, 2147483648, d + ((65536 - (d % 65536)) % 65536));
            a: {
              d = ba.buffer;
              try {
                ba.grow((e - d.byteLength + 65535) >>> 16);
                r();
                var g = 1;
                break a;
              } catch (t) {}
              g = void 0;
            }
            if (g) return !0;
          }
          return !1;
        },
        d: function (f, b, c) {
          fa.copyWithin(f, b, b + c);
        },
      };
    (function () {
      function f(e, g) {
        a.asm = e.exports;
        ba = a.asm.e;
        r();
        ka.unshift(a.asm.f);
        U--;
        a.monitorRunDependencies && a.monitorRunDependencies(U);
        0 == U &&
          (null !== ma && (clearInterval(ma), (ma = null)),
          aa && ((e = aa), (aa = null), e()));
      }
      function b(e) {
        f(e.instance);
      }
      function c(e) {
        return h()
          .then(function (g) {
            return WebAssembly.instantiate(g, d);
          })
          .then(function (g) {
            return g;
          })
          .then(e, function (g) {
            W("failed to asynchronously prepare wasm: " + g);
            k(g);
          });
      }
      var d = { a: oc };
      U++;
      a.monitorRunDependencies && a.monitorRunDependencies(U);
      if (a.instantiateWasm)
        try {
          return a.instantiateWasm(d, f);
        } catch (e) {
          W("Module.instantiateWasm callback failed with error: " + e), ca(e);
        }
      (function () {
        return X ||
          "function" != typeof WebAssembly.instantiateStreaming ||
          wasmPath.startsWith("data:application/octet-stream;base64,") ||
          wasmPath.startsWith("file://") ||
          Ia ||
          "function" != typeof fetch
          ? c(b)
          : fetch(wasmPath, { credentials: "same-origin" }).then(function (e) {
              return WebAssembly.instantiateStreaming(e, d).then(
                b,
                function (g) {
                  W("wasm streaming compile failed: " + g);
                  W("falling back to ArrayBuffer instantiation");
                  return c(b);
                }
              );
            });
      })().catch(ca);
      return {};
    })();
    var La = (a._emscripten_bind_VoidPtr___destroy___0 = function () {
        return (La = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.h).apply(
          null,
          arguments
        );
      }),
      ua = (a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 =
        function () {
          return (ua =
            a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 =
              a.asm.i).apply(null, arguments);
        }),
      Ma = (a._emscripten_bind_GeometryAttribute___destroy___0 = function () {
        return (Ma = a._emscripten_bind_GeometryAttribute___destroy___0 =
          a.asm.j).apply(null, arguments);
      }),
      va = (a._emscripten_bind_PointAttribute_PointAttribute_0 = function () {
        return (va = a._emscripten_bind_PointAttribute_PointAttribute_0 =
          a.asm.k).apply(null, arguments);
      }),
      Na = (a._emscripten_bind_PointAttribute_size_0 = function () {
        return (Na = a._emscripten_bind_PointAttribute_size_0 = a.asm.l).apply(
          null,
          arguments
        );
      }),
      Oa = (a._emscripten_bind_PointAttribute_attribute_type_0 = function () {
        return (Oa = a._emscripten_bind_PointAttribute_attribute_type_0 =
          a.asm.m).apply(null, arguments);
      }),
      Pa = (a._emscripten_bind_PointAttribute_data_type_0 = function () {
        return (Pa = a._emscripten_bind_PointAttribute_data_type_0 =
          a.asm.n).apply(null, arguments);
      }),
      Qa = (a._emscripten_bind_PointAttribute_num_components_0 = function () {
        return (Qa = a._emscripten_bind_PointAttribute_num_components_0 =
          a.asm.o).apply(null, arguments);
      }),
      Ra = (a._emscripten_bind_PointAttribute_normalized_0 = function () {
        return (Ra = a._emscripten_bind_PointAttribute_normalized_0 =
          a.asm.p).apply(null, arguments);
      }),
      Sa = (a._emscripten_bind_PointAttribute_byte_stride_0 = function () {
        return (Sa = a._emscripten_bind_PointAttribute_byte_stride_0 =
          a.asm.q).apply(null, arguments);
      }),
      Ta = (a._emscripten_bind_PointAttribute_byte_offset_0 = function () {
        return (Ta = a._emscripten_bind_PointAttribute_byte_offset_0 =
          a.asm.r).apply(null, arguments);
      }),
      Ua = (a._emscripten_bind_PointAttribute_unique_id_0 = function () {
        return (Ua = a._emscripten_bind_PointAttribute_unique_id_0 =
          a.asm.s).apply(null, arguments);
      }),
      Va = (a._emscripten_bind_PointAttribute___destroy___0 = function () {
        return (Va = a._emscripten_bind_PointAttribute___destroy___0 =
          a.asm.t).apply(null, arguments);
      }),
      wa = (a._emscripten_bind_PointCloud_PointCloud_0 = function () {
        return (wa = a._emscripten_bind_PointCloud_PointCloud_0 =
          a.asm.u).apply(null, arguments);
      }),
      Wa = (a._emscripten_bind_PointCloud_num_attributes_0 = function () {
        return (Wa = a._emscripten_bind_PointCloud_num_attributes_0 =
          a.asm.v).apply(null, arguments);
      }),
      Xa = (a._emscripten_bind_PointCloud_num_points_0 = function () {
        return (Xa = a._emscripten_bind_PointCloud_num_points_0 =
          a.asm.w).apply(null, arguments);
      }),
      Ya = (a._emscripten_bind_PointCloud___destroy___0 = function () {
        return (Ya = a._emscripten_bind_PointCloud___destroy___0 =
          a.asm.x).apply(null, arguments);
      }),
      xa = (a._emscripten_bind_Mesh_Mesh_0 = function () {
        return (xa = a._emscripten_bind_Mesh_Mesh_0 = a.asm.y).apply(
          null,
          arguments
        );
      }),
      Za = (a._emscripten_bind_Mesh_num_faces_0 = function () {
        return (Za = a._emscripten_bind_Mesh_num_faces_0 = a.asm.z).apply(
          null,
          arguments
        );
      }),
      $a = (a._emscripten_bind_Mesh_num_attributes_0 = function () {
        return ($a = a._emscripten_bind_Mesh_num_attributes_0 = a.asm.A).apply(
          null,
          arguments
        );
      }),
      ab = (a._emscripten_bind_Mesh_num_points_0 = function () {
        return (ab = a._emscripten_bind_Mesh_num_points_0 = a.asm.B).apply(
          null,
          arguments
        );
      }),
      bb = (a._emscripten_bind_Mesh_set_num_points_1 = function () {
        return (bb = a._emscripten_bind_Mesh_set_num_points_1 = a.asm.C).apply(
          null,
          arguments
        );
      }),
      cb = (a._emscripten_bind_Mesh___destroy___0 = function () {
        return (cb = a._emscripten_bind_Mesh___destroy___0 = a.asm.D).apply(
          null,
          arguments
        );
      }),
      ya = (a._emscripten_bind_Metadata_Metadata_0 = function () {
        return (ya = a._emscripten_bind_Metadata_Metadata_0 = a.asm.E).apply(
          null,
          arguments
        );
      }),
      db = (a._emscripten_bind_Metadata___destroy___0 = function () {
        return (db = a._emscripten_bind_Metadata___destroy___0 = a.asm.F).apply(
          null,
          arguments
        );
      }),
      za = (a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function () {
        return (za = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 =
          a.asm.G).apply(null, arguments);
      }),
      eb = (a._emscripten_bind_DracoInt8Array_GetValue_1 = function () {
        return (eb = a._emscripten_bind_DracoInt8Array_GetValue_1 =
          a.asm.H).apply(null, arguments);
      }),
      fb = (a._emscripten_bind_DracoInt8Array_size_0 = function () {
        return (fb = a._emscripten_bind_DracoInt8Array_size_0 = a.asm.I).apply(
          null,
          arguments
        );
      }),
      gb = (a._emscripten_bind_DracoInt8Array___destroy___0 = function () {
        return (gb = a._emscripten_bind_DracoInt8Array___destroy___0 =
          a.asm.J).apply(null, arguments);
      }),
      Aa = (a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 = function () {
        return (Aa = a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 =
          a.asm.K).apply(null, arguments);
      }),
      hb = (a._emscripten_bind_MetadataBuilder_AddStringEntry_3 = function () {
        return (hb = a._emscripten_bind_MetadataBuilder_AddStringEntry_3 =
          a.asm.L).apply(null, arguments);
      }),
      ib = (a._emscripten_bind_MetadataBuilder_AddIntEntry_3 = function () {
        return (ib = a._emscripten_bind_MetadataBuilder_AddIntEntry_3 =
          a.asm.M).apply(null, arguments);
      }),
      jb = (a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 =
        function () {
          return (jb = a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 =
            a.asm.N).apply(null, arguments);
        }),
      kb = (a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 = function () {
        return (kb = a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 =
          a.asm.O).apply(null, arguments);
      }),
      lb = (a._emscripten_bind_MetadataBuilder___destroy___0 = function () {
        return (lb = a._emscripten_bind_MetadataBuilder___destroy___0 =
          a.asm.P).apply(null, arguments);
      }),
      Ba = (a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 =
        function () {
          return (Ba =
            a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 =
              a.asm.Q).apply(null, arguments);
        }),
      mb = (a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 =
        function () {
          return (mb =
            a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 =
              a.asm.R).apply(null, arguments);
        }),
      nb = (a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 =
        function () {
          return (nb = a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 =
            a.asm.S).apply(null, arguments);
        }),
      ob = (a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 =
        function () {
          return (ob =
            a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 =
              a.asm.T).apply(null, arguments);
        }),
      pb = (a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 =
        function () {
          return (pb =
            a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 =
              a.asm.U).apply(null, arguments);
        }),
      qb = (a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 =
        function () {
          return (qb =
            a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 =
              a.asm.V).apply(null, arguments);
        }),
      rb = (a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 =
        function () {
          return (rb =
            a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 =
              a.asm.W).apply(null, arguments);
        }),
      sb = (a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 =
        function () {
          return (sb =
            a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 =
              a.asm.X).apply(null, arguments);
        }),
      tb = (a._emscripten_bind_PointCloudBuilder_AddMetadata_2 = function () {
        return (tb = a._emscripten_bind_PointCloudBuilder_AddMetadata_2 =
          a.asm.Y).apply(null, arguments);
      }),
      ub = (a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 =
        function () {
          return (ub =
            a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 =
              a.asm.Z).apply(null, arguments);
        }),
      vb = (a._emscripten_bind_PointCloudBuilder___destroy___0 = function () {
        return (vb = a._emscripten_bind_PointCloudBuilder___destroy___0 =
          a.asm._).apply(null, arguments);
      }),
      Ca = (a._emscripten_bind_MeshBuilder_MeshBuilder_0 = function () {
        return (Ca = a._emscripten_bind_MeshBuilder_MeshBuilder_0 =
          a.asm.$).apply(null, arguments);
      }),
      wb = (a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 = function () {
        return (wb = a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 =
          a.asm.aa).apply(null, arguments);
      }),
      xb = (a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 =
        function () {
          return (xb =
            a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 =
              a.asm.ba).apply(null, arguments);
        }),
      yb = (a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 =
        function () {
          return (yb =
            a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 =
              a.asm.ca).apply(null, arguments);
        }),
      zb = (a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 = function () {
        return (zb = a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 =
          a.asm.da).apply(null, arguments);
      }),
      Ab = (a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 = function () {
        return (Ab = a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 =
          a.asm.ea).apply(null, arguments);
      }),
      Bb = (a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 = function () {
        return (Bb = a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 =
          a.asm.fa).apply(null, arguments);
      }),
      Cb = (a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 = function () {
        return (Cb = a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 =
          a.asm.ga).apply(null, arguments);
      }),
      Db = (a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 = function () {
        return (Db = a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 =
          a.asm.ha).apply(null, arguments);
      }),
      Eb = (a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 = function () {
        return (Eb = a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 =
          a.asm.ia).apply(null, arguments);
      }),
      Fb = (a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 = function () {
        return (Fb = a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 =
          a.asm.ja).apply(null, arguments);
      }),
      Gb = (a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 = function () {
        return (Gb = a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 =
          a.asm.ka).apply(null, arguments);
      }),
      Hb = (a._emscripten_bind_MeshBuilder_AddMetadata_2 = function () {
        return (Hb = a._emscripten_bind_MeshBuilder_AddMetadata_2 =
          a.asm.la).apply(null, arguments);
      }),
      Ib = (a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 =
        function () {
          return (Ib =
            a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 =
              a.asm.ma).apply(null, arguments);
        }),
      Jb = (a._emscripten_bind_MeshBuilder___destroy___0 = function () {
        return (Jb = a._emscripten_bind_MeshBuilder___destroy___0 =
          a.asm.na).apply(null, arguments);
      }),
      Da = (a._emscripten_bind_Encoder_Encoder_0 = function () {
        return (Da = a._emscripten_bind_Encoder_Encoder_0 = a.asm.oa).apply(
          null,
          arguments
        );
      }),
      Kb = (a._emscripten_bind_Encoder_SetEncodingMethod_1 = function () {
        return (Kb = a._emscripten_bind_Encoder_SetEncodingMethod_1 =
          a.asm.pa).apply(null, arguments);
      }),
      Lb = (a._emscripten_bind_Encoder_SetAttributeQuantization_2 =
        function () {
          return (Lb = a._emscripten_bind_Encoder_SetAttributeQuantization_2 =
            a.asm.qa).apply(null, arguments);
        }),
      Mb = (a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 =
        function () {
          return (Mb =
            a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 =
              a.asm.ra).apply(null, arguments);
        }),
      Nb = (a._emscripten_bind_Encoder_SetSpeedOptions_2 = function () {
        return (Nb = a._emscripten_bind_Encoder_SetSpeedOptions_2 =
          a.asm.sa).apply(null, arguments);
      }),
      Ob = (a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 =
        function () {
          return (Ob = a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 =
            a.asm.ta).apply(null, arguments);
        }),
      Pb = (a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 = function () {
        return (Pb = a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 =
          a.asm.ua).apply(null, arguments);
      }),
      Qb = (a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 =
        function () {
          return (Qb =
            a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 =
              a.asm.va).apply(null, arguments);
        }),
      Rb = (a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 =
        function () {
          return (Rb = a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 =
            a.asm.wa).apply(null, arguments);
        }),
      Sb = (a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 = function () {
        return (Sb = a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 =
          a.asm.xa).apply(null, arguments);
      }),
      Tb = (a._emscripten_bind_Encoder___destroy___0 = function () {
        return (Tb = a._emscripten_bind_Encoder___destroy___0 = a.asm.ya).apply(
          null,
          arguments
        );
      }),
      Ea = (a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 = function () {
        return (Ea = a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 =
          a.asm.za).apply(null, arguments);
      }),
      Ub = (a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 = function () {
        return (Ub = a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 =
          a.asm.Aa).apply(null, arguments);
      }),
      Vb = (a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 =
        function () {
          return (Vb =
            a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 =
              a.asm.Ba).apply(null, arguments);
        }),
      Wb =
        (a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 =
          function () {
            return (Wb =
              a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 =
                a.asm.Ca).apply(null, arguments);
          }),
      Xb = (a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 = function () {
        return (Xb = a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 =
          a.asm.Da).apply(null, arguments);
      }),
      Yb = (a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 =
        function () {
          return (Yb =
            a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 =
              a.asm.Ea).apply(null, arguments);
        }),
      Zb = (a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 =
        function () {
          return (Zb = a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 =
            a.asm.Fa).apply(null, arguments);
        }),
      $b = (a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 =
        function () {
          return ($b =
            a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 =
              a.asm.Ga).apply(null, arguments);
        }),
      ac = (a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 =
        function () {
          return (ac =
            a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 =
              a.asm.Ha).apply(null, arguments);
        }),
      bc = (a._emscripten_bind_ExpertEncoder___destroy___0 = function () {
        return (bc = a._emscripten_bind_ExpertEncoder___destroy___0 =
          a.asm.Ia).apply(null, arguments);
      }),
      cc = (a._emscripten_enum_draco_GeometryAttribute_Type_INVALID =
        function () {
          return (cc = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID =
            a.asm.Ja).apply(null, arguments);
        }),
      dc = (a._emscripten_enum_draco_GeometryAttribute_Type_POSITION =
        function () {
          return (dc =
            a._emscripten_enum_draco_GeometryAttribute_Type_POSITION =
              a.asm.Ka).apply(null, arguments);
        }),
      ec = (a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL =
        function () {
          return (ec = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL =
            a.asm.La).apply(null, arguments);
        }),
      fc = (a._emscripten_enum_draco_GeometryAttribute_Type_COLOR =
        function () {
          return (fc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR =
            a.asm.Ma).apply(null, arguments);
        }),
      gc = (a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD =
        function () {
          return (gc =
            a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD =
              a.asm.Na).apply(null, arguments);
        }),
      hc = (a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC =
        function () {
          return (hc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC =
            a.asm.Oa).apply(null, arguments);
        }),
      ic = (a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE =
        function () {
          return (ic =
            a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE =
              a.asm.Pa).apply(null, arguments);
        }),
      jc = (a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD =
        function () {
          return (jc =
            a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD =
              a.asm.Qa).apply(null, arguments);
        }),
      kc = (a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH =
        function () {
          return (kc =
            a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH =
              a.asm.Ra).apply(null, arguments);
        }),
      lc =
        (a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING =
          function () {
            return (lc =
              a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING =
                a.asm.Sa).apply(null, arguments);
          }),
      mc =
        (a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING =
          function () {
            return (mc =
              a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING =
                a.asm.Ta).apply(null, arguments);
          });
    a._malloc = function () {
      return (a._malloc = a.asm.Ua).apply(null, arguments);
    };
    a._free = function () {
      return (a._free = a.asm.Va).apply(null, arguments);
    };
    var pa = function () {
      return (pa = a.asm.Wa).apply(null, arguments);
    };
    a.___start_em_js = 19116;
    a.___stop_em_js = 19214;
    let da;
    aa = function b() {
      da || B();
      da || (aa = b);
    };
    if (a.preInit)
      for (
        "function" == typeof a.preInit && (a.preInit = [a.preInit]);
        0 < a.preInit.length;

      )
        a.preInit.pop()();
    B();
    v.prototype = Object.create(v.prototype);
    v.prototype.constructor = v;
    v.prototype.__class__ = v;
    v.__cache__ = {};
    a.WrapperObject = v;
    a.getCache = D;
    a.wrapPointer = I;
    a.castObject = function (b, c) {
      return I(b.ptr, c);
    };
    a.NULL = I(0);
    a.destroy = function (b) {
      if (!b.__destroy__)
        throw "Error: Cannot destroy object. (Did you create it yourself?)";
      b.__destroy__();
      delete D(b.__class__)[b.ptr];
    };
    a.compare = function (b, c) {
      return b.ptr === c.ptr;
    };
    a.getPointer = function (b) {
      return b.ptr;
    };
    a.getClass = function (b) {
      return b.__class__;
    };
    var n = {
      alloc: function (b, c) {
        n.buffer || k(void 0);
        b = b.length * c.BYTES_PER_ELEMENT;
        b = (b + 7) & -8;
        n.pos + b >= n.size
          ? (0 < b || k(void 0),
            (n.needed += b),
            (c = a._malloc(b)),
            n.temps.push(c))
          : ((c = n.buffer + n.pos), (n.pos += b));
        return c;
      },
      buffer: 0,
      copy: function (b, c, d) {
        d >>>= 0;
        switch (c.BYTES_PER_ELEMENT) {
          case 2:
            d >>>= 1;
            break;
          case 4:
            d >>>= 2;
            break;
          case 8:
            d >>>= 3;
        }
        for (let e = 0; e < b.length; e++) c[d + e] = b[e];
      },
      needed: 0,
      pos: 0,
      prepare: function () {
        if (n.needed) {
          for (let b = 0; b < n.temps.length; b++) a._free(n.temps[b]);
          n.temps.length = 0;
          a._free(n.buffer);
          n.buffer = 0;
          n.size += n.needed;
          n.needed = 0;
        }
        n.buffer ||
          ((n.size += 128),
          (n.buffer = a._malloc(n.size)),
          n.buffer || k(void 0));
        n.pos = 0;
      },
      size: 0,
      temps: [],
    };
    P.prototype = Object.create(v.prototype);
    P.prototype.constructor = P;
    P.prototype.__class__ = P;
    P.__cache__ = {};
    a.VoidPtr = P;
    P.prototype.__destroy__ = P.prototype.__destroy__ = function () {
      La(this.ptr);
    };
    M.prototype = Object.create(v.prototype);
    M.prototype.constructor = M;
    M.prototype.__class__ = M;
    M.__cache__ = {};
    a.GeometryAttribute = M;
    M.prototype.__destroy__ = M.prototype.__destroy__ = function () {
      Ma(this.ptr);
    };
    z.prototype = Object.create(v.prototype);
    z.prototype.constructor = z;
    z.prototype.__class__ = z;
    z.__cache__ = {};
    a.PointAttribute = z;
    z.prototype.size = z.prototype.size = function () {
      return Na(this.ptr);
    };
    z.prototype.attribute_type = z.prototype.attribute_type = function () {
      return Oa(this.ptr);
    };
    z.prototype.data_type = z.prototype.data_type = function () {
      return Pa(this.ptr);
    };
    z.prototype.num_components = z.prototype.num_components = function () {
      return Qa(this.ptr);
    };
    z.prototype.normalized = z.prototype.normalized = function () {
      return !!Ra(this.ptr);
    };
    z.prototype.byte_stride = z.prototype.byte_stride = function () {
      return Sa(this.ptr);
    };
    z.prototype.byte_offset = z.prototype.byte_offset = function () {
      return Ta(this.ptr);
    };
    z.prototype.unique_id = z.prototype.unique_id = function () {
      return Ua(this.ptr);
    };
    z.prototype.__destroy__ = z.prototype.__destroy__ = function () {
      Va(this.ptr);
    };
    G.prototype = Object.create(v.prototype);
    G.prototype.constructor = G;
    G.prototype.__class__ = G;
    G.__cache__ = {};
    a.PointCloud = G;
    G.prototype.num_attributes = G.prototype.num_attributes = function () {
      return Wa(this.ptr);
    };
    G.prototype.num_points = G.prototype.num_points = function () {
      return Xa(this.ptr);
    };
    G.prototype.__destroy__ = G.prototype.__destroy__ = function () {
      Ya(this.ptr);
    };
    E.prototype = Object.create(v.prototype);
    E.prototype.constructor = E;
    E.prototype.__class__ = E;
    E.__cache__ = {};
    a.Mesh = E;
    E.prototype.num_faces = E.prototype.num_faces = function () {
      return Za(this.ptr);
    };
    E.prototype.num_attributes = E.prototype.num_attributes = function () {
      return $a(this.ptr);
    };
    E.prototype.num_points = E.prototype.num_points = function () {
      return ab(this.ptr);
    };
    E.prototype.set_num_points = E.prototype.set_num_points = function (b) {
      const c = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      bb(c, b);
    };
    E.prototype.__destroy__ = E.prototype.__destroy__ = function () {
      cb(this.ptr);
    };
    N.prototype = Object.create(v.prototype);
    N.prototype.constructor = N;
    N.prototype.__class__ = N;
    N.__cache__ = {};
    a.Metadata = N;
    N.prototype.__destroy__ = N.prototype.__destroy__ = function () {
      db(this.ptr);
    };
    H.prototype = Object.create(v.prototype);
    H.prototype.constructor = H;
    H.prototype.__class__ = H;
    H.__cache__ = {};
    a.DracoInt8Array = H;
    H.prototype.GetValue = H.prototype.GetValue = function (b) {
      const c = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      return eb(c, b);
    };
    H.prototype.size = H.prototype.size = function () {
      return fb(this.ptr);
    };
    H.prototype.__destroy__ = H.prototype.__destroy__ = function () {
      gb(this.ptr);
    };
    F.prototype = Object.create(v.prototype);
    F.prototype.constructor = F;
    F.prototype.__class__ = F;
    F.__cache__ = {};
    a.MetadataBuilder = F;
    F.prototype.AddStringEntry = F.prototype.AddStringEntry = function (
      b,
      c,
      d
    ) {
      const e = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c = c && "object" === typeof c ? c.ptr : J(c);
      d = d && "object" === typeof d ? d.ptr : J(d);
      return !!hb(e, b, c, d);
    };
    F.prototype.AddIntEntry = F.prototype.AddIntEntry = function (b, c, d) {
      const e = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c = c && "object" === typeof c ? c.ptr : J(c);
      d && "object" === typeof d && (d = d.ptr);
      return !!ib(e, b, c, d);
    };
    F.prototype.AddIntEntryArray = F.prototype.AddIntEntryArray = function (
      b,
      c,
      d,
      e
    ) {
      const g = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c = c && "object" === typeof c ? c.ptr : J(c);
      "object" == typeof d && (d = V(d));
      e && "object" === typeof e && (e = e.ptr);
      return !!jb(g, b, c, d, e);
    };
    F.prototype.AddDoubleEntry = F.prototype.AddDoubleEntry = function (
      b,
      c,
      d
    ) {
      const e = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c = c && "object" === typeof c ? c.ptr : J(c);
      d && "object" === typeof d && (d = d.ptr);
      return !!kb(e, b, c, d);
    };
    F.prototype.__destroy__ = F.prototype.__destroy__ = function () {
      lb(this.ptr);
    };
    x.prototype = Object.create(v.prototype);
    x.prototype.constructor = x;
    x.prototype.__class__ = x;
    x.__cache__ = {};
    a.PointCloudBuilder = x;
    x.prototype.AddFloatAttribute = x.prototype.AddFloatAttribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = Z(g));
      return mb(t, b, c, d, e, g);
    };
    x.prototype.AddInt8Attribute = x.prototype.AddInt8Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = Q(g));
      return nb(t, b, c, d, e, g);
    };
    x.prototype.AddUInt8Attribute = x.prototype.AddUInt8Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = Q(g));
      return ob(t, b, c, d, e, g);
    };
    x.prototype.AddInt16Attribute = x.prototype.AddInt16Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = R(g));
      return pb(t, b, c, d, e, g);
    };
    x.prototype.AddUInt16Attribute = x.prototype.AddUInt16Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = R(g));
      return qb(t, b, c, d, e, g);
    };
    x.prototype.AddInt32Attribute = x.prototype.AddInt32Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = V(g));
      return rb(t, b, c, d, e, g);
    };
    x.prototype.AddUInt32Attribute = x.prototype.AddUInt32Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = V(g));
      return sb(t, b, c, d, e, g);
    };
    x.prototype.AddMetadata = x.prototype.AddMetadata = function (b, c) {
      const d = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      return !!tb(d, b, c);
    };
    x.prototype.SetMetadataForAttribute = x.prototype.SetMetadataForAttribute =
      function (b, c, d) {
        const e = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!ub(e, b, c, d);
      };
    x.prototype.__destroy__ = x.prototype.__destroy__ = function () {
      vb(this.ptr);
    };
    u.prototype = Object.create(v.prototype);
    u.prototype.constructor = u;
    u.prototype.__class__ = u;
    u.__cache__ = {};
    a.MeshBuilder = u;
    u.prototype.AddFacesToMesh = u.prototype.AddFacesToMesh = function (
      b,
      c,
      d
    ) {
      const e = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      "object" == typeof d && (d = V(d));
      return !!wb(e, b, c, d);
    };
    u.prototype.AddFloatAttributeToMesh = u.prototype.AddFloatAttributeToMesh =
      function (b, c, d, e, g) {
        const t = this.ptr;
        n.prepare();
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        e && "object" === typeof e && (e = e.ptr);
        "object" == typeof g && (g = Z(g));
        return xb(t, b, c, d, e, g);
      };
    u.prototype.AddInt32AttributeToMesh = u.prototype.AddInt32AttributeToMesh =
      function (b, c, d, e, g) {
        const t = this.ptr;
        n.prepare();
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        e && "object" === typeof e && (e = e.ptr);
        "object" == typeof g && (g = V(g));
        return yb(t, b, c, d, e, g);
      };
    u.prototype.AddMetadataToMesh = u.prototype.AddMetadataToMesh = function (
      b,
      c
    ) {
      const d = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      return !!zb(d, b, c);
    };
    u.prototype.AddFloatAttribute = u.prototype.AddFloatAttribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = Z(g));
      return Ab(t, b, c, d, e, g);
    };
    u.prototype.AddInt8Attribute = u.prototype.AddInt8Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = Q(g));
      return Bb(t, b, c, d, e, g);
    };
    u.prototype.AddUInt8Attribute = u.prototype.AddUInt8Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = Q(g));
      return Cb(t, b, c, d, e, g);
    };
    u.prototype.AddInt16Attribute = u.prototype.AddInt16Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = R(g));
      return Db(t, b, c, d, e, g);
    };
    u.prototype.AddUInt16Attribute = u.prototype.AddUInt16Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = R(g));
      return Eb(t, b, c, d, e, g);
    };
    u.prototype.AddInt32Attribute = u.prototype.AddInt32Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = V(g));
      return Fb(t, b, c, d, e, g);
    };
    u.prototype.AddUInt32Attribute = u.prototype.AddUInt32Attribute = function (
      b,
      c,
      d,
      e,
      g
    ) {
      const t = this.ptr;
      n.prepare();
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      d && "object" === typeof d && (d = d.ptr);
      e && "object" === typeof e && (e = e.ptr);
      "object" == typeof g && (g = V(g));
      return Gb(t, b, c, d, e, g);
    };
    u.prototype.AddMetadata = u.prototype.AddMetadata = function (b, c) {
      const d = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      return !!Hb(d, b, c);
    };
    u.prototype.SetMetadataForAttribute = u.prototype.SetMetadataForAttribute =
      function (b, c, d) {
        const e = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Ib(e, b, c, d);
      };
    u.prototype.__destroy__ = u.prototype.__destroy__ = function () {
      Jb(this.ptr);
    };
    y.prototype = Object.create(v.prototype);
    y.prototype.constructor = y;
    y.prototype.__class__ = y;
    y.__cache__ = {};
    a.Encoder = y;
    y.prototype.SetEncodingMethod = y.prototype.SetEncodingMethod = function (
      b
    ) {
      const c = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      Kb(c, b);
    };
    y.prototype.SetAttributeQuantization =
      y.prototype.SetAttributeQuantization = function (b, c) {
        const d = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        Lb(d, b, c);
      };
    y.prototype.SetAttributeExplicitQuantization =
      y.prototype.SetAttributeExplicitQuantization = function (b, c, d, e, g) {
        const t = this.ptr;
        n.prepare();
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        "object" == typeof e && (e = Z(e));
        g && "object" === typeof g && (g = g.ptr);
        Mb(t, b, c, d, e, g);
      };
    y.prototype.SetSpeedOptions = y.prototype.SetSpeedOptions = function (
      b,
      c
    ) {
      const d = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      Nb(d, b, c);
    };
    y.prototype.SetTrackEncodedProperties =
      y.prototype.SetTrackEncodedProperties = function (b) {
        const c = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        Ob(c, b);
      };
    y.prototype.EncodeMeshToDracoBuffer = y.prototype.EncodeMeshToDracoBuffer =
      function (b, c) {
        const d = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return Pb(d, b, c);
      };
    y.prototype.EncodePointCloudToDracoBuffer =
      y.prototype.EncodePointCloudToDracoBuffer = function (b, c, d) {
        const e = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return Qb(e, b, c, d);
      };
    y.prototype.GetNumberOfEncodedPoints =
      y.prototype.GetNumberOfEncodedPoints = function () {
        return Rb(this.ptr);
      };
    y.prototype.GetNumberOfEncodedFaces = y.prototype.GetNumberOfEncodedFaces =
      function () {
        return Sb(this.ptr);
      };
    y.prototype.__destroy__ = y.prototype.__destroy__ = function () {
      Tb(this.ptr);
    };
    A.prototype = Object.create(v.prototype);
    A.prototype.constructor = A;
    A.prototype.__class__ = A;
    A.__cache__ = {};
    a.ExpertEncoder = A;
    A.prototype.SetEncodingMethod = A.prototype.SetEncodingMethod = function (
      b
    ) {
      const c = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      Ub(c, b);
    };
    A.prototype.SetAttributeQuantization =
      A.prototype.SetAttributeQuantization = function (b, c) {
        const d = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        Vb(d, b, c);
      };
    A.prototype.SetAttributeExplicitQuantization =
      A.prototype.SetAttributeExplicitQuantization = function (b, c, d, e, g) {
        const t = this.ptr;
        n.prepare();
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        "object" == typeof e && (e = Z(e));
        g && "object" === typeof g && (g = g.ptr);
        Wb(t, b, c, d, e, g);
      };
    A.prototype.SetSpeedOptions = A.prototype.SetSpeedOptions = function (
      b,
      c
    ) {
      const d = this.ptr;
      b && "object" === typeof b && (b = b.ptr);
      c && "object" === typeof c && (c = c.ptr);
      Xb(d, b, c);
    };
    A.prototype.SetTrackEncodedProperties =
      A.prototype.SetTrackEncodedProperties = function (b) {
        const c = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        Yb(c, b);
      };
    A.prototype.EncodeToDracoBuffer = A.prototype.EncodeToDracoBuffer =
      function (b, c) {
        const d = this.ptr;
        b && "object" === typeof b && (b = b.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return Zb(d, b, c);
      };
    A.prototype.GetNumberOfEncodedPoints =
      A.prototype.GetNumberOfEncodedPoints = function () {
        return $b(this.ptr);
      };
    A.prototype.GetNumberOfEncodedFaces = A.prototype.GetNumberOfEncodedFaces =
      function () {
        return ac(this.ptr);
      };
    A.prototype.__destroy__ = A.prototype.__destroy__ = function () {
      bc(this.ptr);
    };
    (function () {
      function b() {
        a.INVALID = cc();
        a.POSITION = dc();
        a.NORMAL = ec();
        a.COLOR = fc();
        a.TEX_COORD = gc();
        a.GENERIC = hc();
        a.INVALID_GEOMETRY_TYPE = ic();
        a.POINT_CLOUD = jc();
        a.TRIANGULAR_MESH = kc();
        a.MESH_SEQUENTIAL_ENCODING = lc();
        a.MESH_EDGEBREAKER_ENCODING = mc();
      }
      qa ? b() : ka.unshift(b);
    })();
    if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
    return p.ready;
  };
})();

/**
 * @param {string} path - pass in import.meta.url
 */
export default function createEncoder(path: string) {
  wasmPath = new URL("draco_encoder.wasm", path).href;
  return DracoEncoderModule as () => Promise<any>;
}
