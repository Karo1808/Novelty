var I0 = Object.defineProperty;
var by = (l) => {
  throw TypeError(l);
};
var tp = (l, s, u) =>
  s in l
    ? I0(l, s, { enumerable: !0, configurable: !0, writable: !0, value: u })
    : (l[s] = u);
var In = (l, s, u) => tp(l, typeof s != "symbol" ? s + "" : s, u),
  Qc = (l, s, u) => s.has(l) || by("Cannot " + u);
var B = (l, s, u) => (
    Qc(l, s, "read from private field"), u ? u.call(l) : s.get(l)
  ),
  Ot = (l, s, u) =>
    s.has(l)
      ? by("Cannot add the same private member more than once")
      : s instanceof WeakSet
        ? s.add(l)
        : s.set(l, u),
  yt = (l, s, u, c) => (
    Qc(l, s, "write to private field"), c ? c.call(l, u) : s.set(l, u), u
  ),
  re = (l, s, u) => (Qc(l, s, "access private method"), u);
var rs = (l, s, u, c) => ({
  set _(f) {
    yt(l, s, f, u);
  },
  get _() {
    return B(l, s, c);
  },
});
function ep(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default")
    ? l.default
    : l;
}
var Gc = { exports: {} },
  Hi = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var _y;
function np() {
  if (_y) return Hi;
  _y = 1;
  var l = Symbol.for("react.transitional.element"),
    s = Symbol.for("react.fragment");
  function u(c, f, h) {
    var v = null;
    if (
      (h !== void 0 && (v = "" + h),
      f.key !== void 0 && (v = "" + f.key),
      "key" in f)
    ) {
      h = {};
      for (var g in f) g !== "key" && (h[g] = f[g]);
    } else h = f;
    return (
      (f = h.ref),
      { $$typeof: l, type: c, key: v, ref: f !== void 0 ? f : null, props: h }
    );
  }
  return (Hi.Fragment = s), (Hi.jsx = u), (Hi.jsxs = u), Hi;
}
var Ey;
function ap() {
  return Ey || ((Ey = 1), (Gc.exports = np())), Gc.exports;
}
var Z = ap(),
  Yc = { exports: {} },
  vt = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ry;
function lp() {
  if (Ry) return vt;
  Ry = 1;
  var l = Symbol.for("react.transitional.element"),
    s = Symbol.for("react.portal"),
    u = Symbol.for("react.fragment"),
    c = Symbol.for("react.strict_mode"),
    f = Symbol.for("react.profiler"),
    h = Symbol.for("react.consumer"),
    v = Symbol.for("react.context"),
    g = Symbol.for("react.forward_ref"),
    S = Symbol.for("react.suspense"),
    d = Symbol.for("react.memo"),
    p = Symbol.for("react.lazy"),
    m = Symbol.iterator;
  function b(E) {
    return E === null || typeof E != "object"
      ? null
      : ((E = (m && E[m]) || E["@@iterator"]),
        typeof E == "function" ? E : null);
  }
  var x = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    M = Object.assign,
    U = {};
  function L(E, N, k) {
    (this.props = E),
      (this.context = N),
      (this.refs = U),
      (this.updater = k || x);
  }
  (L.prototype.isReactComponent = {}),
    (L.prototype.setState = function (E, N) {
      if (typeof E != "object" && typeof E != "function" && E != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, E, N, "setState");
    }),
    (L.prototype.forceUpdate = function (E) {
      this.updater.enqueueForceUpdate(this, E, "forceUpdate");
    });
  function q() {}
  q.prototype = L.prototype;
  function K(E, N, k) {
    (this.props = E),
      (this.context = N),
      (this.refs = U),
      (this.updater = k || x);
  }
  var V = (K.prototype = new q());
  (V.constructor = K), M(V, L.prototype), (V.isPureReactComponent = !0);
  var I = Array.isArray,
    P = { H: null, A: null, T: null, S: null, V: null },
    Y = Object.prototype.hasOwnProperty;
  function F(E, N, k, J, $, lt) {
    return (
      (k = lt.ref),
      { $$typeof: l, type: E, key: N, ref: k !== void 0 ? k : null, props: lt }
    );
  }
  function G(E, N) {
    return F(E.type, N, void 0, void 0, void 0, E.props);
  }
  function w(E) {
    return typeof E == "object" && E !== null && E.$$typeof === l;
  }
  function W(E) {
    var N = { "=": "=0", ":": "=2" };
    return (
      "$" +
      E.replace(/[=:]/g, function (k) {
        return N[k];
      })
    );
  }
  var rt = /\/+/g;
  function et(E, N) {
    return typeof E == "object" && E !== null && E.key != null
      ? W("" + E.key)
      : N.toString(36);
  }
  function dt() {}
  function pt(E) {
    switch (E.status) {
      case "fulfilled":
        return E.value;
      case "rejected":
        throw E.reason;
      default:
        switch (
          (typeof E.status == "string"
            ? E.then(dt, dt)
            : ((E.status = "pending"),
              E.then(
                function (N) {
                  E.status === "pending" &&
                    ((E.status = "fulfilled"), (E.value = N));
                },
                function (N) {
                  E.status === "pending" &&
                    ((E.status = "rejected"), (E.reason = N));
                },
              )),
          E.status)
        ) {
          case "fulfilled":
            return E.value;
          case "rejected":
            throw E.reason;
        }
    }
    throw E;
  }
  function ht(E, N, k, J, $) {
    var lt = typeof E;
    (lt === "undefined" || lt === "boolean") && (E = null);
    var tt = !1;
    if (E === null) tt = !0;
    else
      switch (lt) {
        case "bigint":
        case "string":
        case "number":
          tt = !0;
          break;
        case "object":
          switch (E.$$typeof) {
            case l:
            case s:
              tt = !0;
              break;
            case p:
              return (tt = E._init), ht(tt(E._payload), N, k, J, $);
          }
      }
    if (tt)
      return (
        ($ = $(E)),
        (tt = J === "" ? "." + et(E, 0) : J),
        I($)
          ? ((k = ""),
            tt != null && (k = tt.replace(rt, "$&/") + "/"),
            ht($, N, k, "", function (bt) {
              return bt;
            }))
          : $ != null &&
            (w($) &&
              ($ = G(
                $,
                k +
                  ($.key == null || (E && E.key === $.key)
                    ? ""
                    : ("" + $.key).replace(rt, "$&/") + "/") +
                  tt,
              )),
            N.push($)),
        1
      );
    tt = 0;
    var St = J === "" ? "." : J + ":";
    if (I(E))
      for (var it = 0; it < E.length; it++)
        (J = E[it]), (lt = St + et(J, it)), (tt += ht(J, N, k, lt, $));
    else if (((it = b(E)), typeof it == "function"))
      for (E = it.call(E), it = 0; !(J = E.next()).done; )
        (J = J.value), (lt = St + et(J, it++)), (tt += ht(J, N, k, lt, $));
    else if (lt === "object") {
      if (typeof E.then == "function") return ht(pt(E), N, k, J, $);
      throw (
        ((N = String(E)),
        Error(
          "Objects are not valid as a React child (found: " +
            (N === "[object Object]"
              ? "object with keys {" + Object.keys(E).join(", ") + "}"
              : N) +
            "). If you meant to render a collection of children, use an array instead.",
        ))
      );
    }
    return tt;
  }
  function C(E, N, k) {
    if (E == null) return E;
    var J = [],
      $ = 0;
    return (
      ht(E, J, "", "", function (lt) {
        return N.call(k, lt, $++);
      }),
      J
    );
  }
  function X(E) {
    if (E._status === -1) {
      var N = E._result;
      (N = N()),
        N.then(
          function (k) {
            (E._status === 0 || E._status === -1) &&
              ((E._status = 1), (E._result = k));
          },
          function (k) {
            (E._status === 0 || E._status === -1) &&
              ((E._status = 2), (E._result = k));
          },
        ),
        E._status === -1 && ((E._status = 0), (E._result = N));
    }
    if (E._status === 1) return E._result.default;
    throw E._result;
  }
  var at =
    typeof reportError == "function"
      ? reportError
      : function (E) {
          if (
            typeof window == "object" &&
            typeof window.ErrorEvent == "function"
          ) {
            var N = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof E == "object" &&
                E !== null &&
                typeof E.message == "string"
                  ? String(E.message)
                  : String(E),
              error: E,
            });
            if (!window.dispatchEvent(N)) return;
          } else if (
            typeof process == "object" &&
            typeof process.emit == "function"
          ) {
            process.emit("uncaughtException", E);
            return;
          }
          console.error(E);
        };
  function gt() {}
  return (
    (vt.Children = {
      map: C,
      forEach: function (E, N, k) {
        C(
          E,
          function () {
            N.apply(this, arguments);
          },
          k,
        );
      },
      count: function (E) {
        var N = 0;
        return (
          C(E, function () {
            N++;
          }),
          N
        );
      },
      toArray: function (E) {
        return (
          C(E, function (N) {
            return N;
          }) || []
        );
      },
      only: function (E) {
        if (!w(E))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return E;
      },
    }),
    (vt.Component = L),
    (vt.Fragment = u),
    (vt.Profiler = f),
    (vt.PureComponent = K),
    (vt.StrictMode = c),
    (vt.Suspense = S),
    (vt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P),
    (vt.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (E) {
        return P.H.useMemoCache(E);
      },
    }),
    (vt.cache = function (E) {
      return function () {
        return E.apply(null, arguments);
      };
    }),
    (vt.cloneElement = function (E, N, k) {
      if (E == null)
        throw Error(
          "The argument must be a React element, but you passed " + E + ".",
        );
      var J = M({}, E.props),
        $ = E.key,
        lt = void 0;
      if (N != null)
        for (tt in (N.ref !== void 0 && (lt = void 0),
        N.key !== void 0 && ($ = "" + N.key),
        N))
          !Y.call(N, tt) ||
            tt === "key" ||
            tt === "__self" ||
            tt === "__source" ||
            (tt === "ref" && N.ref === void 0) ||
            (J[tt] = N[tt]);
      var tt = arguments.length - 2;
      if (tt === 1) J.children = k;
      else if (1 < tt) {
        for (var St = Array(tt), it = 0; it < tt; it++)
          St[it] = arguments[it + 2];
        J.children = St;
      }
      return F(E.type, $, void 0, void 0, lt, J);
    }),
    (vt.createContext = function (E) {
      return (
        (E = {
          $$typeof: v,
          _currentValue: E,
          _currentValue2: E,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (E.Provider = E),
        (E.Consumer = { $$typeof: h, _context: E }),
        E
      );
    }),
    (vt.createElement = function (E, N, k) {
      var J,
        $ = {},
        lt = null;
      if (N != null)
        for (J in (N.key !== void 0 && (lt = "" + N.key), N))
          Y.call(N, J) &&
            J !== "key" &&
            J !== "__self" &&
            J !== "__source" &&
            ($[J] = N[J]);
      var tt = arguments.length - 2;
      if (tt === 1) $.children = k;
      else if (1 < tt) {
        for (var St = Array(tt), it = 0; it < tt; it++)
          St[it] = arguments[it + 2];
        $.children = St;
      }
      if (E && E.defaultProps)
        for (J in ((tt = E.defaultProps), tt))
          $[J] === void 0 && ($[J] = tt[J]);
      return F(E, lt, void 0, void 0, null, $);
    }),
    (vt.createRef = function () {
      return { current: null };
    }),
    (vt.forwardRef = function (E) {
      return { $$typeof: g, render: E };
    }),
    (vt.isValidElement = w),
    (vt.lazy = function (E) {
      return { $$typeof: p, _payload: { _status: -1, _result: E }, _init: X };
    }),
    (vt.memo = function (E, N) {
      return { $$typeof: d, type: E, compare: N === void 0 ? null : N };
    }),
    (vt.startTransition = function (E) {
      var N = P.T,
        k = {};
      P.T = k;
      try {
        var J = E(),
          $ = P.S;
        $ !== null && $(k, J),
          typeof J == "object" &&
            J !== null &&
            typeof J.then == "function" &&
            J.then(gt, at);
      } catch (lt) {
        at(lt);
      } finally {
        P.T = N;
      }
    }),
    (vt.unstable_useCacheRefresh = function () {
      return P.H.useCacheRefresh();
    }),
    (vt.use = function (E) {
      return P.H.use(E);
    }),
    (vt.useActionState = function (E, N, k) {
      return P.H.useActionState(E, N, k);
    }),
    (vt.useCallback = function (E, N) {
      return P.H.useCallback(E, N);
    }),
    (vt.useContext = function (E) {
      return P.H.useContext(E);
    }),
    (vt.useDebugValue = function () {}),
    (vt.useDeferredValue = function (E, N) {
      return P.H.useDeferredValue(E, N);
    }),
    (vt.useEffect = function (E, N, k) {
      var J = P.H;
      if (typeof k == "function")
        throw Error(
          "useEffect CRUD overload is not enabled in this build of React.",
        );
      return J.useEffect(E, N);
    }),
    (vt.useId = function () {
      return P.H.useId();
    }),
    (vt.useImperativeHandle = function (E, N, k) {
      return P.H.useImperativeHandle(E, N, k);
    }),
    (vt.useInsertionEffect = function (E, N) {
      return P.H.useInsertionEffect(E, N);
    }),
    (vt.useLayoutEffect = function (E, N) {
      return P.H.useLayoutEffect(E, N);
    }),
    (vt.useMemo = function (E, N) {
      return P.H.useMemo(E, N);
    }),
    (vt.useOptimistic = function (E, N) {
      return P.H.useOptimistic(E, N);
    }),
    (vt.useReducer = function (E, N, k) {
      return P.H.useReducer(E, N, k);
    }),
    (vt.useRef = function (E) {
      return P.H.useRef(E);
    }),
    (vt.useState = function (E) {
      return P.H.useState(E);
    }),
    (vt.useSyncExternalStore = function (E, N, k) {
      return P.H.useSyncExternalStore(E, N, k);
    }),
    (vt.useTransition = function () {
      return P.H.useTransition();
    }),
    (vt.version = "19.1.0"),
    vt
  );
}
var Ty;
function Ji() {
  return Ty || ((Ty = 1), (Yc.exports = lp())), Yc.exports;
}
var st = Ji();
const Yi = ep(st);
var Vc = { exports: {} },
  ji = {},
  Xc = { exports: {} },
  Kc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var My;
function ip() {
  return (
    My ||
      ((My = 1),
      (function (l) {
        function s(C, X) {
          var at = C.length;
          C.push(X);
          t: for (; 0 < at; ) {
            var gt = (at - 1) >>> 1,
              E = C[gt];
            if (0 < f(E, X)) (C[gt] = X), (C[at] = E), (at = gt);
            else break t;
          }
        }
        function u(C) {
          return C.length === 0 ? null : C[0];
        }
        function c(C) {
          if (C.length === 0) return null;
          var X = C[0],
            at = C.pop();
          if (at !== X) {
            C[0] = at;
            t: for (var gt = 0, E = C.length, N = E >>> 1; gt < N; ) {
              var k = 2 * (gt + 1) - 1,
                J = C[k],
                $ = k + 1,
                lt = C[$];
              if (0 > f(J, at))
                $ < E && 0 > f(lt, J)
                  ? ((C[gt] = lt), (C[$] = at), (gt = $))
                  : ((C[gt] = J), (C[k] = at), (gt = k));
              else if ($ < E && 0 > f(lt, at))
                (C[gt] = lt), (C[$] = at), (gt = $);
              else break t;
            }
          }
          return X;
        }
        function f(C, X) {
          var at = C.sortIndex - X.sortIndex;
          return at !== 0 ? at : C.id - X.id;
        }
        if (
          ((l.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var h = performance;
          l.unstable_now = function () {
            return h.now();
          };
        } else {
          var v = Date,
            g = v.now();
          l.unstable_now = function () {
            return v.now() - g;
          };
        }
        var S = [],
          d = [],
          p = 1,
          m = null,
          b = 3,
          x = !1,
          M = !1,
          U = !1,
          L = !1,
          q = typeof setTimeout == "function" ? setTimeout : null,
          K = typeof clearTimeout == "function" ? clearTimeout : null,
          V = typeof setImmediate < "u" ? setImmediate : null;
        function I(C) {
          for (var X = u(d); X !== null; ) {
            if (X.callback === null) c(d);
            else if (X.startTime <= C)
              c(d), (X.sortIndex = X.expirationTime), s(S, X);
            else break;
            X = u(d);
          }
        }
        function P(C) {
          if (((U = !1), I(C), !M))
            if (u(S) !== null) (M = !0), Y || ((Y = !0), et());
            else {
              var X = u(d);
              X !== null && ht(P, X.startTime - C);
            }
        }
        var Y = !1,
          F = -1,
          G = 5,
          w = -1;
        function W() {
          return L ? !0 : !(l.unstable_now() - w < G);
        }
        function rt() {
          if (((L = !1), Y)) {
            var C = l.unstable_now();
            w = C;
            var X = !0;
            try {
              t: {
                (M = !1), U && ((U = !1), K(F), (F = -1)), (x = !0);
                var at = b;
                try {
                  e: {
                    for (
                      I(C), m = u(S);
                      m !== null && !(m.expirationTime > C && W());

                    ) {
                      var gt = m.callback;
                      if (typeof gt == "function") {
                        (m.callback = null), (b = m.priorityLevel);
                        var E = gt(m.expirationTime <= C);
                        if (((C = l.unstable_now()), typeof E == "function")) {
                          (m.callback = E), I(C), (X = !0);
                          break e;
                        }
                        m === u(S) && c(S), I(C);
                      } else c(S);
                      m = u(S);
                    }
                    if (m !== null) X = !0;
                    else {
                      var N = u(d);
                      N !== null && ht(P, N.startTime - C), (X = !1);
                    }
                  }
                  break t;
                } finally {
                  (m = null), (b = at), (x = !1);
                }
                X = void 0;
              }
            } finally {
              X ? et() : (Y = !1);
            }
          }
        }
        var et;
        if (typeof V == "function")
          et = function () {
            V(rt);
          };
        else if (typeof MessageChannel < "u") {
          var dt = new MessageChannel(),
            pt = dt.port2;
          (dt.port1.onmessage = rt),
            (et = function () {
              pt.postMessage(null);
            });
        } else
          et = function () {
            q(rt, 0);
          };
        function ht(C, X) {
          F = q(function () {
            C(l.unstable_now());
          }, X);
        }
        (l.unstable_IdlePriority = 5),
          (l.unstable_ImmediatePriority = 1),
          (l.unstable_LowPriority = 4),
          (l.unstable_NormalPriority = 3),
          (l.unstable_Profiling = null),
          (l.unstable_UserBlockingPriority = 2),
          (l.unstable_cancelCallback = function (C) {
            C.callback = null;
          }),
          (l.unstable_forceFrameRate = function (C) {
            0 > C || 125 < C
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (G = 0 < C ? Math.floor(1e3 / C) : 5);
          }),
          (l.unstable_getCurrentPriorityLevel = function () {
            return b;
          }),
          (l.unstable_next = function (C) {
            switch (b) {
              case 1:
              case 2:
              case 3:
                var X = 3;
                break;
              default:
                X = b;
            }
            var at = b;
            b = X;
            try {
              return C();
            } finally {
              b = at;
            }
          }),
          (l.unstable_requestPaint = function () {
            L = !0;
          }),
          (l.unstable_runWithPriority = function (C, X) {
            switch (C) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                C = 3;
            }
            var at = b;
            b = C;
            try {
              return X();
            } finally {
              b = at;
            }
          }),
          (l.unstable_scheduleCallback = function (C, X, at) {
            var gt = l.unstable_now();
            switch (
              (typeof at == "object" && at !== null
                ? ((at = at.delay),
                  (at = typeof at == "number" && 0 < at ? gt + at : gt))
                : (at = gt),
              C)
            ) {
              case 1:
                var E = -1;
                break;
              case 2:
                E = 250;
                break;
              case 5:
                E = 1073741823;
                break;
              case 4:
                E = 1e4;
                break;
              default:
                E = 5e3;
            }
            return (
              (E = at + E),
              (C = {
                id: p++,
                callback: X,
                priorityLevel: C,
                startTime: at,
                expirationTime: E,
                sortIndex: -1,
              }),
              at > gt
                ? ((C.sortIndex = at),
                  s(d, C),
                  u(S) === null &&
                    C === u(d) &&
                    (U ? (K(F), (F = -1)) : (U = !0), ht(P, at - gt)))
                : ((C.sortIndex = E),
                  s(S, C),
                  M || x || ((M = !0), Y || ((Y = !0), et()))),
              C
            );
          }),
          (l.unstable_shouldYield = W),
          (l.unstable_wrapCallback = function (C) {
            var X = b;
            return function () {
              var at = b;
              b = X;
              try {
                return C.apply(this, arguments);
              } finally {
                b = at;
              }
            };
          });
      })(Kc)),
    Kc
  );
}
var Oy;
function up() {
  return Oy || ((Oy = 1), (Xc.exports = ip())), Xc.exports;
}
var Zc = { exports: {} },
  ce = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ay;
function sp() {
  if (Ay) return ce;
  Ay = 1;
  var l = Ji();
  function s(S) {
    var d = "https://react.dev/errors/" + S;
    if (1 < arguments.length) {
      d += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var p = 2; p < arguments.length; p++)
        d += "&args[]=" + encodeURIComponent(arguments[p]);
    }
    return (
      "Minified React error #" +
      S +
      "; visit " +
      d +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function u() {}
  var c = {
      d: {
        f: u,
        r: function () {
          throw Error(s(522));
        },
        D: u,
        C: u,
        L: u,
        m: u,
        X: u,
        S: u,
        M: u,
      },
      p: 0,
      findDOMNode: null,
    },
    f = Symbol.for("react.portal");
  function h(S, d, p) {
    var m =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: f,
      key: m == null ? null : "" + m,
      children: S,
      containerInfo: d,
      implementation: p,
    };
  }
  var v = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function g(S, d) {
    if (S === "font") return "";
    if (typeof d == "string") return d === "use-credentials" ? d : "";
  }
  return (
    (ce.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = c),
    (ce.createPortal = function (S, d) {
      var p =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!d || (d.nodeType !== 1 && d.nodeType !== 9 && d.nodeType !== 11))
        throw Error(s(299));
      return h(S, d, null, p);
    }),
    (ce.flushSync = function (S) {
      var d = v.T,
        p = c.p;
      try {
        if (((v.T = null), (c.p = 2), S)) return S();
      } finally {
        (v.T = d), (c.p = p), c.d.f();
      }
    }),
    (ce.preconnect = function (S, d) {
      typeof S == "string" &&
        (d
          ? ((d = d.crossOrigin),
            (d =
              typeof d == "string"
                ? d === "use-credentials"
                  ? d
                  : ""
                : void 0))
          : (d = null),
        c.d.C(S, d));
    }),
    (ce.prefetchDNS = function (S) {
      typeof S == "string" && c.d.D(S);
    }),
    (ce.preinit = function (S, d) {
      if (typeof S == "string" && d && typeof d.as == "string") {
        var p = d.as,
          m = g(p, d.crossOrigin),
          b = typeof d.integrity == "string" ? d.integrity : void 0,
          x = typeof d.fetchPriority == "string" ? d.fetchPriority : void 0;
        p === "style"
          ? c.d.S(S, typeof d.precedence == "string" ? d.precedence : void 0, {
              crossOrigin: m,
              integrity: b,
              fetchPriority: x,
            })
          : p === "script" &&
            c.d.X(S, {
              crossOrigin: m,
              integrity: b,
              fetchPriority: x,
              nonce: typeof d.nonce == "string" ? d.nonce : void 0,
            });
      }
    }),
    (ce.preinitModule = function (S, d) {
      if (typeof S == "string")
        if (typeof d == "object" && d !== null) {
          if (d.as == null || d.as === "script") {
            var p = g(d.as, d.crossOrigin);
            c.d.M(S, {
              crossOrigin: p,
              integrity: typeof d.integrity == "string" ? d.integrity : void 0,
              nonce: typeof d.nonce == "string" ? d.nonce : void 0,
            });
          }
        } else d == null && c.d.M(S);
    }),
    (ce.preload = function (S, d) {
      if (
        typeof S == "string" &&
        typeof d == "object" &&
        d !== null &&
        typeof d.as == "string"
      ) {
        var p = d.as,
          m = g(p, d.crossOrigin);
        c.d.L(S, p, {
          crossOrigin: m,
          integrity: typeof d.integrity == "string" ? d.integrity : void 0,
          nonce: typeof d.nonce == "string" ? d.nonce : void 0,
          type: typeof d.type == "string" ? d.type : void 0,
          fetchPriority:
            typeof d.fetchPriority == "string" ? d.fetchPriority : void 0,
          referrerPolicy:
            typeof d.referrerPolicy == "string" ? d.referrerPolicy : void 0,
          imageSrcSet:
            typeof d.imageSrcSet == "string" ? d.imageSrcSet : void 0,
          imageSizes: typeof d.imageSizes == "string" ? d.imageSizes : void 0,
          media: typeof d.media == "string" ? d.media : void 0,
        });
      }
    }),
    (ce.preloadModule = function (S, d) {
      if (typeof S == "string")
        if (d) {
          var p = g(d.as, d.crossOrigin);
          c.d.m(S, {
            as: typeof d.as == "string" && d.as !== "script" ? d.as : void 0,
            crossOrigin: p,
            integrity: typeof d.integrity == "string" ? d.integrity : void 0,
          });
        } else c.d.m(S);
    }),
    (ce.requestFormReset = function (S) {
      c.d.r(S);
    }),
    (ce.unstable_batchedUpdates = function (S, d) {
      return S(d);
    }),
    (ce.useFormState = function (S, d, p) {
      return v.H.useFormState(S, d, p);
    }),
    (ce.useFormStatus = function () {
      return v.H.useHostTransitionStatus();
    }),
    (ce.version = "19.1.0"),
    ce
  );
}
var xy;
function ov() {
  if (xy) return Zc.exports;
  xy = 1;
  function l() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (s) {
        console.error(s);
      }
  }
  return l(), (Zc.exports = sp()), Zc.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Dy;
function rp() {
  if (Dy) return ji;
  Dy = 1;
  var l = up(),
    s = Ji(),
    u = ov();
  function c(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return (
      "Minified React error #" +
      t +
      "; visit " +
      e +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function f(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function h(t) {
    var e = t,
      n = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do (e = t), (e.flags & 4098) !== 0 && (n = e.return), (t = e.return);
      while (t);
    }
    return e.tag === 3 ? n : null;
  }
  function v(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (
        (e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)),
        e !== null)
      )
        return e.dehydrated;
    }
    return null;
  }
  function g(t) {
    if (h(t) !== t) throw Error(c(188));
  }
  function S(t) {
    var e = t.alternate;
    if (!e) {
      if (((e = h(t)), e === null)) throw Error(c(188));
      return e !== t ? null : t;
    }
    for (var n = t, a = e; ; ) {
      var i = n.return;
      if (i === null) break;
      var r = i.alternate;
      if (r === null) {
        if (((a = i.return), a !== null)) {
          n = a;
          continue;
        }
        break;
      }
      if (i.child === r.child) {
        for (r = i.child; r; ) {
          if (r === n) return g(i), t;
          if (r === a) return g(i), e;
          r = r.sibling;
        }
        throw Error(c(188));
      }
      if (n.return !== a.return) (n = i), (a = r);
      else {
        for (var o = !1, y = i.child; y; ) {
          if (y === n) {
            (o = !0), (n = i), (a = r);
            break;
          }
          if (y === a) {
            (o = !0), (a = i), (n = r);
            break;
          }
          y = y.sibling;
        }
        if (!o) {
          for (y = r.child; y; ) {
            if (y === n) {
              (o = !0), (n = r), (a = i);
              break;
            }
            if (y === a) {
              (o = !0), (a = r), (n = i);
              break;
            }
            y = y.sibling;
          }
          if (!o) throw Error(c(189));
        }
      }
      if (n.alternate !== a) throw Error(c(190));
    }
    if (n.tag !== 3) throw Error(c(188));
    return n.stateNode.current === n ? t : e;
  }
  function d(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((e = d(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var p = Object.assign,
    m = Symbol.for("react.element"),
    b = Symbol.for("react.transitional.element"),
    x = Symbol.for("react.portal"),
    M = Symbol.for("react.fragment"),
    U = Symbol.for("react.strict_mode"),
    L = Symbol.for("react.profiler"),
    q = Symbol.for("react.provider"),
    K = Symbol.for("react.consumer"),
    V = Symbol.for("react.context"),
    I = Symbol.for("react.forward_ref"),
    P = Symbol.for("react.suspense"),
    Y = Symbol.for("react.suspense_list"),
    F = Symbol.for("react.memo"),
    G = Symbol.for("react.lazy"),
    w = Symbol.for("react.activity"),
    W = Symbol.for("react.memo_cache_sentinel"),
    rt = Symbol.iterator;
  function et(t) {
    return t === null || typeof t != "object"
      ? null
      : ((t = (rt && t[rt]) || t["@@iterator"]),
        typeof t == "function" ? t : null);
  }
  var dt = Symbol.for("react.client.reference");
  function pt(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === dt ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case M:
        return "Fragment";
      case L:
        return "Profiler";
      case U:
        return "StrictMode";
      case P:
        return "Suspense";
      case Y:
        return "SuspenseList";
      case w:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case x:
          return "Portal";
        case V:
          return (t.displayName || "Context") + ".Provider";
        case K:
          return (t._context.displayName || "Context") + ".Consumer";
        case I:
          var e = t.render;
          return (
            (t = t.displayName),
            t ||
              ((t = e.displayName || e.name || ""),
              (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
            t
          );
        case F:
          return (
            (e = t.displayName || null), e !== null ? e : pt(t.type) || "Memo"
          );
        case G:
          (e = t._payload), (t = t._init);
          try {
            return pt(t(e));
          } catch {}
      }
    return null;
  }
  var ht = Array.isArray,
    C = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    X = u.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    at = { pending: !1, data: null, method: null, action: null },
    gt = [],
    E = -1;
  function N(t) {
    return { current: t };
  }
  function k(t) {
    0 > E || ((t.current = gt[E]), (gt[E] = null), E--);
  }
  function J(t, e) {
    E++, (gt[E] = t.current), (t.current = e);
  }
  var $ = N(null),
    lt = N(null),
    tt = N(null),
    St = N(null);
  function it(t, e) {
    switch ((J(tt, e), J(lt, t), J($, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? kh(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI)))
          (e = kh(e)), (t = Fh(e, t));
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    k($), J($, t);
  }
  function bt() {
    k($), k(lt), k(tt);
  }
  function Nt(t) {
    t.memoizedState !== null && J(St, t);
    var e = $.current,
      n = Fh(e, t.type);
    e !== n && (J(lt, t), J($, n));
  }
  function Qt(t) {
    lt.current === t && (k($), k(lt)),
      St.current === t && (k(St), (zi._currentValue = at));
  }
  var Bt = Object.prototype.hasOwnProperty,
    ye = l.unstable_scheduleCallback,
    Ze = l.unstable_cancelCallback,
    xn = l.unstable_shouldYield,
    ze = l.unstable_requestPaint,
    Wt = l.unstable_now,
    La = l.unstable_getCurrentPriorityLevel,
    Bl = l.unstable_ImmediatePriority,
    ql = l.unstable_UserBlockingPriority,
    xt = l.unstable_NormalPriority,
    Jt = l.unstable_LowPriority,
    Ha = l.unstable_IdlePriority,
    ki = l.log,
    xs = l.unstable_setDisableYieldValue,
    ra = null,
    be = null;
  function Dn(t) {
    if (
      (typeof ki == "function" && xs(t),
      be && typeof be.setStrictMode == "function")
    )
      try {
        be.setStrictMode(ra, t);
      } catch {}
  }
  var _e = Math.clz32 ? Math.clz32 : qv,
    jv = Math.log,
    Bv = Math.LN2;
  function qv(t) {
    return (t >>>= 0), t === 0 ? 32 : (31 - ((jv(t) / Bv) | 0)) | 0;
  }
  var Fi = 256,
    Pi = 4194304;
  function ca(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function $i(t, e, n) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var i = 0,
      r = t.suspendedLanes,
      o = t.pingedLanes;
    t = t.warmLanes;
    var y = a & 134217727;
    return (
      y !== 0
        ? ((a = y & ~r),
          a !== 0
            ? (i = ca(a))
            : ((o &= y),
              o !== 0
                ? (i = ca(o))
                : n || ((n = y & ~t), n !== 0 && (i = ca(n)))))
        : ((y = a & ~r),
          y !== 0
            ? (i = ca(y))
            : o !== 0
              ? (i = ca(o))
              : n || ((n = a & ~t), n !== 0 && (i = ca(n)))),
      i === 0
        ? 0
        : e !== 0 &&
            e !== i &&
            (e & r) === 0 &&
            ((r = i & -i),
            (n = e & -e),
            r >= n || (r === 32 && (n & 4194048) !== 0))
          ? e
          : i
    );
  }
  function Ql(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Qv(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Co() {
    var t = Fi;
    return (Fi <<= 1), (Fi & 4194048) === 0 && (Fi = 256), t;
  }
  function zo() {
    var t = Pi;
    return (Pi <<= 1), (Pi & 62914560) === 0 && (Pi = 4194304), t;
  }
  function Ds(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function Gl(t, e) {
    (t.pendingLanes |= e),
      e !== 268435456 &&
        ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0));
  }
  function Gv(t, e, n, a, i, r) {
    var o = t.pendingLanes;
    (t.pendingLanes = n),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= n),
      (t.entangledLanes &= n),
      (t.errorRecoveryDisabledLanes &= n),
      (t.shellSuspendCounter = 0);
    var y = t.entanglements,
      _ = t.expirationTimes,
      A = t.hiddenUpdates;
    for (n = o & ~n; 0 < n; ) {
      var H = 31 - _e(n),
        Q = 1 << H;
      (y[H] = 0), (_[H] = -1);
      var D = A[H];
      if (D !== null)
        for (A[H] = null, H = 0; H < D.length; H++) {
          var z = D[H];
          z !== null && (z.lane &= -536870913);
        }
      n &= ~Q;
    }
    a !== 0 && Uo(t, a, 0),
      r !== 0 && i === 0 && t.tag !== 0 && (t.suspendedLanes |= r & ~(o & ~e));
  }
  function Uo(t, e, n) {
    (t.pendingLanes |= e), (t.suspendedLanes &= ~e);
    var a = 31 - _e(e);
    (t.entangledLanes |= e),
      (t.entanglements[a] = t.entanglements[a] | 1073741824 | (n & 4194090));
  }
  function wo(t, e) {
    var n = (t.entangledLanes |= e);
    for (t = t.entanglements; n; ) {
      var a = 31 - _e(n),
        i = 1 << a;
      (i & e) | (t[a] & e) && (t[a] |= e), (n &= ~i);
    }
  }
  function Cs(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function zs(t) {
    return (
      (t &= -t),
      2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function No() {
    var t = X.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : yy(t.type));
  }
  function Yv(t, e) {
    var n = X.p;
    try {
      return (X.p = t), e();
    } finally {
      X.p = n;
    }
  }
  var Cn = Math.random().toString(36).slice(2),
    ue = "__reactFiber$" + Cn,
    ve = "__reactProps$" + Cn,
    ja = "__reactContainer$" + Cn,
    Us = "__reactEvents$" + Cn,
    Vv = "__reactListeners$" + Cn,
    Xv = "__reactHandles$" + Cn,
    Lo = "__reactResources$" + Cn,
    Yl = "__reactMarker$" + Cn;
  function ws(t) {
    delete t[ue], delete t[ve], delete t[Us], delete t[Vv], delete t[Xv];
  }
  function Ba(t) {
    var e = t[ue];
    if (e) return e;
    for (var n = t.parentNode; n; ) {
      if ((e = n[ja] || n[ue])) {
        if (
          ((n = e.alternate),
          e.child !== null || (n !== null && n.child !== null))
        )
          for (t = Ih(t); t !== null; ) {
            if ((n = t[ue])) return n;
            t = Ih(t);
          }
        return e;
      }
      (t = n), (n = t.parentNode);
    }
    return null;
  }
  function qa(t) {
    if ((t = t[ue] || t[ja])) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function Vl(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(c(33));
  }
  function Qa(t) {
    var e = t[Lo];
    return (
      e ||
        (e = t[Lo] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      e
    );
  }
  function It(t) {
    t[Yl] = !0;
  }
  var Ho = new Set(),
    jo = {};
  function oa(t, e) {
    Ga(t, e), Ga(t + "Capture", e);
  }
  function Ga(t, e) {
    for (jo[t] = e, t = 0; t < e.length; t++) Ho.add(e[t]);
  }
  var Kv = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Bo = {},
    qo = {};
  function Zv(t) {
    return Bt.call(qo, t)
      ? !0
      : Bt.call(Bo, t)
        ? !1
        : Kv.test(t)
          ? (qo[t] = !0)
          : ((Bo[t] = !0), !1);
  }
  function Wi(t, e, n) {
    if (Zv(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var a = e.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + n);
      }
  }
  function Ii(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + n);
    }
  }
  function fn(t, e, n, a) {
    if (a === null) t.removeAttribute(n);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, "" + a);
    }
  }
  var Ns, Qo;
  function Ya(t) {
    if (Ns === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        (Ns = (e && e[1]) || ""),
          (Qo =
            -1 <
            n.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < n.stack.indexOf("@")
                ? "@unknown:0:0"
                : "");
      }
    return (
      `
` +
      Ns +
      t +
      Qo
    );
  }
  var Ls = !1;
  function Hs(t, e) {
    if (!t || Ls) return "";
    Ls = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var Q = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(Q.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(Q, []);
                } catch (z) {
                  var D = z;
                }
                Reflect.construct(t, [], Q);
              } else {
                try {
                  Q.call();
                } catch (z) {
                  D = z;
                }
                t.call(Q.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (z) {
                D = z;
              }
              (Q = t()) &&
                typeof Q.catch == "function" &&
                Q.catch(function () {});
            }
          } catch (z) {
            if (z && D && typeof z.stack == "string") return [z.stack, D.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var i = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name",
      );
      i &&
        i.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var r = a.DetermineComponentFrameRoot(),
        o = r[0],
        y = r[1];
      if (o && y) {
        var _ = o.split(`
`),
          A = y.split(`
`);
        for (
          i = a = 0;
          a < _.length && !_[a].includes("DetermineComponentFrameRoot");

        )
          a++;
        for (; i < A.length && !A[i].includes("DetermineComponentFrameRoot"); )
          i++;
        if (a === _.length || i === A.length)
          for (
            a = _.length - 1, i = A.length - 1;
            1 <= a && 0 <= i && _[a] !== A[i];

          )
            i--;
        for (; 1 <= a && 0 <= i; a--, i--)
          if (_[a] !== A[i]) {
            if (a !== 1 || i !== 1)
              do
                if ((a--, i--, 0 > i || _[a] !== A[i])) {
                  var H =
                    `
` + _[a].replace(" at new ", " at ");
                  return (
                    t.displayName &&
                      H.includes("<anonymous>") &&
                      (H = H.replace("<anonymous>", t.displayName)),
                    H
                  );
                }
              while (1 <= a && 0 <= i);
            break;
          }
      }
    } finally {
      (Ls = !1), (Error.prepareStackTrace = n);
    }
    return (n = t ? t.displayName || t.name : "") ? Ya(n) : "";
  }
  function Jv(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Ya(t.type);
      case 16:
        return Ya("Lazy");
      case 13:
        return Ya("Suspense");
      case 19:
        return Ya("SuspenseList");
      case 0:
      case 15:
        return Hs(t.type, !1);
      case 11:
        return Hs(t.type.render, !1);
      case 1:
        return Hs(t.type, !0);
      case 31:
        return Ya("Activity");
      default:
        return "";
    }
  }
  function Go(t) {
    try {
      var e = "";
      do (e += Jv(t)), (t = t.return);
      while (t);
      return e;
    } catch (n) {
      return (
        `
Error generating stack: ` +
        n.message +
        `
` +
        n.stack
      );
    }
  }
  function Ue(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Yo(t) {
    var e = t.type;
    return (
      (t = t.nodeName) &&
      t.toLowerCase() === "input" &&
      (e === "checkbox" || e === "radio")
    );
  }
  function kv(t) {
    var e = Yo(t) ? "checked" : "value",
      n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
      a = "" + t[e];
    if (
      !t.hasOwnProperty(e) &&
      typeof n < "u" &&
      typeof n.get == "function" &&
      typeof n.set == "function"
    ) {
      var i = n.get,
        r = n.set;
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return i.call(this);
          },
          set: function (o) {
            (a = "" + o), r.call(this, o);
          },
        }),
        Object.defineProperty(t, e, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return a;
          },
          setValue: function (o) {
            a = "" + o;
          },
          stopTracking: function () {
            (t._valueTracker = null), delete t[e];
          },
        }
      );
    }
  }
  function tu(t) {
    t._valueTracker || (t._valueTracker = kv(t));
  }
  function Vo(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(),
      a = "";
    return (
      t && (a = Yo(t) ? (t.checked ? "true" : "false") : t.value),
      (t = a),
      t !== n ? (e.setValue(t), !0) : !1
    );
  }
  function eu(t) {
    if (
      ((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")
    )
      return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Fv = /[\n"\\]/g;
  function we(t) {
    return t.replace(Fv, function (e) {
      return "\\" + e.charCodeAt(0).toString(16) + " ";
    });
  }
  function js(t, e, n, a, i, r, o, y) {
    (t.name = ""),
      o != null &&
      typeof o != "function" &&
      typeof o != "symbol" &&
      typeof o != "boolean"
        ? (t.type = o)
        : t.removeAttribute("type"),
      e != null
        ? o === "number"
          ? ((e === 0 && t.value === "") || t.value != e) &&
            (t.value = "" + Ue(e))
          : t.value !== "" + Ue(e) && (t.value = "" + Ue(e))
        : (o !== "submit" && o !== "reset") || t.removeAttribute("value"),
      e != null
        ? Bs(t, o, Ue(e))
        : n != null
          ? Bs(t, o, Ue(n))
          : a != null && t.removeAttribute("value"),
      i == null && r != null && (t.defaultChecked = !!r),
      i != null &&
        (t.checked = i && typeof i != "function" && typeof i != "symbol"),
      y != null &&
      typeof y != "function" &&
      typeof y != "symbol" &&
      typeof y != "boolean"
        ? (t.name = "" + Ue(y))
        : t.removeAttribute("name");
  }
  function Xo(t, e, n, a, i, r, o, y) {
    if (
      (r != null &&
        typeof r != "function" &&
        typeof r != "symbol" &&
        typeof r != "boolean" &&
        (t.type = r),
      e != null || n != null)
    ) {
      if (!((r !== "submit" && r !== "reset") || e != null)) return;
      (n = n != null ? "" + Ue(n) : ""),
        (e = e != null ? "" + Ue(e) : n),
        y || e === t.value || (t.value = e),
        (t.defaultValue = e);
    }
    (a = a ?? i),
      (a = typeof a != "function" && typeof a != "symbol" && !!a),
      (t.checked = y ? t.checked : !!a),
      (t.defaultChecked = !!a),
      o != null &&
        typeof o != "function" &&
        typeof o != "symbol" &&
        typeof o != "boolean" &&
        (t.name = o);
  }
  function Bs(t, e, n) {
    (e === "number" && eu(t.ownerDocument) === t) ||
      t.defaultValue === "" + n ||
      (t.defaultValue = "" + n);
  }
  function Va(t, e, n, a) {
    if (((t = t.options), e)) {
      e = {};
      for (var i = 0; i < n.length; i++) e["$" + n[i]] = !0;
      for (n = 0; n < t.length; n++)
        (i = e.hasOwnProperty("$" + t[n].value)),
          t[n].selected !== i && (t[n].selected = i),
          i && a && (t[n].defaultSelected = !0);
    } else {
      for (n = "" + Ue(n), e = null, i = 0; i < t.length; i++) {
        if (t[i].value === n) {
          (t[i].selected = !0), a && (t[i].defaultSelected = !0);
          return;
        }
        e !== null || t[i].disabled || (e = t[i]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function Ko(t, e, n) {
    if (
      e != null &&
      ((e = "" + Ue(e)), e !== t.value && (t.value = e), n == null)
    ) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + Ue(n) : "";
  }
  function Zo(t, e, n, a) {
    if (e == null) {
      if (a != null) {
        if (n != null) throw Error(c(92));
        if (ht(a)) {
          if (1 < a.length) throw Error(c(93));
          a = a[0];
        }
        n = a;
      }
      n == null && (n = ""), (e = n);
    }
    (n = Ue(e)),
      (t.defaultValue = n),
      (a = t.textContent),
      a === n && a !== "" && a !== null && (t.value = a);
  }
  function Xa(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Pv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function Jo(t, e, n) {
    var a = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === ""
      ? a
        ? t.setProperty(e, "")
        : e === "float"
          ? (t.cssFloat = "")
          : (t[e] = "")
      : a
        ? t.setProperty(e, n)
        : typeof n != "number" || n === 0 || Pv.has(e)
          ? e === "float"
            ? (t.cssFloat = n)
            : (t[e] = ("" + n).trim())
          : (t[e] = n + "px");
  }
  function ko(t, e, n) {
    if (e != null && typeof e != "object") throw Error(c(62));
    if (((t = t.style), n != null)) {
      for (var a in n)
        !n.hasOwnProperty(a) ||
          (e != null && e.hasOwnProperty(a)) ||
          (a.indexOf("--") === 0
            ? t.setProperty(a, "")
            : a === "float"
              ? (t.cssFloat = "")
              : (t[a] = ""));
      for (var i in e)
        (a = e[i]), e.hasOwnProperty(i) && n[i] !== a && Jo(t, i, a);
    } else for (var r in e) e.hasOwnProperty(r) && Jo(t, r, e[r]);
  }
  function qs(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var $v = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    Wv =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function nu(t) {
    return Wv.test("" + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  var Qs = null;
  function Gs(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var Ka = null,
    Za = null;
  function Fo(t) {
    var e = qa(t);
    if (e && (t = e.stateNode)) {
      var n = t[ve] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case "input":
          if (
            (js(
              t,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
            ),
            (e = n.name),
            n.type === "radio" && e != null)
          ) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (
              n = n.querySelectorAll(
                'input[name="' + we("" + e) + '"][type="radio"]',
              ),
                e = 0;
              e < n.length;
              e++
            ) {
              var a = n[e];
              if (a !== t && a.form === t.form) {
                var i = a[ve] || null;
                if (!i) throw Error(c(90));
                js(
                  a,
                  i.value,
                  i.defaultValue,
                  i.defaultValue,
                  i.checked,
                  i.defaultChecked,
                  i.type,
                  i.name,
                );
              }
            }
            for (e = 0; e < n.length; e++)
              (a = n[e]), a.form === t.form && Vo(a);
          }
          break t;
        case "textarea":
          Ko(t, n.value, n.defaultValue);
          break t;
        case "select":
          (e = n.value), e != null && Va(t, !!n.multiple, e, !1);
      }
    }
  }
  var Ys = !1;
  function Po(t, e, n) {
    if (Ys) return t(e, n);
    Ys = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (
        ((Ys = !1),
        (Ka !== null || Za !== null) &&
          (Gu(), Ka && ((e = Ka), (t = Za), (Za = Ka = null), Fo(e), t)))
      )
        for (e = 0; e < t.length; e++) Fo(t[e]);
    }
  }
  function Xl(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var a = n[ve] || null;
    if (a === null) return null;
    n = a[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) ||
          ((t = t.type),
          (a = !(
            t === "button" ||
            t === "input" ||
            t === "select" ||
            t === "textarea"
          ))),
          (t = !a);
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function") throw Error(c(231, e, typeof n));
    return n;
  }
  var dn = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    Vs = !1;
  if (dn)
    try {
      var Kl = {};
      Object.defineProperty(Kl, "passive", {
        get: function () {
          Vs = !0;
        },
      }),
        window.addEventListener("test", Kl, Kl),
        window.removeEventListener("test", Kl, Kl);
    } catch {
      Vs = !1;
    }
  var zn = null,
    Xs = null,
    au = null;
  function $o() {
    if (au) return au;
    var t,
      e = Xs,
      n = e.length,
      a,
      i = "value" in zn ? zn.value : zn.textContent,
      r = i.length;
    for (t = 0; t < n && e[t] === i[t]; t++);
    var o = n - t;
    for (a = 1; a <= o && e[n - a] === i[r - a]; a++);
    return (au = i.slice(t, 1 < a ? 1 - a : void 0));
  }
  function lu(t) {
    var e = t.keyCode;
    return (
      "charCode" in t
        ? ((t = t.charCode), t === 0 && e === 13 && (t = 13))
        : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function iu() {
    return !0;
  }
  function Wo() {
    return !1;
  }
  function me(t) {
    function e(n, a, i, r, o) {
      (this._reactName = n),
        (this._targetInst = i),
        (this.type = a),
        (this.nativeEvent = r),
        (this.target = o),
        (this.currentTarget = null);
      for (var y in t)
        t.hasOwnProperty(y) && ((n = t[y]), (this[y] = n ? n(r) : r[y]));
      return (
        (this.isDefaultPrevented = (
          r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === !1
        )
          ? iu
          : Wo),
        (this.isPropagationStopped = Wo),
        this
      );
    }
    return (
      p(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = iu));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = iu));
        },
        persist: function () {},
        isPersistent: iu,
      }),
      e
    );
  }
  var fa = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    uu = me(fa),
    Zl = p({}, fa, { view: 0, detail: 0 }),
    Iv = me(Zl),
    Ks,
    Zs,
    Jl,
    su = p({}, Zl, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: ks,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return "movementX" in t
          ? t.movementX
          : (t !== Jl &&
              (Jl && t.type === "mousemove"
                ? ((Ks = t.screenX - Jl.screenX), (Zs = t.screenY - Jl.screenY))
                : (Zs = Ks = 0),
              (Jl = t)),
            Ks);
      },
      movementY: function (t) {
        return "movementY" in t ? t.movementY : Zs;
      },
    }),
    Io = me(su),
    tm = p({}, su, { dataTransfer: 0 }),
    em = me(tm),
    nm = p({}, Zl, { relatedTarget: 0 }),
    Js = me(nm),
    am = p({}, fa, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    lm = me(am),
    im = p({}, fa, {
      clipboardData: function (t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      },
    }),
    um = me(im),
    sm = p({}, fa, { data: 0 }),
    tf = me(sm),
    rm = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    cm = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    om = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function fm(t) {
    var e = this.nativeEvent;
    return e.getModifierState
      ? e.getModifierState(t)
      : (t = om[t])
        ? !!e[t]
        : !1;
  }
  function ks() {
    return fm;
  }
  var dm = p({}, Zl, {
      key: function (t) {
        if (t.key) {
          var e = rm[t.key] || t.key;
          if (e !== "Unidentified") return e;
        }
        return t.type === "keypress"
          ? ((t = lu(t)), t === 13 ? "Enter" : String.fromCharCode(t))
          : t.type === "keydown" || t.type === "keyup"
            ? cm[t.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: ks,
      charCode: function (t) {
        return t.type === "keypress" ? lu(t) : 0;
      },
      keyCode: function (t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === "keypress"
          ? lu(t)
          : t.type === "keydown" || t.type === "keyup"
            ? t.keyCode
            : 0;
      },
    }),
    hm = me(dm),
    ym = p({}, su, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    ef = me(ym),
    vm = p({}, Zl, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: ks,
    }),
    mm = me(vm),
    pm = p({}, fa, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    gm = me(pm),
    Sm = p({}, su, {
      deltaX: function (t) {
        return "deltaX" in t
          ? t.deltaX
          : "wheelDeltaX" in t
            ? -t.wheelDeltaX
            : 0;
      },
      deltaY: function (t) {
        return "deltaY" in t
          ? t.deltaY
          : "wheelDeltaY" in t
            ? -t.wheelDeltaY
            : "wheelDelta" in t
              ? -t.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    bm = me(Sm),
    _m = p({}, fa, { newState: 0, oldState: 0 }),
    Em = me(_m),
    Rm = [9, 13, 27, 32],
    Fs = dn && "CompositionEvent" in window,
    kl = null;
  dn && "documentMode" in document && (kl = document.documentMode);
  var Tm = dn && "TextEvent" in window && !kl,
    nf = dn && (!Fs || (kl && 8 < kl && 11 >= kl)),
    af = " ",
    lf = !1;
  function uf(t, e) {
    switch (t) {
      case "keyup":
        return Rm.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function sf(t) {
    return (t = t.detail), typeof t == "object" && "data" in t ? t.data : null;
  }
  var Ja = !1;
  function Mm(t, e) {
    switch (t) {
      case "compositionend":
        return sf(e);
      case "keypress":
        return e.which !== 32 ? null : ((lf = !0), af);
      case "textInput":
        return (t = e.data), t === af && lf ? null : t;
      default:
        return null;
    }
  }
  function Om(t, e) {
    if (Ja)
      return t === "compositionend" || (!Fs && uf(t, e))
        ? ((t = $o()), (au = Xs = zn = null), (Ja = !1), t)
        : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return nf && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Am = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function rf(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!Am[t.type] : e === "textarea";
  }
  function cf(t, e, n, a) {
    Ka ? (Za ? Za.push(a) : (Za = [a])) : (Ka = a),
      (e = Ju(e, "onChange")),
      0 < e.length &&
        ((n = new uu("onChange", "change", null, n, a)),
        t.push({ event: n, listeners: e }));
  }
  var Fl = null,
    Pl = null;
  function xm(t) {
    Vh(t, 0);
  }
  function ru(t) {
    var e = Vl(t);
    if (Vo(e)) return t;
  }
  function of(t, e) {
    if (t === "change") return e;
  }
  var ff = !1;
  if (dn) {
    var Ps;
    if (dn) {
      var $s = "oninput" in document;
      if (!$s) {
        var df = document.createElement("div");
        df.setAttribute("oninput", "return;"),
          ($s = typeof df.oninput == "function");
      }
      Ps = $s;
    } else Ps = !1;
    ff = Ps && (!document.documentMode || 9 < document.documentMode);
  }
  function hf() {
    Fl && (Fl.detachEvent("onpropertychange", yf), (Pl = Fl = null));
  }
  function yf(t) {
    if (t.propertyName === "value" && ru(Pl)) {
      var e = [];
      cf(e, Pl, t, Gs(t)), Po(xm, e);
    }
  }
  function Dm(t, e, n) {
    t === "focusin"
      ? (hf(), (Fl = e), (Pl = n), Fl.attachEvent("onpropertychange", yf))
      : t === "focusout" && hf();
  }
  function Cm(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return ru(Pl);
  }
  function zm(t, e) {
    if (t === "click") return ru(e);
  }
  function Um(t, e) {
    if (t === "input" || t === "change") return ru(e);
  }
  function wm(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var Ee = typeof Object.is == "function" ? Object.is : wm;
  function $l(t, e) {
    if (Ee(t, e)) return !0;
    if (
      typeof t != "object" ||
      t === null ||
      typeof e != "object" ||
      e === null
    )
      return !1;
    var n = Object.keys(t),
      a = Object.keys(e);
    if (n.length !== a.length) return !1;
    for (a = 0; a < n.length; a++) {
      var i = n[a];
      if (!Bt.call(e, i) || !Ee(t[i], e[i])) return !1;
    }
    return !0;
  }
  function vf(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function mf(t, e) {
    var n = vf(t);
    t = 0;
    for (var a; n; ) {
      if (n.nodeType === 3) {
        if (((a = t + n.textContent.length), t <= e && a >= e))
          return { node: n, offset: e - t };
        t = a;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = vf(n);
    }
  }
  function pf(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? pf(t, e.parentNode)
            : "contains" in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function gf(t) {
    t =
      t != null &&
      t.ownerDocument != null &&
      t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = eu(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = eu(t.document);
    }
    return e;
  }
  function Ws(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      e &&
      ((e === "input" &&
        (t.type === "text" ||
          t.type === "search" ||
          t.type === "tel" ||
          t.type === "url" ||
          t.type === "password")) ||
        e === "textarea" ||
        t.contentEditable === "true")
    );
  }
  var Nm = dn && "documentMode" in document && 11 >= document.documentMode,
    ka = null,
    Is = null,
    Wl = null,
    tr = !1;
  function Sf(t, e, n) {
    var a =
      n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    tr ||
      ka == null ||
      ka !== eu(a) ||
      ((a = ka),
      "selectionStart" in a && Ws(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = (
            (a.ownerDocument && a.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Wl && $l(Wl, a)) ||
        ((Wl = a),
        (a = Ju(Is, "onSelect")),
        0 < a.length &&
          ((e = new uu("onSelect", "select", null, e, n)),
          t.push({ event: e, listeners: a }),
          (e.target = ka))));
  }
  function da(t, e) {
    var n = {};
    return (
      (n[t.toLowerCase()] = e.toLowerCase()),
      (n["Webkit" + t] = "webkit" + e),
      (n["Moz" + t] = "moz" + e),
      n
    );
  }
  var Fa = {
      animationend: da("Animation", "AnimationEnd"),
      animationiteration: da("Animation", "AnimationIteration"),
      animationstart: da("Animation", "AnimationStart"),
      transitionrun: da("Transition", "TransitionRun"),
      transitionstart: da("Transition", "TransitionStart"),
      transitioncancel: da("Transition", "TransitionCancel"),
      transitionend: da("Transition", "TransitionEnd"),
    },
    er = {},
    bf = {};
  dn &&
    ((bf = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete Fa.animationend.animation,
      delete Fa.animationiteration.animation,
      delete Fa.animationstart.animation),
    "TransitionEvent" in window || delete Fa.transitionend.transition);
  function ha(t) {
    if (er[t]) return er[t];
    if (!Fa[t]) return t;
    var e = Fa[t],
      n;
    for (n in e) if (e.hasOwnProperty(n) && n in bf) return (er[t] = e[n]);
    return t;
  }
  var _f = ha("animationend"),
    Ef = ha("animationiteration"),
    Rf = ha("animationstart"),
    Lm = ha("transitionrun"),
    Hm = ha("transitionstart"),
    jm = ha("transitioncancel"),
    Tf = ha("transitionend"),
    Mf = new Map(),
    nr =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  nr.push("scrollEnd");
  function Je(t, e) {
    Mf.set(t, e), oa(e, [t]);
  }
  var Of = new WeakMap();
  function Ne(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = Of.get(t);
      return n !== void 0
        ? n
        : ((e = { value: t, source: e, stack: Go(e) }), Of.set(t, e), e);
    }
    return { value: t, source: e, stack: Go(e) };
  }
  var Le = [],
    Pa = 0,
    ar = 0;
  function cu() {
    for (var t = Pa, e = (ar = Pa = 0); e < t; ) {
      var n = Le[e];
      Le[e++] = null;
      var a = Le[e];
      Le[e++] = null;
      var i = Le[e];
      Le[e++] = null;
      var r = Le[e];
      if (((Le[e++] = null), a !== null && i !== null)) {
        var o = a.pending;
        o === null ? (i.next = i) : ((i.next = o.next), (o.next = i)),
          (a.pending = i);
      }
      r !== 0 && Af(n, i, r);
    }
  }
  function ou(t, e, n, a) {
    (Le[Pa++] = t),
      (Le[Pa++] = e),
      (Le[Pa++] = n),
      (Le[Pa++] = a),
      (ar |= a),
      (t.lanes |= a),
      (t = t.alternate),
      t !== null && (t.lanes |= a);
  }
  function lr(t, e, n, a) {
    return ou(t, e, n, a), fu(t);
  }
  function $a(t, e) {
    return ou(t, null, null, e), fu(t);
  }
  function Af(t, e, n) {
    t.lanes |= n;
    var a = t.alternate;
    a !== null && (a.lanes |= n);
    for (var i = !1, r = t.return; r !== null; )
      (r.childLanes |= n),
        (a = r.alternate),
        a !== null && (a.childLanes |= n),
        r.tag === 22 &&
          ((t = r.stateNode), t === null || t._visibility & 1 || (i = !0)),
        (t = r),
        (r = r.return);
    return t.tag === 3
      ? ((r = t.stateNode),
        i &&
          e !== null &&
          ((i = 31 - _e(n)),
          (t = r.hiddenUpdates),
          (a = t[i]),
          a === null ? (t[i] = [e]) : a.push(e),
          (e.lane = n | 536870912)),
        r)
      : null;
  }
  function fu(t) {
    if (50 < Ri) throw ((Ri = 0), (oc = null), Error(c(185)));
    for (var e = t.return; e !== null; ) (t = e), (e = t.return);
    return t.tag === 3 ? t.stateNode : null;
  }
  var Wa = {};
  function Bm(t, e, n, a) {
    (this.tag = t),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null);
  }
  function Re(t, e, n, a) {
    return new Bm(t, e, n, a);
  }
  function ir(t) {
    return (t = t.prototype), !(!t || !t.isReactComponent);
  }
  function hn(t, e) {
    var n = t.alternate;
    return (
      n === null
        ? ((n = Re(t.tag, e, t.key, t.mode)),
          (n.elementType = t.elementType),
          (n.type = t.type),
          (n.stateNode = t.stateNode),
          (n.alternate = t),
          (t.alternate = n))
        : ((n.pendingProps = e),
          (n.type = t.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = t.flags & 65011712),
      (n.childLanes = t.childLanes),
      (n.lanes = t.lanes),
      (n.child = t.child),
      (n.memoizedProps = t.memoizedProps),
      (n.memoizedState = t.memoizedState),
      (n.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (n.dependencies =
        e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (n.sibling = t.sibling),
      (n.index = t.index),
      (n.ref = t.ref),
      (n.refCleanup = t.refCleanup),
      n
    );
  }
  function xf(t, e) {
    t.flags &= 65011714;
    var n = t.alternate;
    return (
      n === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = n.childLanes),
          (t.lanes = n.lanes),
          (t.child = n.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = n.memoizedProps),
          (t.memoizedState = n.memoizedState),
          (t.updateQueue = n.updateQueue),
          (t.type = n.type),
          (e = n.dependencies),
          (t.dependencies =
            e === null
              ? null
              : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    );
  }
  function du(t, e, n, a, i, r) {
    var o = 0;
    if (((a = t), typeof t == "function")) ir(t) && (o = 1);
    else if (typeof t == "string")
      o = Q0(t, n, $.current)
        ? 26
        : t === "html" || t === "head" || t === "body"
          ? 27
          : 5;
    else
      t: switch (t) {
        case w:
          return (t = Re(31, n, e, i)), (t.elementType = w), (t.lanes = r), t;
        case M:
          return ya(n.children, i, r, e);
        case U:
          (o = 8), (i |= 24);
          break;
        case L:
          return (
            (t = Re(12, n, e, i | 2)), (t.elementType = L), (t.lanes = r), t
          );
        case P:
          return (t = Re(13, n, e, i)), (t.elementType = P), (t.lanes = r), t;
        case Y:
          return (t = Re(19, n, e, i)), (t.elementType = Y), (t.lanes = r), t;
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case q:
              case V:
                o = 10;
                break t;
              case K:
                o = 9;
                break t;
              case I:
                o = 11;
                break t;
              case F:
                o = 14;
                break t;
              case G:
                (o = 16), (a = null);
                break t;
            }
          (o = 29),
            (n = Error(c(130, t === null ? "null" : typeof t, ""))),
            (a = null);
      }
    return (
      (e = Re(o, n, e, i)), (e.elementType = t), (e.type = a), (e.lanes = r), e
    );
  }
  function ya(t, e, n, a) {
    return (t = Re(7, t, a, e)), (t.lanes = n), t;
  }
  function ur(t, e, n) {
    return (t = Re(6, t, null, e)), (t.lanes = n), t;
  }
  function sr(t, e, n) {
    return (
      (e = Re(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = n),
      (e.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation,
      }),
      e
    );
  }
  var Ia = [],
    tl = 0,
    hu = null,
    yu = 0,
    He = [],
    je = 0,
    va = null,
    yn = 1,
    vn = "";
  function ma(t, e) {
    (Ia[tl++] = yu), (Ia[tl++] = hu), (hu = t), (yu = e);
  }
  function Df(t, e, n) {
    (He[je++] = yn), (He[je++] = vn), (He[je++] = va), (va = t);
    var a = yn;
    t = vn;
    var i = 32 - _e(a) - 1;
    (a &= ~(1 << i)), (n += 1);
    var r = 32 - _e(e) + i;
    if (30 < r) {
      var o = i - (i % 5);
      (r = (a & ((1 << o) - 1)).toString(32)),
        (a >>= o),
        (i -= o),
        (yn = (1 << (32 - _e(e) + i)) | (n << i) | a),
        (vn = r + t);
    } else (yn = (1 << r) | (n << i) | a), (vn = t);
  }
  function rr(t) {
    t.return !== null && (ma(t, 1), Df(t, 1, 0));
  }
  function cr(t) {
    for (; t === hu; )
      (hu = Ia[--tl]), (Ia[tl] = null), (yu = Ia[--tl]), (Ia[tl] = null);
    for (; t === va; )
      (va = He[--je]),
        (He[je] = null),
        (vn = He[--je]),
        (He[je] = null),
        (yn = He[--je]),
        (He[je] = null);
  }
  var fe = null,
    Gt = null,
    At = !1,
    pa = null,
    Ie = !1,
    or = Error(c(519));
  function ga(t) {
    var e = Error(c(418, ""));
    throw (ei(Ne(e, t)), or);
  }
  function Cf(t) {
    var e = t.stateNode,
      n = t.type,
      a = t.memoizedProps;
    switch (((e[ue] = t), (e[ve] = a), n)) {
      case "dialog":
        Rt("cancel", e), Rt("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        Rt("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Mi.length; n++) Rt(Mi[n], e);
        break;
      case "source":
        Rt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        Rt("error", e), Rt("load", e);
        break;
      case "details":
        Rt("toggle", e);
        break;
      case "input":
        Rt("invalid", e),
          Xo(
            e,
            a.value,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name,
            !0,
          ),
          tu(e);
        break;
      case "select":
        Rt("invalid", e);
        break;
      case "textarea":
        Rt("invalid", e), Zo(e, a.value, a.defaultValue, a.children), tu(e);
    }
    (n = a.children),
      (typeof n != "string" && typeof n != "number" && typeof n != "bigint") ||
      e.textContent === "" + n ||
      a.suppressHydrationWarning === !0 ||
      Jh(e.textContent, n)
        ? (a.popover != null && (Rt("beforetoggle", e), Rt("toggle", e)),
          a.onScroll != null && Rt("scroll", e),
          a.onScrollEnd != null && Rt("scrollend", e),
          a.onClick != null && (e.onclick = ku),
          (e = !0))
        : (e = !1),
      e || ga(t);
  }
  function zf(t) {
    for (fe = t.return; fe; )
      switch (fe.tag) {
        case 5:
        case 13:
          Ie = !1;
          return;
        case 27:
        case 3:
          Ie = !0;
          return;
        default:
          fe = fe.return;
      }
  }
  function Il(t) {
    if (t !== fe) return !1;
    if (!At) return zf(t), (At = !0), !1;
    var e = t.tag,
      n;
    if (
      ((n = e !== 3 && e !== 27) &&
        ((n = e === 5) &&
          ((n = t.type),
          (n =
            !(n !== "form" && n !== "button") || Oc(t.type, t.memoizedProps))),
        (n = !n)),
      n && Gt && ga(t),
      zf(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
        throw Error(c(317));
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (((n = t.data), n === "/$")) {
              if (e === 0) {
                Gt = Fe(t.nextSibling);
                break t;
              }
              e--;
            } else (n !== "$" && n !== "$!" && n !== "$?") || e++;
          t = t.nextSibling;
        }
        Gt = null;
      }
    } else
      e === 27
        ? ((e = Gt), Jn(t.type) ? ((t = Cc), (Cc = null), (Gt = t)) : (Gt = e))
        : (Gt = fe ? Fe(t.stateNode.nextSibling) : null);
    return !0;
  }
  function ti() {
    (Gt = fe = null), (At = !1);
  }
  function Uf() {
    var t = pa;
    return (
      t !== null &&
        (Se === null ? (Se = t) : Se.push.apply(Se, t), (pa = null)),
      t
    );
  }
  function ei(t) {
    pa === null ? (pa = [t]) : pa.push(t);
  }
  var fr = N(null),
    Sa = null,
    mn = null;
  function Un(t, e, n) {
    J(fr, e._currentValue), (e._currentValue = n);
  }
  function pn(t) {
    (t._currentValue = fr.current), k(fr);
  }
  function dr(t, e, n) {
    for (; t !== null; ) {
      var a = t.alternate;
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), a !== null && (a.childLanes |= e))
          : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e),
        t === n)
      )
        break;
      t = t.return;
    }
  }
  function hr(t, e, n, a) {
    var i = t.child;
    for (i !== null && (i.return = t); i !== null; ) {
      var r = i.dependencies;
      if (r !== null) {
        var o = i.child;
        r = r.firstContext;
        t: for (; r !== null; ) {
          var y = r;
          r = i;
          for (var _ = 0; _ < e.length; _++)
            if (y.context === e[_]) {
              (r.lanes |= n),
                (y = r.alternate),
                y !== null && (y.lanes |= n),
                dr(r.return, n, t),
                a || (o = null);
              break t;
            }
          r = y.next;
        }
      } else if (i.tag === 18) {
        if (((o = i.return), o === null)) throw Error(c(341));
        (o.lanes |= n),
          (r = o.alternate),
          r !== null && (r.lanes |= n),
          dr(o, n, t),
          (o = null);
      } else o = i.child;
      if (o !== null) o.return = i;
      else
        for (o = i; o !== null; ) {
          if (o === t) {
            o = null;
            break;
          }
          if (((i = o.sibling), i !== null)) {
            (i.return = o.return), (o = i);
            break;
          }
          o = o.return;
        }
      i = o;
    }
  }
  function ni(t, e, n, a) {
    t = null;
    for (var i = e, r = !1; i !== null; ) {
      if (!r) {
        if ((i.flags & 524288) !== 0) r = !0;
        else if ((i.flags & 262144) !== 0) break;
      }
      if (i.tag === 10) {
        var o = i.alternate;
        if (o === null) throw Error(c(387));
        if (((o = o.memoizedProps), o !== null)) {
          var y = i.type;
          Ee(i.pendingProps.value, o.value) ||
            (t !== null ? t.push(y) : (t = [y]));
        }
      } else if (i === St.current) {
        if (((o = i.alternate), o === null)) throw Error(c(387));
        o.memoizedState.memoizedState !== i.memoizedState.memoizedState &&
          (t !== null ? t.push(zi) : (t = [zi]));
      }
      i = i.return;
    }
    t !== null && hr(e, t, n, a), (e.flags |= 262144);
  }
  function vu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!Ee(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function ba(t) {
    (Sa = t),
      (mn = null),
      (t = t.dependencies),
      t !== null && (t.firstContext = null);
  }
  function se(t) {
    return wf(Sa, t);
  }
  function mu(t, e) {
    return Sa === null && ba(t), wf(t, e);
  }
  function wf(t, e) {
    var n = e._currentValue;
    if (((e = { context: e, memoizedValue: n, next: null }), mn === null)) {
      if (t === null) throw Error(c(308));
      (mn = e),
        (t.dependencies = { lanes: 0, firstContext: e }),
        (t.flags |= 524288);
    } else mn = mn.next = e;
    return n;
  }
  var qm =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (n, a) {
                  t.push(a);
                },
              });
            this.abort = function () {
              (e.aborted = !0),
                t.forEach(function (n) {
                  return n();
                });
            };
          },
    Qm = l.unstable_scheduleCallback,
    Gm = l.unstable_NormalPriority,
    Pt = {
      $$typeof: V,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function yr() {
    return { controller: new qm(), data: new Map(), refCount: 0 };
  }
  function ai(t) {
    t.refCount--,
      t.refCount === 0 &&
        Qm(Gm, function () {
          t.controller.abort();
        });
  }
  var li = null,
    vr = 0,
    el = 0,
    nl = null;
  function Ym(t, e) {
    if (li === null) {
      var n = (li = []);
      (vr = 0),
        (el = pc()),
        (nl = {
          status: "pending",
          value: void 0,
          then: function (a) {
            n.push(a);
          },
        });
    }
    return vr++, e.then(Nf, Nf), e;
  }
  function Nf() {
    if (--vr === 0 && li !== null) {
      nl !== null && (nl.status = "fulfilled");
      var t = li;
      (li = null), (el = 0), (nl = null);
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Vm(t, e) {
    var n = [],
      a = {
        status: "pending",
        value: null,
        reason: null,
        then: function (i) {
          n.push(i);
        },
      };
    return (
      t.then(
        function () {
          (a.status = "fulfilled"), (a.value = e);
          for (var i = 0; i < n.length; i++) (0, n[i])(e);
        },
        function (i) {
          for (a.status = "rejected", a.reason = i, i = 0; i < n.length; i++)
            (0, n[i])(void 0);
        },
      ),
      a
    );
  }
  var Lf = C.S;
  C.S = function (t, e) {
    typeof e == "object" &&
      e !== null &&
      typeof e.then == "function" &&
      Ym(t, e),
      Lf !== null && Lf(t, e);
  };
  var _a = N(null);
  function mr() {
    var t = _a.current;
    return t !== null ? t : Ht.pooledCache;
  }
  function pu(t, e) {
    e === null ? J(_a, _a.current) : J(_a, e.pool);
  }
  function Hf() {
    var t = mr();
    return t === null ? null : { parent: Pt._currentValue, pool: t };
  }
  var ii = Error(c(460)),
    jf = Error(c(474)),
    gu = Error(c(542)),
    pr = { then: function () {} };
  function Bf(t) {
    return (t = t.status), t === "fulfilled" || t === "rejected";
  }
  function Su() {}
  function qf(t, e, n) {
    switch (
      ((n = t[n]),
      n === void 0 ? t.push(e) : n !== e && (e.then(Su, Su), (e = n)),
      e.status)
    ) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw ((t = e.reason), Gf(t), t);
      default:
        if (typeof e.status == "string") e.then(Su, Su);
        else {
          if (((t = Ht), t !== null && 100 < t.shellSuspendCounter))
            throw Error(c(482));
          (t = e),
            (t.status = "pending"),
            t.then(
              function (a) {
                if (e.status === "pending") {
                  var i = e;
                  (i.status = "fulfilled"), (i.value = a);
                }
              },
              function (a) {
                if (e.status === "pending") {
                  var i = e;
                  (i.status = "rejected"), (i.reason = a);
                }
              },
            );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw ((t = e.reason), Gf(t), t);
        }
        throw ((ui = e), ii);
    }
  }
  var ui = null;
  function Qf() {
    if (ui === null) throw Error(c(459));
    var t = ui;
    return (ui = null), t;
  }
  function Gf(t) {
    if (t === ii || t === gu) throw Error(c(483));
  }
  var wn = !1;
  function gr(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Sr(t, e) {
    (t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        });
  }
  function Nn(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Ln(t, e, n) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (Dt & 2) !== 0)) {
      var i = a.pending;
      return (
        i === null ? (e.next = e) : ((e.next = i.next), (i.next = e)),
        (a.pending = e),
        (e = fu(t)),
        Af(t, null, n),
        e
      );
    }
    return ou(t, a, e, n), fu(t);
  }
  function si(t, e, n) {
    if (
      ((e = e.updateQueue), e !== null && ((e = e.shared), (n & 4194048) !== 0))
    ) {
      var a = e.lanes;
      (a &= t.pendingLanes), (n |= a), (e.lanes = n), wo(t, n);
    }
  }
  function br(t, e) {
    var n = t.updateQueue,
      a = t.alternate;
    if (a !== null && ((a = a.updateQueue), n === a)) {
      var i = null,
        r = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var o = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null,
          };
          r === null ? (i = r = o) : (r = r.next = o), (n = n.next);
        } while (n !== null);
        r === null ? (i = r = e) : (r = r.next = e);
      } else i = r = e;
      (n = {
        baseState: a.baseState,
        firstBaseUpdate: i,
        lastBaseUpdate: r,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (t.updateQueue = n);
      return;
    }
    (t = n.lastBaseUpdate),
      t === null ? (n.firstBaseUpdate = e) : (t.next = e),
      (n.lastBaseUpdate = e);
  }
  var _r = !1;
  function ri() {
    if (_r) {
      var t = nl;
      if (t !== null) throw t;
    }
  }
  function ci(t, e, n, a) {
    _r = !1;
    var i = t.updateQueue;
    wn = !1;
    var r = i.firstBaseUpdate,
      o = i.lastBaseUpdate,
      y = i.shared.pending;
    if (y !== null) {
      i.shared.pending = null;
      var _ = y,
        A = _.next;
      (_.next = null), o === null ? (r = A) : (o.next = A), (o = _);
      var H = t.alternate;
      H !== null &&
        ((H = H.updateQueue),
        (y = H.lastBaseUpdate),
        y !== o &&
          (y === null ? (H.firstBaseUpdate = A) : (y.next = A),
          (H.lastBaseUpdate = _)));
    }
    if (r !== null) {
      var Q = i.baseState;
      (o = 0), (H = A = _ = null), (y = r);
      do {
        var D = y.lane & -536870913,
          z = D !== y.lane;
        if (z ? (Tt & D) === D : (a & D) === D) {
          D !== 0 && D === el && (_r = !0),
            H !== null &&
              (H = H.next =
                {
                  lane: 0,
                  tag: y.tag,
                  payload: y.payload,
                  callback: null,
                  next: null,
                });
          t: {
            var ft = t,
              ct = y;
            D = e;
            var wt = n;
            switch (ct.tag) {
              case 1:
                if (((ft = ct.payload), typeof ft == "function")) {
                  Q = ft.call(wt, Q, D);
                  break t;
                }
                Q = ft;
                break t;
              case 3:
                ft.flags = (ft.flags & -65537) | 128;
              case 0:
                if (
                  ((ft = ct.payload),
                  (D = typeof ft == "function" ? ft.call(wt, Q, D) : ft),
                  D == null)
                )
                  break t;
                Q = p({}, Q, D);
                break t;
              case 2:
                wn = !0;
            }
          }
          (D = y.callback),
            D !== null &&
              ((t.flags |= 64),
              z && (t.flags |= 8192),
              (z = i.callbacks),
              z === null ? (i.callbacks = [D]) : z.push(D));
        } else
          (z = {
            lane: D,
            tag: y.tag,
            payload: y.payload,
            callback: y.callback,
            next: null,
          }),
            H === null ? ((A = H = z), (_ = Q)) : (H = H.next = z),
            (o |= D);
        if (((y = y.next), y === null)) {
          if (((y = i.shared.pending), y === null)) break;
          (z = y),
            (y = z.next),
            (z.next = null),
            (i.lastBaseUpdate = z),
            (i.shared.pending = null);
        }
      } while (!0);
      H === null && (_ = Q),
        (i.baseState = _),
        (i.firstBaseUpdate = A),
        (i.lastBaseUpdate = H),
        r === null && (i.shared.lanes = 0),
        (Vn |= o),
        (t.lanes = o),
        (t.memoizedState = Q);
    }
  }
  function Yf(t, e) {
    if (typeof t != "function") throw Error(c(191, t));
    t.call(e);
  }
  function Vf(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++) Yf(n[t], e);
  }
  var al = N(null),
    bu = N(0);
  function Xf(t, e) {
    (t = Tn), J(bu, t), J(al, e), (Tn = t | e.baseLanes);
  }
  function Er() {
    J(bu, Tn), J(al, al.current);
  }
  function Rr() {
    (Tn = bu.current), k(al), k(bu);
  }
  var Hn = 0,
    mt = null,
    zt = null,
    kt = null,
    _u = !1,
    ll = !1,
    Ea = !1,
    Eu = 0,
    oi = 0,
    il = null,
    Xm = 0;
  function Xt() {
    throw Error(c(321));
  }
  function Tr(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!Ee(t[n], e[n])) return !1;
    return !0;
  }
  function Mr(t, e, n, a, i, r) {
    return (
      (Hn = r),
      (mt = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (C.H = t === null || t.memoizedState === null ? Ad : xd),
      (Ea = !1),
      (r = n(a, i)),
      (Ea = !1),
      ll && (r = Zf(e, n, a, i)),
      Kf(t),
      r
    );
  }
  function Kf(t) {
    C.H = xu;
    var e = zt !== null && zt.next !== null;
    if (((Hn = 0), (kt = zt = mt = null), (_u = !1), (oi = 0), (il = null), e))
      throw Error(c(300));
    t === null ||
      te ||
      ((t = t.dependencies), t !== null && vu(t) && (te = !0));
  }
  function Zf(t, e, n, a) {
    mt = t;
    var i = 0;
    do {
      if ((ll && (il = null), (oi = 0), (ll = !1), 25 <= i))
        throw Error(c(301));
      if (((i += 1), (kt = zt = null), t.updateQueue != null)) {
        var r = t.updateQueue;
        (r.lastEffect = null),
          (r.events = null),
          (r.stores = null),
          r.memoCache != null && (r.memoCache.index = 0);
      }
      (C.H = $m), (r = e(n, a));
    } while (ll);
    return r;
  }
  function Km() {
    var t = C.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == "function" ? fi(e) : e),
      (t = t.useState()[0]),
      (zt !== null ? zt.memoizedState : null) !== t && (mt.flags |= 1024),
      e
    );
  }
  function Or() {
    var t = Eu !== 0;
    return (Eu = 0), t;
  }
  function Ar(t, e, n) {
    (e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~n);
  }
  function xr(t) {
    if (_u) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), (t = t.next);
      }
      _u = !1;
    }
    (Hn = 0), (kt = zt = mt = null), (ll = !1), (oi = Eu = 0), (il = null);
  }
  function pe() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return kt === null ? (mt.memoizedState = kt = t) : (kt = kt.next = t), kt;
  }
  function Ft() {
    if (zt === null) {
      var t = mt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = zt.next;
    var e = kt === null ? mt.memoizedState : kt.next;
    if (e !== null) (kt = e), (zt = t);
    else {
      if (t === null)
        throw mt.alternate === null ? Error(c(467)) : Error(c(310));
      (zt = t),
        (t = {
          memoizedState: zt.memoizedState,
          baseState: zt.baseState,
          baseQueue: zt.baseQueue,
          queue: zt.queue,
          next: null,
        }),
        kt === null ? (mt.memoizedState = kt = t) : (kt = kt.next = t);
    }
    return kt;
  }
  function Dr() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function fi(t) {
    var e = oi;
    return (
      (oi += 1),
      il === null && (il = []),
      (t = qf(il, t, e)),
      (e = mt),
      (kt === null ? e.memoizedState : kt.next) === null &&
        ((e = e.alternate),
        (C.H = e === null || e.memoizedState === null ? Ad : xd)),
      t
    );
  }
  function Ru(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return fi(t);
      if (t.$$typeof === V) return se(t);
    }
    throw Error(c(438, String(t)));
  }
  function Cr(t) {
    var e = null,
      n = mt.updateQueue;
    if ((n !== null && (e = n.memoCache), e == null)) {
      var a = mt.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (e = {
              data: a.data.map(function (i) {
                return i.slice();
              }),
              index: 0,
            })));
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      n === null && ((n = Dr()), (mt.updateQueue = n)),
      (n.memoCache = e),
      (n = e.data[e.index]),
      n === void 0)
    )
      for (n = e.data[e.index] = Array(t), a = 0; a < t; a++) n[a] = W;
    return e.index++, n;
  }
  function gn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function Tu(t) {
    var e = Ft();
    return zr(e, zt, t);
  }
  function zr(t, e, n) {
    var a = t.queue;
    if (a === null) throw Error(c(311));
    a.lastRenderedReducer = n;
    var i = t.baseQueue,
      r = a.pending;
    if (r !== null) {
      if (i !== null) {
        var o = i.next;
        (i.next = r.next), (r.next = o);
      }
      (e.baseQueue = i = r), (a.pending = null);
    }
    if (((r = t.baseState), i === null)) t.memoizedState = r;
    else {
      e = i.next;
      var y = (o = null),
        _ = null,
        A = e,
        H = !1;
      do {
        var Q = A.lane & -536870913;
        if (Q !== A.lane ? (Tt & Q) === Q : (Hn & Q) === Q) {
          var D = A.revertLane;
          if (D === 0)
            _ !== null &&
              (_ = _.next =
                {
                  lane: 0,
                  revertLane: 0,
                  action: A.action,
                  hasEagerState: A.hasEagerState,
                  eagerState: A.eagerState,
                  next: null,
                }),
              Q === el && (H = !0);
          else if ((Hn & D) === D) {
            (A = A.next), D === el && (H = !0);
            continue;
          } else
            (Q = {
              lane: 0,
              revertLane: A.revertLane,
              action: A.action,
              hasEagerState: A.hasEagerState,
              eagerState: A.eagerState,
              next: null,
            }),
              _ === null ? ((y = _ = Q), (o = r)) : (_ = _.next = Q),
              (mt.lanes |= D),
              (Vn |= D);
          (Q = A.action),
            Ea && n(r, Q),
            (r = A.hasEagerState ? A.eagerState : n(r, Q));
        } else
          (D = {
            lane: Q,
            revertLane: A.revertLane,
            action: A.action,
            hasEagerState: A.hasEagerState,
            eagerState: A.eagerState,
            next: null,
          }),
            _ === null ? ((y = _ = D), (o = r)) : (_ = _.next = D),
            (mt.lanes |= Q),
            (Vn |= Q);
        A = A.next;
      } while (A !== null && A !== e);
      if (
        (_ === null ? (o = r) : (_.next = y),
        !Ee(r, t.memoizedState) && ((te = !0), H && ((n = nl), n !== null)))
      )
        throw n;
      (t.memoizedState = r),
        (t.baseState = o),
        (t.baseQueue = _),
        (a.lastRenderedState = r);
    }
    return i === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function Ur(t) {
    var e = Ft(),
      n = e.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = t;
    var a = n.dispatch,
      i = n.pending,
      r = e.memoizedState;
    if (i !== null) {
      n.pending = null;
      var o = (i = i.next);
      do (r = t(r, o.action)), (o = o.next);
      while (o !== i);
      Ee(r, e.memoizedState) || (te = !0),
        (e.memoizedState = r),
        e.baseQueue === null && (e.baseState = r),
        (n.lastRenderedState = r);
    }
    return [r, a];
  }
  function Jf(t, e, n) {
    var a = mt,
      i = Ft(),
      r = At;
    if (r) {
      if (n === void 0) throw Error(c(407));
      n = n();
    } else n = e();
    var o = !Ee((zt || i).memoizedState, n);
    o && ((i.memoizedState = n), (te = !0)), (i = i.queue);
    var y = Pf.bind(null, a, i, t);
    if (
      (di(2048, 8, y, [t]),
      i.getSnapshot !== e || o || (kt !== null && kt.memoizedState.tag & 1))
    ) {
      if (
        ((a.flags |= 2048),
        ul(9, Mu(), Ff.bind(null, a, i, n, e), null),
        Ht === null)
      )
        throw Error(c(349));
      r || (Hn & 124) !== 0 || kf(a, e, n);
    }
    return n;
  }
  function kf(t, e, n) {
    (t.flags |= 16384),
      (t = { getSnapshot: e, value: n }),
      (e = mt.updateQueue),
      e === null
        ? ((e = Dr()), (mt.updateQueue = e), (e.stores = [t]))
        : ((n = e.stores), n === null ? (e.stores = [t]) : n.push(t));
  }
  function Ff(t, e, n, a) {
    (e.value = n), (e.getSnapshot = a), $f(e) && Wf(t);
  }
  function Pf(t, e, n) {
    return n(function () {
      $f(e) && Wf(t);
    });
  }
  function $f(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !Ee(t, n);
    } catch {
      return !0;
    }
  }
  function Wf(t) {
    var e = $a(t, 2);
    e !== null && xe(e, t, 2);
  }
  function wr(t) {
    var e = pe();
    if (typeof t == "function") {
      var n = t;
      if (((t = n()), Ea)) {
        Dn(!0);
        try {
          n();
        } finally {
          Dn(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: gn,
        lastRenderedState: t,
      }),
      e
    );
  }
  function If(t, e, n, a) {
    return (t.baseState = n), zr(t, zt, typeof a == "function" ? a : gn);
  }
  function Zm(t, e, n, a, i) {
    if (Au(t)) throw Error(c(485));
    if (((t = e.action), t !== null)) {
      var r = {
        payload: i,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (o) {
          r.listeners.push(o);
        },
      };
      C.T !== null ? n(!0) : (r.isTransition = !1),
        a(r),
        (n = e.pending),
        n === null
          ? ((r.next = e.pending = r), td(e, r))
          : ((r.next = n.next), (e.pending = n.next = r));
    }
  }
  function td(t, e) {
    var n = e.action,
      a = e.payload,
      i = t.state;
    if (e.isTransition) {
      var r = C.T,
        o = {};
      C.T = o;
      try {
        var y = n(i, a),
          _ = C.S;
        _ !== null && _(o, y), ed(t, e, y);
      } catch (A) {
        Nr(t, e, A);
      } finally {
        C.T = r;
      }
    } else
      try {
        (r = n(i, a)), ed(t, e, r);
      } catch (A) {
        Nr(t, e, A);
      }
  }
  function ed(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function"
      ? n.then(
          function (a) {
            nd(t, e, a);
          },
          function (a) {
            return Nr(t, e, a);
          },
        )
      : nd(t, e, n);
  }
  function nd(t, e, n) {
    (e.status = "fulfilled"),
      (e.value = n),
      ad(e),
      (t.state = n),
      (e = t.pending),
      e !== null &&
        ((n = e.next),
        n === e ? (t.pending = null) : ((n = n.next), (e.next = n), td(t, n)));
  }
  function Nr(t, e, n) {
    var a = t.pending;
    if (((t.pending = null), a !== null)) {
      a = a.next;
      do (e.status = "rejected"), (e.reason = n), ad(e), (e = e.next);
      while (e !== a);
    }
    t.action = null;
  }
  function ad(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function ld(t, e) {
    return e;
  }
  function id(t, e) {
    if (At) {
      var n = Ht.formState;
      if (n !== null) {
        t: {
          var a = mt;
          if (At) {
            if (Gt) {
              e: {
                for (var i = Gt, r = Ie; i.nodeType !== 8; ) {
                  if (!r) {
                    i = null;
                    break e;
                  }
                  if (((i = Fe(i.nextSibling)), i === null)) {
                    i = null;
                    break e;
                  }
                }
                (r = i.data), (i = r === "F!" || r === "F" ? i : null);
              }
              if (i) {
                (Gt = Fe(i.nextSibling)), (a = i.data === "F!");
                break t;
              }
            }
            ga(a);
          }
          a = !1;
        }
        a && (e = n[0]);
      }
    }
    return (
      (n = pe()),
      (n.memoizedState = n.baseState = e),
      (a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ld,
        lastRenderedState: e,
      }),
      (n.queue = a),
      (n = Td.bind(null, mt, a)),
      (a.dispatch = n),
      (a = wr(!1)),
      (r = qr.bind(null, mt, !1, a.queue)),
      (a = pe()),
      (i = { state: e, dispatch: null, action: t, pending: null }),
      (a.queue = i),
      (n = Zm.bind(null, mt, i, r, n)),
      (i.dispatch = n),
      (a.memoizedState = t),
      [e, n, !1]
    );
  }
  function ud(t) {
    var e = Ft();
    return sd(e, zt, t);
  }
  function sd(t, e, n) {
    if (
      ((e = zr(t, e, ld)[0]),
      (t = Tu(gn)[0]),
      typeof e == "object" && e !== null && typeof e.then == "function")
    )
      try {
        var a = fi(e);
      } catch (o) {
        throw o === ii ? gu : o;
      }
    else a = e;
    e = Ft();
    var i = e.queue,
      r = i.dispatch;
    return (
      n !== e.memoizedState &&
        ((mt.flags |= 2048), ul(9, Mu(), Jm.bind(null, i, n), null)),
      [a, r, t]
    );
  }
  function Jm(t, e) {
    t.action = e;
  }
  function rd(t) {
    var e = Ft(),
      n = zt;
    if (n !== null) return sd(e, n, t);
    Ft(), (e = e.memoizedState), (n = Ft());
    var a = n.queue.dispatch;
    return (n.memoizedState = t), [e, a, !1];
  }
  function ul(t, e, n, a) {
    return (
      (t = { tag: t, create: n, deps: a, inst: e, next: null }),
      (e = mt.updateQueue),
      e === null && ((e = Dr()), (mt.updateQueue = e)),
      (n = e.lastEffect),
      n === null
        ? (e.lastEffect = t.next = t)
        : ((a = n.next), (n.next = t), (t.next = a), (e.lastEffect = t)),
      t
    );
  }
  function Mu() {
    return { destroy: void 0, resource: void 0 };
  }
  function cd() {
    return Ft().memoizedState;
  }
  function Ou(t, e, n, a) {
    var i = pe();
    (a = a === void 0 ? null : a),
      (mt.flags |= t),
      (i.memoizedState = ul(1 | e, Mu(), n, a));
  }
  function di(t, e, n, a) {
    var i = Ft();
    a = a === void 0 ? null : a;
    var r = i.memoizedState.inst;
    zt !== null && a !== null && Tr(a, zt.memoizedState.deps)
      ? (i.memoizedState = ul(e, r, n, a))
      : ((mt.flags |= t), (i.memoizedState = ul(1 | e, r, n, a)));
  }
  function od(t, e) {
    Ou(8390656, 8, t, e);
  }
  function fd(t, e) {
    di(2048, 8, t, e);
  }
  function dd(t, e) {
    return di(4, 2, t, e);
  }
  function hd(t, e) {
    return di(4, 4, t, e);
  }
  function yd(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function () {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null;
        }
      );
  }
  function vd(t, e, n) {
    (n = n != null ? n.concat([t]) : null), di(4, 4, yd.bind(null, e, t), n);
  }
  function Lr() {}
  function md(t, e) {
    var n = Ft();
    e = e === void 0 ? null : e;
    var a = n.memoizedState;
    return e !== null && Tr(e, a[1]) ? a[0] : ((n.memoizedState = [t, e]), t);
  }
  function pd(t, e) {
    var n = Ft();
    e = e === void 0 ? null : e;
    var a = n.memoizedState;
    if (e !== null && Tr(e, a[1])) return a[0];
    if (((a = t()), Ea)) {
      Dn(!0);
      try {
        t();
      } finally {
        Dn(!1);
      }
    }
    return (n.memoizedState = [a, e]), a;
  }
  function Hr(t, e, n) {
    return n === void 0 || (Hn & 1073741824) !== 0
      ? (t.memoizedState = e)
      : ((t.memoizedState = n), (t = bh()), (mt.lanes |= t), (Vn |= t), n);
  }
  function gd(t, e, n, a) {
    return Ee(n, e)
      ? n
      : al.current !== null
        ? ((t = Hr(t, n, a)), Ee(t, e) || (te = !0), t)
        : (Hn & 42) === 0
          ? ((te = !0), (t.memoizedState = n))
          : ((t = bh()), (mt.lanes |= t), (Vn |= t), e);
  }
  function Sd(t, e, n, a, i) {
    var r = X.p;
    X.p = r !== 0 && 8 > r ? r : 8;
    var o = C.T,
      y = {};
    (C.T = y), qr(t, !1, e, n);
    try {
      var _ = i(),
        A = C.S;
      if (
        (A !== null && A(y, _),
        _ !== null && typeof _ == "object" && typeof _.then == "function")
      ) {
        var H = Vm(_, a);
        hi(t, e, H, Ae(t));
      } else hi(t, e, a, Ae(t));
    } catch (Q) {
      hi(t, e, { then: function () {}, status: "rejected", reason: Q }, Ae());
    } finally {
      (X.p = r), (C.T = o);
    }
  }
  function km() {}
  function jr(t, e, n, a) {
    if (t.tag !== 5) throw Error(c(476));
    var i = bd(t).queue;
    Sd(
      t,
      i,
      e,
      at,
      n === null
        ? km
        : function () {
            return _d(t), n(a);
          },
    );
  }
  function bd(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: at,
      baseState: at,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: gn,
        lastRenderedState: at,
      },
      next: null,
    };
    var n = {};
    return (
      (e.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: gn,
          lastRenderedState: n,
        },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    );
  }
  function _d(t) {
    var e = bd(t).next.queue;
    hi(t, e, {}, Ae());
  }
  function Br() {
    return se(zi);
  }
  function Ed() {
    return Ft().memoizedState;
  }
  function Rd() {
    return Ft().memoizedState;
  }
  function Fm(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = Ae();
          t = Nn(n);
          var a = Ln(e, t, n);
          a !== null && (xe(a, e, n), si(a, e, n)),
            (e = { cache: yr() }),
            (t.payload = e);
          return;
      }
      e = e.return;
    }
  }
  function Pm(t, e, n) {
    var a = Ae();
    (n = {
      lane: a,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Au(t)
        ? Md(e, n)
        : ((n = lr(t, e, n, a)), n !== null && (xe(n, t, a), Od(n, e, a)));
  }
  function Td(t, e, n) {
    var a = Ae();
    hi(t, e, n, a);
  }
  function hi(t, e, n, a) {
    var i = {
      lane: a,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Au(t)) Md(e, i);
    else {
      var r = t.alternate;
      if (
        t.lanes === 0 &&
        (r === null || r.lanes === 0) &&
        ((r = e.lastRenderedReducer), r !== null)
      )
        try {
          var o = e.lastRenderedState,
            y = r(o, n);
          if (((i.hasEagerState = !0), (i.eagerState = y), Ee(y, o)))
            return ou(t, e, i, 0), Ht === null && cu(), !1;
        } catch {
        } finally {
        }
      if (((n = lr(t, e, i, a)), n !== null))
        return xe(n, t, a), Od(n, e, a), !0;
    }
    return !1;
  }
  function qr(t, e, n, a) {
    if (
      ((a = {
        lane: 2,
        revertLane: pc(),
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Au(t))
    ) {
      if (e) throw Error(c(479));
    } else (e = lr(t, n, a, 2)), e !== null && xe(e, t, 2);
  }
  function Au(t) {
    var e = t.alternate;
    return t === mt || (e !== null && e === mt);
  }
  function Md(t, e) {
    ll = _u = !0;
    var n = t.pending;
    n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
      (t.pending = e);
  }
  function Od(t, e, n) {
    if ((n & 4194048) !== 0) {
      var a = e.lanes;
      (a &= t.pendingLanes), (n |= a), (e.lanes = n), wo(t, n);
    }
  }
  var xu = {
      readContext: se,
      use: Ru,
      useCallback: Xt,
      useContext: Xt,
      useEffect: Xt,
      useImperativeHandle: Xt,
      useLayoutEffect: Xt,
      useInsertionEffect: Xt,
      useMemo: Xt,
      useReducer: Xt,
      useRef: Xt,
      useState: Xt,
      useDebugValue: Xt,
      useDeferredValue: Xt,
      useTransition: Xt,
      useSyncExternalStore: Xt,
      useId: Xt,
      useHostTransitionStatus: Xt,
      useFormState: Xt,
      useActionState: Xt,
      useOptimistic: Xt,
      useMemoCache: Xt,
      useCacheRefresh: Xt,
    },
    Ad = {
      readContext: se,
      use: Ru,
      useCallback: function (t, e) {
        return (pe().memoizedState = [t, e === void 0 ? null : e]), t;
      },
      useContext: se,
      useEffect: od,
      useImperativeHandle: function (t, e, n) {
        (n = n != null ? n.concat([t]) : null),
          Ou(4194308, 4, yd.bind(null, e, t), n);
      },
      useLayoutEffect: function (t, e) {
        return Ou(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        Ou(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var n = pe();
        e = e === void 0 ? null : e;
        var a = t();
        if (Ea) {
          Dn(!0);
          try {
            t();
          } finally {
            Dn(!1);
          }
        }
        return (n.memoizedState = [a, e]), a;
      },
      useReducer: function (t, e, n) {
        var a = pe();
        if (n !== void 0) {
          var i = n(e);
          if (Ea) {
            Dn(!0);
            try {
              n(e);
            } finally {
              Dn(!1);
            }
          }
        } else i = e;
        return (
          (a.memoizedState = a.baseState = i),
          (t = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: t,
            lastRenderedState: i,
          }),
          (a.queue = t),
          (t = t.dispatch = Pm.bind(null, mt, t)),
          [a.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = pe();
        return (t = { current: t }), (e.memoizedState = t);
      },
      useState: function (t) {
        t = wr(t);
        var e = t.queue,
          n = Td.bind(null, mt, e);
        return (e.dispatch = n), [t.memoizedState, n];
      },
      useDebugValue: Lr,
      useDeferredValue: function (t, e) {
        var n = pe();
        return Hr(n, t, e);
      },
      useTransition: function () {
        var t = wr(!1);
        return (
          (t = Sd.bind(null, mt, t.queue, !0, !1)),
          (pe().memoizedState = t),
          [!1, t]
        );
      },
      useSyncExternalStore: function (t, e, n) {
        var a = mt,
          i = pe();
        if (At) {
          if (n === void 0) throw Error(c(407));
          n = n();
        } else {
          if (((n = e()), Ht === null)) throw Error(c(349));
          (Tt & 124) !== 0 || kf(a, e, n);
        }
        i.memoizedState = n;
        var r = { value: n, getSnapshot: e };
        return (
          (i.queue = r),
          od(Pf.bind(null, a, r, t), [t]),
          (a.flags |= 2048),
          ul(9, Mu(), Ff.bind(null, a, r, n, e), null),
          n
        );
      },
      useId: function () {
        var t = pe(),
          e = Ht.identifierPrefix;
        if (At) {
          var n = vn,
            a = yn;
          (n = (a & ~(1 << (32 - _e(a) - 1))).toString(32) + n),
            (e = "«" + e + "R" + n),
            (n = Eu++),
            0 < n && (e += "H" + n.toString(32)),
            (e += "»");
        } else (n = Xm++), (e = "«" + e + "r" + n.toString(32) + "»");
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: Br,
      useFormState: id,
      useActionState: id,
      useOptimistic: function (t) {
        var e = pe();
        e.memoizedState = e.baseState = t;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (e.queue = n),
          (e = qr.bind(null, mt, !0, n)),
          (n.dispatch = e),
          [t, e]
        );
      },
      useMemoCache: Cr,
      useCacheRefresh: function () {
        return (pe().memoizedState = Fm.bind(null, mt));
      },
    },
    xd = {
      readContext: se,
      use: Ru,
      useCallback: md,
      useContext: se,
      useEffect: fd,
      useImperativeHandle: vd,
      useInsertionEffect: dd,
      useLayoutEffect: hd,
      useMemo: pd,
      useReducer: Tu,
      useRef: cd,
      useState: function () {
        return Tu(gn);
      },
      useDebugValue: Lr,
      useDeferredValue: function (t, e) {
        var n = Ft();
        return gd(n, zt.memoizedState, t, e);
      },
      useTransition: function () {
        var t = Tu(gn)[0],
          e = Ft().memoizedState;
        return [typeof t == "boolean" ? t : fi(t), e];
      },
      useSyncExternalStore: Jf,
      useId: Ed,
      useHostTransitionStatus: Br,
      useFormState: ud,
      useActionState: ud,
      useOptimistic: function (t, e) {
        var n = Ft();
        return If(n, zt, t, e);
      },
      useMemoCache: Cr,
      useCacheRefresh: Rd,
    },
    $m = {
      readContext: se,
      use: Ru,
      useCallback: md,
      useContext: se,
      useEffect: fd,
      useImperativeHandle: vd,
      useInsertionEffect: dd,
      useLayoutEffect: hd,
      useMemo: pd,
      useReducer: Ur,
      useRef: cd,
      useState: function () {
        return Ur(gn);
      },
      useDebugValue: Lr,
      useDeferredValue: function (t, e) {
        var n = Ft();
        return zt === null ? Hr(n, t, e) : gd(n, zt.memoizedState, t, e);
      },
      useTransition: function () {
        var t = Ur(gn)[0],
          e = Ft().memoizedState;
        return [typeof t == "boolean" ? t : fi(t), e];
      },
      useSyncExternalStore: Jf,
      useId: Ed,
      useHostTransitionStatus: Br,
      useFormState: rd,
      useActionState: rd,
      useOptimistic: function (t, e) {
        var n = Ft();
        return zt !== null
          ? If(n, zt, t, e)
          : ((n.baseState = t), [t, n.queue.dispatch]);
      },
      useMemoCache: Cr,
      useCacheRefresh: Rd,
    },
    sl = null,
    yi = 0;
  function Du(t) {
    var e = yi;
    return (yi += 1), sl === null && (sl = []), qf(sl, t, e);
  }
  function vi(t, e) {
    (e = e.props.ref), (t.ref = e !== void 0 ? e : null);
  }
  function Cu(t, e) {
    throw e.$$typeof === m
      ? Error(c(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(
          c(
            31,
            t === "[object Object]"
              ? "object with keys {" + Object.keys(e).join(", ") + "}"
              : t,
          ),
        ));
  }
  function Dd(t) {
    var e = t._init;
    return e(t._payload);
  }
  function Cd(t) {
    function e(T, R) {
      if (t) {
        var O = T.deletions;
        O === null ? ((T.deletions = [R]), (T.flags |= 16)) : O.push(R);
      }
    }
    function n(T, R) {
      if (!t) return null;
      for (; R !== null; ) e(T, R), (R = R.sibling);
      return null;
    }
    function a(T) {
      for (var R = new Map(); T !== null; )
        T.key !== null ? R.set(T.key, T) : R.set(T.index, T), (T = T.sibling);
      return R;
    }
    function i(T, R) {
      return (T = hn(T, R)), (T.index = 0), (T.sibling = null), T;
    }
    function r(T, R, O) {
      return (
        (T.index = O),
        t
          ? ((O = T.alternate),
            O !== null
              ? ((O = O.index), O < R ? ((T.flags |= 67108866), R) : O)
              : ((T.flags |= 67108866), R))
          : ((T.flags |= 1048576), R)
      );
    }
    function o(T) {
      return t && T.alternate === null && (T.flags |= 67108866), T;
    }
    function y(T, R, O, j) {
      return R === null || R.tag !== 6
        ? ((R = ur(O, T.mode, j)), (R.return = T), R)
        : ((R = i(R, O)), (R.return = T), R);
    }
    function _(T, R, O, j) {
      var nt = O.type;
      return nt === M
        ? H(T, R, O.props.children, j, O.key)
        : R !== null &&
            (R.elementType === nt ||
              (typeof nt == "object" &&
                nt !== null &&
                nt.$$typeof === G &&
                Dd(nt) === R.type))
          ? ((R = i(R, O.props)), vi(R, O), (R.return = T), R)
          : ((R = du(O.type, O.key, O.props, null, T.mode, j)),
            vi(R, O),
            (R.return = T),
            R);
    }
    function A(T, R, O, j) {
      return R === null ||
        R.tag !== 4 ||
        R.stateNode.containerInfo !== O.containerInfo ||
        R.stateNode.implementation !== O.implementation
        ? ((R = sr(O, T.mode, j)), (R.return = T), R)
        : ((R = i(R, O.children || [])), (R.return = T), R);
    }
    function H(T, R, O, j, nt) {
      return R === null || R.tag !== 7
        ? ((R = ya(O, T.mode, j, nt)), (R.return = T), R)
        : ((R = i(R, O)), (R.return = T), R);
    }
    function Q(T, R, O) {
      if (
        (typeof R == "string" && R !== "") ||
        typeof R == "number" ||
        typeof R == "bigint"
      )
        return (R = ur("" + R, T.mode, O)), (R.return = T), R;
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case b:
            return (
              (O = du(R.type, R.key, R.props, null, T.mode, O)),
              vi(O, R),
              (O.return = T),
              O
            );
          case x:
            return (R = sr(R, T.mode, O)), (R.return = T), R;
          case G:
            var j = R._init;
            return (R = j(R._payload)), Q(T, R, O);
        }
        if (ht(R) || et(R))
          return (R = ya(R, T.mode, O, null)), (R.return = T), R;
        if (typeof R.then == "function") return Q(T, Du(R), O);
        if (R.$$typeof === V) return Q(T, mu(T, R), O);
        Cu(T, R);
      }
      return null;
    }
    function D(T, R, O, j) {
      var nt = R !== null ? R.key : null;
      if (
        (typeof O == "string" && O !== "") ||
        typeof O == "number" ||
        typeof O == "bigint"
      )
        return nt !== null ? null : y(T, R, "" + O, j);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case b:
            return O.key === nt ? _(T, R, O, j) : null;
          case x:
            return O.key === nt ? A(T, R, O, j) : null;
          case G:
            return (nt = O._init), (O = nt(O._payload)), D(T, R, O, j);
        }
        if (ht(O) || et(O)) return nt !== null ? null : H(T, R, O, j, null);
        if (typeof O.then == "function") return D(T, R, Du(O), j);
        if (O.$$typeof === V) return D(T, R, mu(T, O), j);
        Cu(T, O);
      }
      return null;
    }
    function z(T, R, O, j, nt) {
      if (
        (typeof j == "string" && j !== "") ||
        typeof j == "number" ||
        typeof j == "bigint"
      )
        return (T = T.get(O) || null), y(R, T, "" + j, nt);
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case b:
            return (
              (T = T.get(j.key === null ? O : j.key) || null), _(R, T, j, nt)
            );
          case x:
            return (
              (T = T.get(j.key === null ? O : j.key) || null), A(R, T, j, nt)
            );
          case G:
            var _t = j._init;
            return (j = _t(j._payload)), z(T, R, O, j, nt);
        }
        if (ht(j) || et(j)) return (T = T.get(O) || null), H(R, T, j, nt, null);
        if (typeof j.then == "function") return z(T, R, O, Du(j), nt);
        if (j.$$typeof === V) return z(T, R, O, mu(R, j), nt);
        Cu(R, j);
      }
      return null;
    }
    function ft(T, R, O, j) {
      for (
        var nt = null, _t = null, ut = R, ot = (R = 0), ne = null;
        ut !== null && ot < O.length;
        ot++
      ) {
        ut.index > ot ? ((ne = ut), (ut = null)) : (ne = ut.sibling);
        var Mt = D(T, ut, O[ot], j);
        if (Mt === null) {
          ut === null && (ut = ne);
          break;
        }
        t && ut && Mt.alternate === null && e(T, ut),
          (R = r(Mt, R, ot)),
          _t === null ? (nt = Mt) : (_t.sibling = Mt),
          (_t = Mt),
          (ut = ne);
      }
      if (ot === O.length) return n(T, ut), At && ma(T, ot), nt;
      if (ut === null) {
        for (; ot < O.length; ot++)
          (ut = Q(T, O[ot], j)),
            ut !== null &&
              ((R = r(ut, R, ot)),
              _t === null ? (nt = ut) : (_t.sibling = ut),
              (_t = ut));
        return At && ma(T, ot), nt;
      }
      for (ut = a(ut); ot < O.length; ot++)
        (ne = z(ut, T, ot, O[ot], j)),
          ne !== null &&
            (t &&
              ne.alternate !== null &&
              ut.delete(ne.key === null ? ot : ne.key),
            (R = r(ne, R, ot)),
            _t === null ? (nt = ne) : (_t.sibling = ne),
            (_t = ne));
      return (
        t &&
          ut.forEach(function (Wn) {
            return e(T, Wn);
          }),
        At && ma(T, ot),
        nt
      );
    }
    function ct(T, R, O, j) {
      if (O == null) throw Error(c(151));
      for (
        var nt = null,
          _t = null,
          ut = R,
          ot = (R = 0),
          ne = null,
          Mt = O.next();
        ut !== null && !Mt.done;
        ot++, Mt = O.next()
      ) {
        ut.index > ot ? ((ne = ut), (ut = null)) : (ne = ut.sibling);
        var Wn = D(T, ut, Mt.value, j);
        if (Wn === null) {
          ut === null && (ut = ne);
          break;
        }
        t && ut && Wn.alternate === null && e(T, ut),
          (R = r(Wn, R, ot)),
          _t === null ? (nt = Wn) : (_t.sibling = Wn),
          (_t = Wn),
          (ut = ne);
      }
      if (Mt.done) return n(T, ut), At && ma(T, ot), nt;
      if (ut === null) {
        for (; !Mt.done; ot++, Mt = O.next())
          (Mt = Q(T, Mt.value, j)),
            Mt !== null &&
              ((R = r(Mt, R, ot)),
              _t === null ? (nt = Mt) : (_t.sibling = Mt),
              (_t = Mt));
        return At && ma(T, ot), nt;
      }
      for (ut = a(ut); !Mt.done; ot++, Mt = O.next())
        (Mt = z(ut, T, ot, Mt.value, j)),
          Mt !== null &&
            (t &&
              Mt.alternate !== null &&
              ut.delete(Mt.key === null ? ot : Mt.key),
            (R = r(Mt, R, ot)),
            _t === null ? (nt = Mt) : (_t.sibling = Mt),
            (_t = Mt));
      return (
        t &&
          ut.forEach(function (W0) {
            return e(T, W0);
          }),
        At && ma(T, ot),
        nt
      );
    }
    function wt(T, R, O, j) {
      if (
        (typeof O == "object" &&
          O !== null &&
          O.type === M &&
          O.key === null &&
          (O = O.props.children),
        typeof O == "object" && O !== null)
      ) {
        switch (O.$$typeof) {
          case b:
            t: {
              for (var nt = O.key; R !== null; ) {
                if (R.key === nt) {
                  if (((nt = O.type), nt === M)) {
                    if (R.tag === 7) {
                      n(T, R.sibling),
                        (j = i(R, O.props.children)),
                        (j.return = T),
                        (T = j);
                      break t;
                    }
                  } else if (
                    R.elementType === nt ||
                    (typeof nt == "object" &&
                      nt !== null &&
                      nt.$$typeof === G &&
                      Dd(nt) === R.type)
                  ) {
                    n(T, R.sibling),
                      (j = i(R, O.props)),
                      vi(j, O),
                      (j.return = T),
                      (T = j);
                    break t;
                  }
                  n(T, R);
                  break;
                } else e(T, R);
                R = R.sibling;
              }
              O.type === M
                ? ((j = ya(O.props.children, T.mode, j, O.key)),
                  (j.return = T),
                  (T = j))
                : ((j = du(O.type, O.key, O.props, null, T.mode, j)),
                  vi(j, O),
                  (j.return = T),
                  (T = j));
            }
            return o(T);
          case x:
            t: {
              for (nt = O.key; R !== null; ) {
                if (R.key === nt)
                  if (
                    R.tag === 4 &&
                    R.stateNode.containerInfo === O.containerInfo &&
                    R.stateNode.implementation === O.implementation
                  ) {
                    n(T, R.sibling),
                      (j = i(R, O.children || [])),
                      (j.return = T),
                      (T = j);
                    break t;
                  } else {
                    n(T, R);
                    break;
                  }
                else e(T, R);
                R = R.sibling;
              }
              (j = sr(O, T.mode, j)), (j.return = T), (T = j);
            }
            return o(T);
          case G:
            return (nt = O._init), (O = nt(O._payload)), wt(T, R, O, j);
        }
        if (ht(O)) return ft(T, R, O, j);
        if (et(O)) {
          if (((nt = et(O)), typeof nt != "function")) throw Error(c(150));
          return (O = nt.call(O)), ct(T, R, O, j);
        }
        if (typeof O.then == "function") return wt(T, R, Du(O), j);
        if (O.$$typeof === V) return wt(T, R, mu(T, O), j);
        Cu(T, O);
      }
      return (typeof O == "string" && O !== "") ||
        typeof O == "number" ||
        typeof O == "bigint"
        ? ((O = "" + O),
          R !== null && R.tag === 6
            ? (n(T, R.sibling), (j = i(R, O)), (j.return = T), (T = j))
            : (n(T, R), (j = ur(O, T.mode, j)), (j.return = T), (T = j)),
          o(T))
        : n(T, R);
    }
    return function (T, R, O, j) {
      try {
        yi = 0;
        var nt = wt(T, R, O, j);
        return (sl = null), nt;
      } catch (ut) {
        if (ut === ii || ut === gu) throw ut;
        var _t = Re(29, ut, null, T.mode);
        return (_t.lanes = j), (_t.return = T), _t;
      } finally {
      }
    };
  }
  var rl = Cd(!0),
    zd = Cd(!1),
    Be = N(null),
    tn = null;
  function jn(t) {
    var e = t.alternate;
    J($t, $t.current & 1),
      J(Be, t),
      tn === null &&
        (e === null || al.current !== null || e.memoizedState !== null) &&
        (tn = t);
  }
  function Ud(t) {
    if (t.tag === 22) {
      if ((J($t, $t.current), J(Be, t), tn === null)) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (tn = t);
      }
    } else Bn();
  }
  function Bn() {
    J($t, $t.current), J(Be, Be.current);
  }
  function Sn(t) {
    k(Be), tn === t && (tn = null), k($t);
  }
  var $t = N(0);
  function zu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (
          n !== null &&
          ((n = n.dehydrated), n === null || n.data === "$?" || Dc(n))
        )
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        (e.child.return = e), (e = e.child);
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      (e.sibling.return = e.return), (e = e.sibling);
    }
    return null;
  }
  function Qr(t, e, n, a) {
    (e = t.memoizedState),
      (n = n(a, e)),
      (n = n == null ? e : p({}, e, n)),
      (t.memoizedState = n),
      t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var Gr = {
    enqueueSetState: function (t, e, n) {
      t = t._reactInternals;
      var a = Ae(),
        i = Nn(a);
      (i.payload = e),
        n != null && (i.callback = n),
        (e = Ln(t, i, a)),
        e !== null && (xe(e, t, a), si(e, t, a));
    },
    enqueueReplaceState: function (t, e, n) {
      t = t._reactInternals;
      var a = Ae(),
        i = Nn(a);
      (i.tag = 1),
        (i.payload = e),
        n != null && (i.callback = n),
        (e = Ln(t, i, a)),
        e !== null && (xe(e, t, a), si(e, t, a));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var n = Ae(),
        a = Nn(n);
      (a.tag = 2),
        e != null && (a.callback = e),
        (e = Ln(t, a, n)),
        e !== null && (xe(e, t, n), si(e, t, n));
    },
  };
  function wd(t, e, n, a, i, r, o) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == "function"
        ? t.shouldComponentUpdate(a, r, o)
        : e.prototype && e.prototype.isPureReactComponent
          ? !$l(n, a) || !$l(i, r)
          : !0
    );
  }
  function Nd(t, e, n, a) {
    (t = e.state),
      typeof e.componentWillReceiveProps == "function" &&
        e.componentWillReceiveProps(n, a),
      typeof e.UNSAFE_componentWillReceiveProps == "function" &&
        e.UNSAFE_componentWillReceiveProps(n, a),
      e.state !== t && Gr.enqueueReplaceState(e, e.state, null);
  }
  function Ra(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var a in e) a !== "ref" && (n[a] = e[a]);
    }
    if ((t = t.defaultProps)) {
      n === e && (n = p({}, n));
      for (var i in t) n[i] === void 0 && (n[i] = t[i]);
    }
    return n;
  }
  var Uu =
    typeof reportError == "function"
      ? reportError
      : function (t) {
          if (
            typeof window == "object" &&
            typeof window.ErrorEvent == "function"
          ) {
            var e = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof t == "object" &&
                t !== null &&
                typeof t.message == "string"
                  ? String(t.message)
                  : String(t),
              error: t,
            });
            if (!window.dispatchEvent(e)) return;
          } else if (
            typeof process == "object" &&
            typeof process.emit == "function"
          ) {
            process.emit("uncaughtException", t);
            return;
          }
          console.error(t);
        };
  function Ld(t) {
    Uu(t);
  }
  function Hd(t) {
    console.error(t);
  }
  function jd(t) {
    Uu(t);
  }
  function wu(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Bd(t, e, n) {
    try {
      var a = t.onCaughtError;
      a(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null,
      });
    } catch (i) {
      setTimeout(function () {
        throw i;
      });
    }
  }
  function Yr(t, e, n) {
    return (
      (n = Nn(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        wu(t, e);
      }),
      n
    );
  }
  function qd(t) {
    return (t = Nn(t)), (t.tag = 3), t;
  }
  function Qd(t, e, n, a) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var r = a.value;
      (t.payload = function () {
        return i(r);
      }),
        (t.callback = function () {
          Bd(e, n, a);
        });
    }
    var o = n.stateNode;
    o !== null &&
      typeof o.componentDidCatch == "function" &&
      (t.callback = function () {
        Bd(e, n, a),
          typeof i != "function" &&
            (Xn === null ? (Xn = new Set([this])) : Xn.add(this));
        var y = a.stack;
        this.componentDidCatch(a.value, {
          componentStack: y !== null ? y : "",
        });
      });
  }
  function Wm(t, e, n, a, i) {
    if (
      ((n.flags |= 32768),
      a !== null && typeof a == "object" && typeof a.then == "function")
    ) {
      if (
        ((e = n.alternate),
        e !== null && ni(e, n, i, !0),
        (n = Be.current),
        n !== null)
      ) {
        switch (n.tag) {
          case 13:
            return (
              tn === null ? dc() : n.alternate === null && Yt === 0 && (Yt = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = i),
              a === pr
                ? (n.flags |= 16384)
                : ((e = n.updateQueue),
                  e === null ? (n.updateQueue = new Set([a])) : e.add(a),
                  yc(t, a, i)),
              !1
            );
          case 22:
            return (
              (n.flags |= 65536),
              a === pr
                ? (n.flags |= 16384)
                : ((e = n.updateQueue),
                  e === null
                    ? ((e = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([a]),
                      }),
                      (n.updateQueue = e))
                    : ((n = e.retryQueue),
                      n === null ? (e.retryQueue = new Set([a])) : n.add(a)),
                  yc(t, a, i)),
              !1
            );
        }
        throw Error(c(435, n.tag));
      }
      return yc(t, a, i), dc(), !1;
    }
    if (At)
      return (
        (e = Be.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = i),
            a !== or && ((t = Error(c(422), { cause: a })), ei(Ne(t, n))))
          : (a !== or && ((e = Error(c(423), { cause: a })), ei(Ne(e, n))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (i &= -i),
            (t.lanes |= i),
            (a = Ne(a, n)),
            (i = Yr(t.stateNode, a, i)),
            br(t, i),
            Yt !== 4 && (Yt = 2)),
        !1
      );
    var r = Error(c(520), { cause: a });
    if (
      ((r = Ne(r, n)),
      Ei === null ? (Ei = [r]) : Ei.push(r),
      Yt !== 4 && (Yt = 2),
      e === null)
    )
      return !0;
    (a = Ne(a, n)), (n = e);
    do {
      switch (n.tag) {
        case 3:
          return (
            (n.flags |= 65536),
            (t = i & -i),
            (n.lanes |= t),
            (t = Yr(n.stateNode, a, t)),
            br(n, t),
            !1
          );
        case 1:
          if (
            ((e = n.type),
            (r = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == "function" ||
                (r !== null &&
                  typeof r.componentDidCatch == "function" &&
                  (Xn === null || !Xn.has(r)))))
          )
            return (
              (n.flags |= 65536),
              (i &= -i),
              (n.lanes |= i),
              (i = qd(i)),
              Qd(i, t, n, a),
              br(n, i),
              !1
            );
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Gd = Error(c(461)),
    te = !1;
  function ae(t, e, n, a) {
    e.child = t === null ? zd(e, null, n, a) : rl(e, t.child, n, a);
  }
  function Yd(t, e, n, a, i) {
    n = n.render;
    var r = e.ref;
    if ("ref" in a) {
      var o = {};
      for (var y in a) y !== "ref" && (o[y] = a[y]);
    } else o = a;
    return (
      ba(e),
      (a = Mr(t, e, n, o, r, i)),
      (y = Or()),
      t !== null && !te
        ? (Ar(t, e, i), bn(t, e, i))
        : (At && y && rr(e), (e.flags |= 1), ae(t, e, a, i), e.child)
    );
  }
  function Vd(t, e, n, a, i) {
    if (t === null) {
      var r = n.type;
      return typeof r == "function" &&
        !ir(r) &&
        r.defaultProps === void 0 &&
        n.compare === null
        ? ((e.tag = 15), (e.type = r), Xd(t, e, r, a, i))
        : ((t = du(n.type, null, a, e, e.mode, i)),
          (t.ref = e.ref),
          (t.return = e),
          (e.child = t));
    }
    if (((r = t.child), !Pr(t, i))) {
      var o = r.memoizedProps;
      if (
        ((n = n.compare), (n = n !== null ? n : $l), n(o, a) && t.ref === e.ref)
      )
        return bn(t, e, i);
    }
    return (
      (e.flags |= 1),
      (t = hn(r, a)),
      (t.ref = e.ref),
      (t.return = e),
      (e.child = t)
    );
  }
  function Xd(t, e, n, a, i) {
    if (t !== null) {
      var r = t.memoizedProps;
      if ($l(r, a) && t.ref === e.ref)
        if (((te = !1), (e.pendingProps = a = r), Pr(t, i)))
          (t.flags & 131072) !== 0 && (te = !0);
        else return (e.lanes = t.lanes), bn(t, e, i);
    }
    return Vr(t, e, n, a, i);
  }
  function Kd(t, e, n) {
    var a = e.pendingProps,
      i = a.children,
      r = t !== null ? t.memoizedState : null;
    if (a.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (((a = r !== null ? r.baseLanes | n : n), t !== null)) {
          for (i = e.child = t.child, r = 0; i !== null; )
            (r = r | i.lanes | i.childLanes), (i = i.sibling);
          e.childLanes = r & ~a;
        } else (e.childLanes = 0), (e.child = null);
        return Zd(t, e, a, n);
      }
      if ((n & 536870912) !== 0)
        (e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && pu(e, r !== null ? r.cachePool : null),
          r !== null ? Xf(e, r) : Er(),
          Ud(e);
      else
        return (
          (e.lanes = e.childLanes = 536870912),
          Zd(t, e, r !== null ? r.baseLanes | n : n, n)
        );
    } else
      r !== null
        ? (pu(e, r.cachePool), Xf(e, r), Bn(), (e.memoizedState = null))
        : (t !== null && pu(e, null), Er(), Bn());
    return ae(t, e, i, n), e.child;
  }
  function Zd(t, e, n, a) {
    var i = mr();
    return (
      (i = i === null ? null : { parent: Pt._currentValue, pool: i }),
      (e.memoizedState = { baseLanes: n, cachePool: i }),
      t !== null && pu(e, null),
      Er(),
      Ud(e),
      t !== null && ni(t, e, a, !0),
      null
    );
  }
  function Nu(t, e) {
    var n = e.ref;
    if (n === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object") throw Error(c(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function Vr(t, e, n, a, i) {
    return (
      ba(e),
      (n = Mr(t, e, n, a, void 0, i)),
      (a = Or()),
      t !== null && !te
        ? (Ar(t, e, i), bn(t, e, i))
        : (At && a && rr(e), (e.flags |= 1), ae(t, e, n, i), e.child)
    );
  }
  function Jd(t, e, n, a, i, r) {
    return (
      ba(e),
      (e.updateQueue = null),
      (n = Zf(e, a, n, i)),
      Kf(t),
      (a = Or()),
      t !== null && !te
        ? (Ar(t, e, r), bn(t, e, r))
        : (At && a && rr(e), (e.flags |= 1), ae(t, e, n, r), e.child)
    );
  }
  function kd(t, e, n, a, i) {
    if ((ba(e), e.stateNode === null)) {
      var r = Wa,
        o = n.contextType;
      typeof o == "object" && o !== null && (r = se(o)),
        (r = new n(a, r)),
        (e.memoizedState =
          r.state !== null && r.state !== void 0 ? r.state : null),
        (r.updater = Gr),
        (e.stateNode = r),
        (r._reactInternals = e),
        (r = e.stateNode),
        (r.props = a),
        (r.state = e.memoizedState),
        (r.refs = {}),
        gr(e),
        (o = n.contextType),
        (r.context = typeof o == "object" && o !== null ? se(o) : Wa),
        (r.state = e.memoizedState),
        (o = n.getDerivedStateFromProps),
        typeof o == "function" && (Qr(e, n, o, a), (r.state = e.memoizedState)),
        typeof n.getDerivedStateFromProps == "function" ||
          typeof r.getSnapshotBeforeUpdate == "function" ||
          (typeof r.UNSAFE_componentWillMount != "function" &&
            typeof r.componentWillMount != "function") ||
          ((o = r.state),
          typeof r.componentWillMount == "function" && r.componentWillMount(),
          typeof r.UNSAFE_componentWillMount == "function" &&
            r.UNSAFE_componentWillMount(),
          o !== r.state && Gr.enqueueReplaceState(r, r.state, null),
          ci(e, a, r, i),
          ri(),
          (r.state = e.memoizedState)),
        typeof r.componentDidMount == "function" && (e.flags |= 4194308),
        (a = !0);
    } else if (t === null) {
      r = e.stateNode;
      var y = e.memoizedProps,
        _ = Ra(n, y);
      r.props = _;
      var A = r.context,
        H = n.contextType;
      (o = Wa), typeof H == "object" && H !== null && (o = se(H));
      var Q = n.getDerivedStateFromProps;
      (H =
        typeof Q == "function" ||
        typeof r.getSnapshotBeforeUpdate == "function"),
        (y = e.pendingProps !== y),
        H ||
          (typeof r.UNSAFE_componentWillReceiveProps != "function" &&
            typeof r.componentWillReceiveProps != "function") ||
          ((y || A !== o) && Nd(e, r, a, o)),
        (wn = !1);
      var D = e.memoizedState;
      (r.state = D),
        ci(e, a, r, i),
        ri(),
        (A = e.memoizedState),
        y || D !== A || wn
          ? (typeof Q == "function" && (Qr(e, n, Q, a), (A = e.memoizedState)),
            (_ = wn || wd(e, n, _, a, D, A, o))
              ? (H ||
                  (typeof r.UNSAFE_componentWillMount != "function" &&
                    typeof r.componentWillMount != "function") ||
                  (typeof r.componentWillMount == "function" &&
                    r.componentWillMount(),
                  typeof r.UNSAFE_componentWillMount == "function" &&
                    r.UNSAFE_componentWillMount()),
                typeof r.componentDidMount == "function" &&
                  (e.flags |= 4194308))
              : (typeof r.componentDidMount == "function" &&
                  (e.flags |= 4194308),
                (e.memoizedProps = a),
                (e.memoizedState = A)),
            (r.props = a),
            (r.state = A),
            (r.context = o),
            (a = _))
          : (typeof r.componentDidMount == "function" && (e.flags |= 4194308),
            (a = !1));
    } else {
      (r = e.stateNode),
        Sr(t, e),
        (o = e.memoizedProps),
        (H = Ra(n, o)),
        (r.props = H),
        (Q = e.pendingProps),
        (D = r.context),
        (A = n.contextType),
        (_ = Wa),
        typeof A == "object" && A !== null && (_ = se(A)),
        (y = n.getDerivedStateFromProps),
        (A =
          typeof y == "function" ||
          typeof r.getSnapshotBeforeUpdate == "function") ||
          (typeof r.UNSAFE_componentWillReceiveProps != "function" &&
            typeof r.componentWillReceiveProps != "function") ||
          ((o !== Q || D !== _) && Nd(e, r, a, _)),
        (wn = !1),
        (D = e.memoizedState),
        (r.state = D),
        ci(e, a, r, i),
        ri();
      var z = e.memoizedState;
      o !== Q ||
      D !== z ||
      wn ||
      (t !== null && t.dependencies !== null && vu(t.dependencies))
        ? (typeof y == "function" && (Qr(e, n, y, a), (z = e.memoizedState)),
          (H =
            wn ||
            wd(e, n, H, a, D, z, _) ||
            (t !== null && t.dependencies !== null && vu(t.dependencies)))
            ? (A ||
                (typeof r.UNSAFE_componentWillUpdate != "function" &&
                  typeof r.componentWillUpdate != "function") ||
                (typeof r.componentWillUpdate == "function" &&
                  r.componentWillUpdate(a, z, _),
                typeof r.UNSAFE_componentWillUpdate == "function" &&
                  r.UNSAFE_componentWillUpdate(a, z, _)),
              typeof r.componentDidUpdate == "function" && (e.flags |= 4),
              typeof r.getSnapshotBeforeUpdate == "function" &&
                (e.flags |= 1024))
            : (typeof r.componentDidUpdate != "function" ||
                (o === t.memoizedProps && D === t.memoizedState) ||
                (e.flags |= 4),
              typeof r.getSnapshotBeforeUpdate != "function" ||
                (o === t.memoizedProps && D === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = a),
              (e.memoizedState = z)),
          (r.props = a),
          (r.state = z),
          (r.context = _),
          (a = H))
        : (typeof r.componentDidUpdate != "function" ||
            (o === t.memoizedProps && D === t.memoizedState) ||
            (e.flags |= 4),
          typeof r.getSnapshotBeforeUpdate != "function" ||
            (o === t.memoizedProps && D === t.memoizedState) ||
            (e.flags |= 1024),
          (a = !1));
    }
    return (
      (r = a),
      Nu(t, e),
      (a = (e.flags & 128) !== 0),
      r || a
        ? ((r = e.stateNode),
          (n =
            a && typeof n.getDerivedStateFromError != "function"
              ? null
              : r.render()),
          (e.flags |= 1),
          t !== null && a
            ? ((e.child = rl(e, t.child, null, i)),
              (e.child = rl(e, null, n, i)))
            : ae(t, e, n, i),
          (e.memoizedState = r.state),
          (t = e.child))
        : (t = bn(t, e, i)),
      t
    );
  }
  function Fd(t, e, n, a) {
    return ti(), (e.flags |= 256), ae(t, e, n, a), e.child;
  }
  var Xr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function Kr(t) {
    return { baseLanes: t, cachePool: Hf() };
  }
  function Zr(t, e, n) {
    return (t = t !== null ? t.childLanes & ~n : 0), e && (t |= qe), t;
  }
  function Pd(t, e, n) {
    var a = e.pendingProps,
      i = !1,
      r = (e.flags & 128) !== 0,
      o;
    if (
      ((o = r) ||
        (o =
          t !== null && t.memoizedState === null ? !1 : ($t.current & 2) !== 0),
      o && ((i = !0), (e.flags &= -129)),
      (o = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (At) {
        if ((i ? jn(e) : Bn(), At)) {
          var y = Gt,
            _;
          if ((_ = y)) {
            t: {
              for (_ = y, y = Ie; _.nodeType !== 8; ) {
                if (!y) {
                  y = null;
                  break t;
                }
                if (((_ = Fe(_.nextSibling)), _ === null)) {
                  y = null;
                  break t;
                }
              }
              y = _;
            }
            y !== null
              ? ((e.memoizedState = {
                  dehydrated: y,
                  treeContext: va !== null ? { id: yn, overflow: vn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (_ = Re(18, null, null, 0)),
                (_.stateNode = y),
                (_.return = e),
                (e.child = _),
                (fe = e),
                (Gt = null),
                (_ = !0))
              : (_ = !1);
          }
          _ || ga(e);
        }
        if (
          ((y = e.memoizedState),
          y !== null && ((y = y.dehydrated), y !== null))
        )
          return Dc(y) ? (e.lanes = 32) : (e.lanes = 536870912), null;
        Sn(e);
      }
      return (
        (y = a.children),
        (a = a.fallback),
        i
          ? (Bn(),
            (i = e.mode),
            (y = Lu({ mode: "hidden", children: y }, i)),
            (a = ya(a, i, n, null)),
            (y.return = e),
            (a.return = e),
            (y.sibling = a),
            (e.child = y),
            (i = e.child),
            (i.memoizedState = Kr(n)),
            (i.childLanes = Zr(t, o, n)),
            (e.memoizedState = Xr),
            a)
          : (jn(e), Jr(e, y))
      );
    }
    if (
      ((_ = t.memoizedState), _ !== null && ((y = _.dehydrated), y !== null))
    ) {
      if (r)
        e.flags & 256
          ? (jn(e), (e.flags &= -257), (e = kr(t, e, n)))
          : e.memoizedState !== null
            ? (Bn(), (e.child = t.child), (e.flags |= 128), (e = null))
            : (Bn(),
              (i = a.fallback),
              (y = e.mode),
              (a = Lu({ mode: "visible", children: a.children }, y)),
              (i = ya(i, y, n, null)),
              (i.flags |= 2),
              (a.return = e),
              (i.return = e),
              (a.sibling = i),
              (e.child = a),
              rl(e, t.child, null, n),
              (a = e.child),
              (a.memoizedState = Kr(n)),
              (a.childLanes = Zr(t, o, n)),
              (e.memoizedState = Xr),
              (e = i));
      else if ((jn(e), Dc(y))) {
        if (((o = y.nextSibling && y.nextSibling.dataset), o)) var A = o.dgst;
        (o = A),
          (a = Error(c(419))),
          (a.stack = ""),
          (a.digest = o),
          ei({ value: a, source: null, stack: null }),
          (e = kr(t, e, n));
      } else if (
        (te || ni(t, e, n, !1), (o = (n & t.childLanes) !== 0), te || o)
      ) {
        if (
          ((o = Ht),
          o !== null &&
            ((a = n & -n),
            (a = (a & 42) !== 0 ? 1 : Cs(a)),
            (a = (a & (o.suspendedLanes | n)) !== 0 ? 0 : a),
            a !== 0 && a !== _.retryLane))
        )
          throw ((_.retryLane = a), $a(t, a), xe(o, t, a), Gd);
        y.data === "$?" || dc(), (e = kr(t, e, n));
      } else
        y.data === "$?"
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = _.treeContext),
            (Gt = Fe(y.nextSibling)),
            (fe = e),
            (At = !0),
            (pa = null),
            (Ie = !1),
            t !== null &&
              ((He[je++] = yn),
              (He[je++] = vn),
              (He[je++] = va),
              (yn = t.id),
              (vn = t.overflow),
              (va = e)),
            (e = Jr(e, a.children)),
            (e.flags |= 4096));
      return e;
    }
    return i
      ? (Bn(),
        (i = a.fallback),
        (y = e.mode),
        (_ = t.child),
        (A = _.sibling),
        (a = hn(_, { mode: "hidden", children: a.children })),
        (a.subtreeFlags = _.subtreeFlags & 65011712),
        A !== null ? (i = hn(A, i)) : ((i = ya(i, y, n, null)), (i.flags |= 2)),
        (i.return = e),
        (a.return = e),
        (a.sibling = i),
        (e.child = a),
        (a = i),
        (i = e.child),
        (y = t.child.memoizedState),
        y === null
          ? (y = Kr(n))
          : ((_ = y.cachePool),
            _ !== null
              ? ((A = Pt._currentValue),
                (_ = _.parent !== A ? { parent: A, pool: A } : _))
              : (_ = Hf()),
            (y = { baseLanes: y.baseLanes | n, cachePool: _ })),
        (i.memoizedState = y),
        (i.childLanes = Zr(t, o, n)),
        (e.memoizedState = Xr),
        a)
      : (jn(e),
        (n = t.child),
        (t = n.sibling),
        (n = hn(n, { mode: "visible", children: a.children })),
        (n.return = e),
        (n.sibling = null),
        t !== null &&
          ((o = e.deletions),
          o === null ? ((e.deletions = [t]), (e.flags |= 16)) : o.push(t)),
        (e.child = n),
        (e.memoizedState = null),
        n);
  }
  function Jr(t, e) {
    return (
      (e = Lu({ mode: "visible", children: e }, t.mode)),
      (e.return = t),
      (t.child = e)
    );
  }
  function Lu(t, e) {
    return (
      (t = Re(22, t, null, e)),
      (t.lanes = 0),
      (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null,
      }),
      t
    );
  }
  function kr(t, e, n) {
    return (
      rl(e, t.child, null, n),
      (t = Jr(e, e.pendingProps.children)),
      (t.flags |= 2),
      (e.memoizedState = null),
      t
    );
  }
  function $d(t, e, n) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e), dr(t.return, e, n);
  }
  function Fr(t, e, n, a, i) {
    var r = t.memoizedState;
    r === null
      ? (t.memoizedState = {
          isBackwards: e,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: n,
          tailMode: i,
        })
      : ((r.isBackwards = e),
        (r.rendering = null),
        (r.renderingStartTime = 0),
        (r.last = a),
        (r.tail = n),
        (r.tailMode = i));
  }
  function Wd(t, e, n) {
    var a = e.pendingProps,
      i = a.revealOrder,
      r = a.tail;
    if ((ae(t, e, a.children, n), (a = $t.current), (a & 2) !== 0))
      (a = (a & 1) | 2), (e.flags |= 128);
    else {
      if (t !== null && (t.flags & 128) !== 0)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13) t.memoizedState !== null && $d(t, n, e);
          else if (t.tag === 19) $d(t, n, e);
          else if (t.child !== null) {
            (t.child.return = t), (t = t.child);
            continue;
          }
          if (t === e) break t;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) break t;
            t = t.return;
          }
          (t.sibling.return = t.return), (t = t.sibling);
        }
      a &= 1;
    }
    switch ((J($t, a), i)) {
      case "forwards":
        for (n = e.child, i = null; n !== null; )
          (t = n.alternate),
            t !== null && zu(t) === null && (i = n),
            (n = n.sibling);
        (n = i),
          n === null
            ? ((i = e.child), (e.child = null))
            : ((i = n.sibling), (n.sibling = null)),
          Fr(e, !1, i, n, r);
        break;
      case "backwards":
        for (n = null, i = e.child, e.child = null; i !== null; ) {
          if (((t = i.alternate), t !== null && zu(t) === null)) {
            e.child = i;
            break;
          }
          (t = i.sibling), (i.sibling = n), (n = i), (i = t);
        }
        Fr(e, !0, n, null, r);
        break;
      case "together":
        Fr(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function bn(t, e, n) {
    if (
      (t !== null && (e.dependencies = t.dependencies),
      (Vn |= e.lanes),
      (n & e.childLanes) === 0)
    )
      if (t !== null) {
        if ((ni(t, e, n, !1), (n & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(c(153));
    if (e.child !== null) {
      for (
        t = e.child, n = hn(t, t.pendingProps), e.child = n, n.return = e;
        t.sibling !== null;

      )
        (t = t.sibling),
          (n = n.sibling = hn(t, t.pendingProps)),
          (n.return = e);
      n.sibling = null;
    }
    return e.child;
  }
  function Pr(t, e) {
    return (t.lanes & e) !== 0
      ? !0
      : ((t = t.dependencies), !!(t !== null && vu(t)));
  }
  function Im(t, e, n) {
    switch (e.tag) {
      case 3:
        it(e, e.stateNode.containerInfo),
          Un(e, Pt, t.memoizedState.cache),
          ti();
        break;
      case 27:
      case 5:
        Nt(e);
        break;
      case 4:
        it(e, e.stateNode.containerInfo);
        break;
      case 10:
        Un(e, e.type, e.memoizedProps.value);
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (jn(e), (e.flags |= 128), null)
            : (n & e.child.childLanes) !== 0
              ? Pd(t, e, n)
              : (jn(e), (t = bn(t, e, n)), t !== null ? t.sibling : null);
        jn(e);
        break;
      case 19:
        var i = (t.flags & 128) !== 0;
        if (
          ((a = (n & e.childLanes) !== 0),
          a || (ni(t, e, n, !1), (a = (n & e.childLanes) !== 0)),
          i)
        ) {
          if (a) return Wd(t, e, n);
          e.flags |= 128;
        }
        if (
          ((i = e.memoizedState),
          i !== null &&
            ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
          J($t, $t.current),
          a)
        )
          break;
        return null;
      case 22:
      case 23:
        return (e.lanes = 0), Kd(t, e, n);
      case 24:
        Un(e, Pt, t.memoizedState.cache);
    }
    return bn(t, e, n);
  }
  function Id(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) te = !0;
      else {
        if (!Pr(t, n) && (e.flags & 128) === 0) return (te = !1), Im(t, e, n);
        te = (t.flags & 131072) !== 0;
      }
    else (te = !1), At && (e.flags & 1048576) !== 0 && Df(e, yu, e.index);
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          t = e.pendingProps;
          var a = e.elementType,
            i = a._init;
          if (((a = i(a._payload)), (e.type = a), typeof a == "function"))
            ir(a)
              ? ((t = Ra(a, t)), (e.tag = 1), (e = kd(null, e, a, t, n)))
              : ((e.tag = 0), (e = Vr(null, e, a, t, n)));
          else {
            if (a != null) {
              if (((i = a.$$typeof), i === I)) {
                (e.tag = 11), (e = Yd(null, e, a, t, n));
                break t;
              } else if (i === F) {
                (e.tag = 14), (e = Vd(null, e, a, t, n));
                break t;
              }
            }
            throw ((e = pt(a) || a), Error(c(306, e, "")));
          }
        }
        return e;
      case 0:
        return Vr(t, e, e.type, e.pendingProps, n);
      case 1:
        return (a = e.type), (i = Ra(a, e.pendingProps)), kd(t, e, a, i, n);
      case 3:
        t: {
          if ((it(e, e.stateNode.containerInfo), t === null))
            throw Error(c(387));
          a = e.pendingProps;
          var r = e.memoizedState;
          (i = r.element), Sr(t, e), ci(e, a, null, n);
          var o = e.memoizedState;
          if (
            ((a = o.cache),
            Un(e, Pt, a),
            a !== r.cache && hr(e, [Pt], n, !0),
            ri(),
            (a = o.element),
            r.isDehydrated)
          )
            if (
              ((r = { element: a, isDehydrated: !1, cache: o.cache }),
              (e.updateQueue.baseState = r),
              (e.memoizedState = r),
              e.flags & 256)
            ) {
              e = Fd(t, e, a, n);
              break t;
            } else if (a !== i) {
              (i = Ne(Error(c(424)), e)), ei(i), (e = Fd(t, e, a, n));
              break t;
            } else {
              switch (((t = e.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (
                Gt = Fe(t.firstChild),
                  fe = e,
                  At = !0,
                  pa = null,
                  Ie = !0,
                  n = zd(e, null, a, n),
                  e.child = n;
                n;

              )
                (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
            }
          else {
            if ((ti(), a === i)) {
              e = bn(t, e, n);
              break t;
            }
            ae(t, e, a, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          Nu(t, e),
          t === null
            ? (n = ay(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = n)
              : At ||
                ((n = e.type),
                (t = e.pendingProps),
                (a = Fu(tt.current).createElement(n)),
                (a[ue] = e),
                (a[ve] = t),
                ie(a, n, t),
                It(a),
                (e.stateNode = a))
            : (e.memoizedState = ay(
                e.type,
                t.memoizedProps,
                e.pendingProps,
                t.memoizedState,
              )),
          null
        );
      case 27:
        return (
          Nt(e),
          t === null &&
            At &&
            ((a = e.stateNode = ty(e.type, e.pendingProps, tt.current)),
            (fe = e),
            (Ie = !0),
            (i = Gt),
            Jn(e.type) ? ((Cc = i), (Gt = Fe(a.firstChild))) : (Gt = i)),
          ae(t, e, e.pendingProps.children, n),
          Nu(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            At &&
            ((i = a = Gt) &&
              ((a = A0(a, e.type, e.pendingProps, Ie)),
              a !== null
                ? ((e.stateNode = a),
                  (fe = e),
                  (Gt = Fe(a.firstChild)),
                  (Ie = !1),
                  (i = !0))
                : (i = !1)),
            i || ga(e)),
          Nt(e),
          (i = e.type),
          (r = e.pendingProps),
          (o = t !== null ? t.memoizedProps : null),
          (a = r.children),
          Oc(i, r) ? (a = null) : o !== null && Oc(i, o) && (e.flags |= 32),
          e.memoizedState !== null &&
            ((i = Mr(t, e, Km, null, null, n)), (zi._currentValue = i)),
          Nu(t, e),
          ae(t, e, a, n),
          e.child
        );
      case 6:
        return (
          t === null &&
            At &&
            ((t = n = Gt) &&
              ((n = x0(n, e.pendingProps, Ie)),
              n !== null
                ? ((e.stateNode = n), (fe = e), (Gt = null), (t = !0))
                : (t = !1)),
            t || ga(e)),
          null
        );
      case 13:
        return Pd(t, e, n);
      case 4:
        return (
          it(e, e.stateNode.containerInfo),
          (a = e.pendingProps),
          t === null ? (e.child = rl(e, null, a, n)) : ae(t, e, a, n),
          e.child
        );
      case 11:
        return Yd(t, e, e.type, e.pendingProps, n);
      case 7:
        return ae(t, e, e.pendingProps, n), e.child;
      case 8:
        return ae(t, e, e.pendingProps.children, n), e.child;
      case 12:
        return ae(t, e, e.pendingProps.children, n), e.child;
      case 10:
        return (
          (a = e.pendingProps),
          Un(e, e.type, a.value),
          ae(t, e, a.children, n),
          e.child
        );
      case 9:
        return (
          (i = e.type._context),
          (a = e.pendingProps.children),
          ba(e),
          (i = se(i)),
          (a = a(i)),
          (e.flags |= 1),
          ae(t, e, a, n),
          e.child
        );
      case 14:
        return Vd(t, e, e.type, e.pendingProps, n);
      case 15:
        return Xd(t, e, e.type, e.pendingProps, n);
      case 19:
        return Wd(t, e, n);
      case 31:
        return (
          (a = e.pendingProps),
          (n = e.mode),
          (a = { mode: a.mode, children: a.children }),
          t === null
            ? ((n = Lu(a, n)),
              (n.ref = e.ref),
              (e.child = n),
              (n.return = e),
              (e = n))
            : ((n = hn(t.child, a)),
              (n.ref = e.ref),
              (e.child = n),
              (n.return = e),
              (e = n)),
          e
        );
      case 22:
        return Kd(t, e, n);
      case 24:
        return (
          ba(e),
          (a = se(Pt)),
          t === null
            ? ((i = mr()),
              i === null &&
                ((i = Ht),
                (r = yr()),
                (i.pooledCache = r),
                r.refCount++,
                r !== null && (i.pooledCacheLanes |= n),
                (i = r)),
              (e.memoizedState = { parent: a, cache: i }),
              gr(e),
              Un(e, Pt, i))
            : ((t.lanes & n) !== 0 && (Sr(t, e), ci(e, null, null, n), ri()),
              (i = t.memoizedState),
              (r = e.memoizedState),
              i.parent !== a
                ? ((i = { parent: a, cache: a }),
                  (e.memoizedState = i),
                  e.lanes === 0 &&
                    (e.memoizedState = e.updateQueue.baseState = i),
                  Un(e, Pt, a))
                : ((a = r.cache),
                  Un(e, Pt, a),
                  a !== i.cache && hr(e, [Pt], n, !0))),
          ae(t, e, e.pendingProps.children, n),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(c(156, e.tag));
  }
  function _n(t) {
    t.flags |= 4;
  }
  function th(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (((t.flags |= 16777216), !ry(e))) {
      if (
        ((e = Be.current),
        e !== null &&
          ((Tt & 4194048) === Tt
            ? tn !== null
            : ((Tt & 62914560) !== Tt && (Tt & 536870912) === 0) || e !== tn))
      )
        throw ((ui = pr), jf);
      t.flags |= 8192;
    }
  }
  function Hu(t, e) {
    e !== null && (t.flags |= 4),
      t.flags & 16384 &&
        ((e = t.tag !== 22 ? zo() : 536870912), (t.lanes |= e), (dl |= e));
  }
  function mi(t, e) {
    if (!At)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var n = null; e !== null; )
            e.alternate !== null && (n = e), (e = e.sibling);
          n === null ? (t.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = t.tail;
          for (var a = null; n !== null; )
            n.alternate !== null && (a = n), (n = n.sibling);
          a === null
            ? e || t.tail === null
              ? (t.tail = null)
              : (t.tail.sibling = null)
            : (a.sibling = null);
      }
  }
  function qt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      n = 0,
      a = 0;
    if (e)
      for (var i = t.child; i !== null; )
        (n |= i.lanes | i.childLanes),
          (a |= i.subtreeFlags & 65011712),
          (a |= i.flags & 65011712),
          (i.return = t),
          (i = i.sibling);
    else
      for (i = t.child; i !== null; )
        (n |= i.lanes | i.childLanes),
          (a |= i.subtreeFlags),
          (a |= i.flags),
          (i.return = t),
          (i = i.sibling);
    return (t.subtreeFlags |= a), (t.childLanes = n), e;
  }
  function t0(t, e, n) {
    var a = e.pendingProps;
    switch ((cr(e), e.tag)) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return qt(e), null;
      case 1:
        return qt(e), null;
      case 3:
        return (
          (n = e.stateNode),
          (a = null),
          t !== null && (a = t.memoizedState.cache),
          e.memoizedState.cache !== a && (e.flags |= 2048),
          pn(Pt),
          bt(),
          n.pendingContext &&
            ((n.context = n.pendingContext), (n.pendingContext = null)),
          (t === null || t.child === null) &&
            (Il(e)
              ? _n(e)
              : t === null ||
                (t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                ((e.flags |= 1024), Uf())),
          qt(e),
          null
        );
      case 26:
        return (
          (n = e.memoizedState),
          t === null
            ? (_n(e),
              n !== null ? (qt(e), th(e, n)) : (qt(e), (e.flags &= -16777217)))
            : n
              ? n !== t.memoizedState
                ? (_n(e), qt(e), th(e, n))
                : (qt(e), (e.flags &= -16777217))
              : (t.memoizedProps !== a && _n(e), qt(e), (e.flags &= -16777217)),
          null
        );
      case 27:
        Qt(e), (n = tt.current);
        var i = e.type;
        if (t !== null && e.stateNode != null) t.memoizedProps !== a && _n(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(c(166));
            return qt(e), null;
          }
          (t = $.current),
            Il(e) ? Cf(e) : ((t = ty(i, a, n)), (e.stateNode = t), _n(e));
        }
        return qt(e), null;
      case 5:
        if ((Qt(e), (n = e.type), t !== null && e.stateNode != null))
          t.memoizedProps !== a && _n(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(c(166));
            return qt(e), null;
          }
          if (((t = $.current), Il(e))) Cf(e);
          else {
            switch (((i = Fu(tt.current)), t)) {
              case 1:
                t = i.createElementNS("http://www.w3.org/2000/svg", n);
                break;
              case 2:
                t = i.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                break;
              default:
                switch (n) {
                  case "svg":
                    t = i.createElementNS("http://www.w3.org/2000/svg", n);
                    break;
                  case "math":
                    t = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n,
                    );
                    break;
                  case "script":
                    (t = i.createElement("div")),
                      (t.innerHTML = "<script><\/script>"),
                      (t = t.removeChild(t.firstChild));
                    break;
                  case "select":
                    (t =
                      typeof a.is == "string"
                        ? i.createElement("select", { is: a.is })
                        : i.createElement("select")),
                      a.multiple
                        ? (t.multiple = !0)
                        : a.size && (t.size = a.size);
                    break;
                  default:
                    t =
                      typeof a.is == "string"
                        ? i.createElement(n, { is: a.is })
                        : i.createElement(n);
                }
            }
            (t[ue] = e), (t[ve] = a);
            t: for (i = e.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6) t.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                (i.child.return = i), (i = i.child);
                continue;
              }
              if (i === e) break t;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === e) break t;
                i = i.return;
              }
              (i.sibling.return = i.return), (i = i.sibling);
            }
            e.stateNode = t;
            t: switch ((ie(t, n, a), n)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                t = !!a.autoFocus;
                break t;
              case "img":
                t = !0;
                break t;
              default:
                t = !1;
            }
            t && _n(e);
          }
        }
        return qt(e), (e.flags &= -16777217), null;
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== a && _n(e);
        else {
          if (typeof a != "string" && e.stateNode === null) throw Error(c(166));
          if (((t = tt.current), Il(e))) {
            if (
              ((t = e.stateNode),
              (n = e.memoizedProps),
              (a = null),
              (i = fe),
              i !== null)
            )
              switch (i.tag) {
                case 27:
                case 5:
                  a = i.memoizedProps;
              }
            (t[ue] = e),
              (t = !!(
                t.nodeValue === n ||
                (a !== null && a.suppressHydrationWarning === !0) ||
                Jh(t.nodeValue, n)
              )),
              t || ga(e);
          } else (t = Fu(t).createTextNode(a)), (t[ue] = e), (e.stateNode = t);
        }
        return qt(e), null;
      case 13:
        if (
          ((a = e.memoizedState),
          t === null ||
            (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((i = Il(e)), a !== null && a.dehydrated !== null)) {
            if (t === null) {
              if (!i) throw Error(c(318));
              if (
                ((i = e.memoizedState),
                (i = i !== null ? i.dehydrated : null),
                !i)
              )
                throw Error(c(317));
              i[ue] = e;
            } else
              ti(),
                (e.flags & 128) === 0 && (e.memoizedState = null),
                (e.flags |= 4);
            qt(e), (i = !1);
          } else
            (i = Uf()),
              t !== null &&
                t.memoizedState !== null &&
                (t.memoizedState.hydrationErrors = i),
              (i = !0);
          if (!i) return e.flags & 256 ? (Sn(e), e) : (Sn(e), null);
        }
        if ((Sn(e), (e.flags & 128) !== 0)) return (e.lanes = n), e;
        if (
          ((n = a !== null), (t = t !== null && t.memoizedState !== null), n)
        ) {
          (a = e.child),
            (i = null),
            a.alternate !== null &&
              a.alternate.memoizedState !== null &&
              a.alternate.memoizedState.cachePool !== null &&
              (i = a.alternate.memoizedState.cachePool.pool);
          var r = null;
          a.memoizedState !== null &&
            a.memoizedState.cachePool !== null &&
            (r = a.memoizedState.cachePool.pool),
            r !== i && (a.flags |= 2048);
        }
        return (
          n !== t && n && (e.child.flags |= 8192),
          Hu(e, e.updateQueue),
          qt(e),
          null
        );
      case 4:
        return bt(), t === null && _c(e.stateNode.containerInfo), qt(e), null;
      case 10:
        return pn(e.type), qt(e), null;
      case 19:
        if ((k($t), (i = e.memoizedState), i === null)) return qt(e), null;
        if (((a = (e.flags & 128) !== 0), (r = i.rendering), r === null))
          if (a) mi(i, !1);
          else {
            if (Yt !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((r = zu(t)), r !== null)) {
                  for (
                    e.flags |= 128,
                      mi(i, !1),
                      t = r.updateQueue,
                      e.updateQueue = t,
                      Hu(e, t),
                      e.subtreeFlags = 0,
                      t = n,
                      n = e.child;
                    n !== null;

                  )
                    xf(n, t), (n = n.sibling);
                  return J($t, ($t.current & 1) | 2), e.child;
                }
                t = t.sibling;
              }
            i.tail !== null &&
              Wt() > qu &&
              ((e.flags |= 128), (a = !0), mi(i, !1), (e.lanes = 4194304));
          }
        else {
          if (!a)
            if (((t = zu(r)), t !== null)) {
              if (
                ((e.flags |= 128),
                (a = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                Hu(e, t),
                mi(i, !0),
                i.tail === null &&
                  i.tailMode === "hidden" &&
                  !r.alternate &&
                  !At)
              )
                return qt(e), null;
            } else
              2 * Wt() - i.renderingStartTime > qu &&
                n !== 536870912 &&
                ((e.flags |= 128), (a = !0), mi(i, !1), (e.lanes = 4194304));
          i.isBackwards
            ? ((r.sibling = e.child), (e.child = r))
            : ((t = i.last),
              t !== null ? (t.sibling = r) : (e.child = r),
              (i.last = r));
        }
        return i.tail !== null
          ? ((e = i.tail),
            (i.rendering = e),
            (i.tail = e.sibling),
            (i.renderingStartTime = Wt()),
            (e.sibling = null),
            (t = $t.current),
            J($t, a ? (t & 1) | 2 : t & 1),
            e)
          : (qt(e), null);
      case 22:
      case 23:
        return (
          Sn(e),
          Rr(),
          (a = e.memoizedState !== null),
          t !== null
            ? (t.memoizedState !== null) !== a && (e.flags |= 8192)
            : a && (e.flags |= 8192),
          a
            ? (n & 536870912) !== 0 &&
              (e.flags & 128) === 0 &&
              (qt(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : qt(e),
          (n = e.updateQueue),
          n !== null && Hu(e, n.retryQueue),
          (n = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (n = t.memoizedState.cachePool.pool),
          (a = null),
          e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (a = e.memoizedState.cachePool.pool),
          a !== n && (e.flags |= 2048),
          t !== null && k(_a),
          null
        );
      case 24:
        return (
          (n = null),
          t !== null && (n = t.memoizedState.cache),
          e.memoizedState.cache !== n && (e.flags |= 2048),
          pn(Pt),
          qt(e),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(c(156, e.tag));
  }
  function e0(t, e) {
    switch ((cr(e), e.tag)) {
      case 1:
        return (
          (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 3:
        return (
          pn(Pt),
          bt(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0
            ? ((e.flags = (t & -65537) | 128), e)
            : null
        );
      case 26:
      case 27:
      case 5:
        return Qt(e), null;
      case 13:
        if (
          (Sn(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)
        ) {
          if (e.alternate === null) throw Error(c(340));
          ti();
        }
        return (
          (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 19:
        return k($t), null;
      case 4:
        return bt(), null;
      case 10:
        return pn(e.type), null;
      case 22:
      case 23:
        return (
          Sn(e),
          Rr(),
          t !== null && k(_a),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return pn(Pt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function eh(t, e) {
    switch ((cr(e), e.tag)) {
      case 3:
        pn(Pt), bt();
        break;
      case 26:
      case 27:
      case 5:
        Qt(e);
        break;
      case 4:
        bt();
        break;
      case 13:
        Sn(e);
        break;
      case 19:
        k($t);
        break;
      case 10:
        pn(e.type);
        break;
      case 22:
      case 23:
        Sn(e), Rr(), t !== null && k(_a);
        break;
      case 24:
        pn(Pt);
    }
  }
  function pi(t, e) {
    try {
      var n = e.updateQueue,
        a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var i = a.next;
        n = i;
        do {
          if ((n.tag & t) === t) {
            a = void 0;
            var r = n.create,
              o = n.inst;
            (a = r()), (o.destroy = a);
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (y) {
      Lt(e, e.return, y);
    }
  }
  function qn(t, e, n) {
    try {
      var a = e.updateQueue,
        i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var r = i.next;
        a = r;
        do {
          if ((a.tag & t) === t) {
            var o = a.inst,
              y = o.destroy;
            if (y !== void 0) {
              (o.destroy = void 0), (i = e);
              var _ = n,
                A = y;
              try {
                A();
              } catch (H) {
                Lt(i, _, H);
              }
            }
          }
          a = a.next;
        } while (a !== r);
      }
    } catch (H) {
      Lt(e, e.return, H);
    }
  }
  function nh(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        Vf(e, n);
      } catch (a) {
        Lt(t, t.return, a);
      }
    }
  }
  function ah(t, e, n) {
    (n.props = Ra(t.type, t.memoizedProps)), (n.state = t.memoizedState);
    try {
      n.componentWillUnmount();
    } catch (a) {
      Lt(t, e, a);
    }
  }
  function gi(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof n == "function" ? (t.refCleanup = n(a)) : (n.current = a);
      }
    } catch (i) {
      Lt(t, e, i);
    }
  }
  function en(t, e) {
    var n = t.ref,
      a = t.refCleanup;
    if (n !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (i) {
          Lt(t, e, i);
        } finally {
          (t.refCleanup = null),
            (t = t.alternate),
            t != null && (t.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          Lt(t, e, i);
        }
      else n.current = null;
  }
  function lh(t) {
    var e = t.type,
      n = t.memoizedProps,
      a = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && a.focus();
          break t;
        case "img":
          n.src ? (a.src = n.src) : n.srcSet && (a.srcset = n.srcSet);
      }
    } catch (i) {
      Lt(t, t.return, i);
    }
  }
  function $r(t, e, n) {
    try {
      var a = t.stateNode;
      E0(a, t.type, n, e), (a[ve] = e);
    } catch (i) {
      Lt(t, t.return, i);
    }
  }
  function ih(t) {
    return (
      t.tag === 5 ||
      t.tag === 3 ||
      t.tag === 26 ||
      (t.tag === 27 && Jn(t.type)) ||
      t.tag === 4
    );
  }
  function Wr(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || ih(t.return)) return null;
        t = t.return;
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 18;

      ) {
        if (
          (t.tag === 27 && Jn(t.type)) ||
          t.flags & 2 ||
          t.child === null ||
          t.tag === 4
        )
          continue t;
        (t.child.return = t), (t = t.child);
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Ir(t, e, n) {
    var a = t.tag;
    if (a === 5 || a === 6)
      (t = t.stateNode),
        e
          ? (n.nodeType === 9
              ? n.body
              : n.nodeName === "HTML"
                ? n.ownerDocument.body
                : n
            ).insertBefore(t, e)
          : ((e =
              n.nodeType === 9
                ? n.body
                : n.nodeName === "HTML"
                  ? n.ownerDocument.body
                  : n),
            e.appendChild(t),
            (n = n._reactRootContainer),
            n != null || e.onclick !== null || (e.onclick = ku));
    else if (
      a !== 4 &&
      (a === 27 && Jn(t.type) && ((n = t.stateNode), (e = null)),
      (t = t.child),
      t !== null)
    )
      for (Ir(t, e, n), t = t.sibling; t !== null; )
        Ir(t, e, n), (t = t.sibling);
  }
  function ju(t, e, n) {
    var a = t.tag;
    if (a === 5 || a === 6)
      (t = t.stateNode), e ? n.insertBefore(t, e) : n.appendChild(t);
    else if (
      a !== 4 &&
      (a === 27 && Jn(t.type) && (n = t.stateNode), (t = t.child), t !== null)
    )
      for (ju(t, e, n), t = t.sibling; t !== null; )
        ju(t, e, n), (t = t.sibling);
  }
  function uh(t) {
    var e = t.stateNode,
      n = t.memoizedProps;
    try {
      for (var a = t.type, i = e.attributes; i.length; )
        e.removeAttributeNode(i[0]);
      ie(e, a, n), (e[ue] = t), (e[ve] = n);
    } catch (r) {
      Lt(t, t.return, r);
    }
  }
  var En = !1,
    Kt = !1,
    tc = !1,
    sh = typeof WeakSet == "function" ? WeakSet : Set,
    ee = null;
  function n0(t, e) {
    if (((t = t.containerInfo), (Tc = es), (t = gf(t)), Ws(t))) {
      if ("selectionStart" in t)
        var n = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          n = ((n = t.ownerDocument) && n.defaultView) || window;
          var a = n.getSelection && n.getSelection();
          if (a && a.rangeCount !== 0) {
            n = a.anchorNode;
            var i = a.anchorOffset,
              r = a.focusNode;
            a = a.focusOffset;
            try {
              n.nodeType, r.nodeType;
            } catch {
              n = null;
              break t;
            }
            var o = 0,
              y = -1,
              _ = -1,
              A = 0,
              H = 0,
              Q = t,
              D = null;
            e: for (;;) {
              for (
                var z;
                Q !== n || (i !== 0 && Q.nodeType !== 3) || (y = o + i),
                  Q !== r || (a !== 0 && Q.nodeType !== 3) || (_ = o + a),
                  Q.nodeType === 3 && (o += Q.nodeValue.length),
                  (z = Q.firstChild) !== null;

              )
                (D = Q), (Q = z);
              for (;;) {
                if (Q === t) break e;
                if (
                  (D === n && ++A === i && (y = o),
                  D === r && ++H === a && (_ = o),
                  (z = Q.nextSibling) !== null)
                )
                  break;
                (Q = D), (D = Q.parentNode);
              }
              Q = z;
            }
            n = y === -1 || _ === -1 ? null : { start: y, end: _ };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (
      Mc = { focusedElem: t, selectionRange: n }, es = !1, ee = e;
      ee !== null;

    )
      if (
        ((e = ee), (t = e.child), (e.subtreeFlags & 1024) !== 0 && t !== null)
      )
        (t.return = e), (ee = t);
      else
        for (; ee !== null; ) {
          switch (((e = ee), (r = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && r !== null) {
                (t = void 0),
                  (n = e),
                  (i = r.memoizedProps),
                  (r = r.memoizedState),
                  (a = n.stateNode);
                try {
                  var ft = Ra(n.type, i, n.elementType === n.type);
                  (t = a.getSnapshotBeforeUpdate(ft, r)),
                    (a.__reactInternalSnapshotBeforeUpdate = t);
                } catch (ct) {
                  Lt(n, n.return, ct);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (
                  ((t = e.stateNode.containerInfo), (n = t.nodeType), n === 9)
                )
                  xc(t);
                else if (n === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      xc(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(c(163));
          }
          if (((t = e.sibling), t !== null)) {
            (t.return = e.return), (ee = t);
            break;
          }
          ee = e.return;
        }
  }
  function rh(t, e, n) {
    var a = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Qn(t, n), a & 4 && pi(5, n);
        break;
      case 1:
        if ((Qn(t, n), a & 4))
          if (((t = n.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (o) {
              Lt(n, n.return, o);
            }
          else {
            var i = Ra(n.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(i, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (o) {
              Lt(n, n.return, o);
            }
          }
        a & 64 && nh(n), a & 512 && gi(n, n.return);
        break;
      case 3:
        if ((Qn(t, n), a & 64 && ((t = n.updateQueue), t !== null))) {
          if (((e = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            Vf(t, e);
          } catch (o) {
            Lt(n, n.return, o);
          }
        }
        break;
      case 27:
        e === null && a & 4 && uh(n);
      case 26:
      case 5:
        Qn(t, n), e === null && a & 4 && lh(n), a & 512 && gi(n, n.return);
        break;
      case 12:
        Qn(t, n);
        break;
      case 13:
        Qn(t, n),
          a & 4 && fh(t, n),
          a & 64 &&
            ((t = n.memoizedState),
            t !== null &&
              ((t = t.dehydrated),
              t !== null && ((n = f0.bind(null, n)), D0(t, n))));
        break;
      case 22:
        if (((a = n.memoizedState !== null || En), !a)) {
          (e = (e !== null && e.memoizedState !== null) || Kt), (i = En);
          var r = Kt;
          (En = a),
            (Kt = e) && !r ? Gn(t, n, (n.subtreeFlags & 8772) !== 0) : Qn(t, n),
            (En = i),
            (Kt = r);
        }
        break;
      case 30:
        break;
      default:
        Qn(t, n);
    }
  }
  function ch(t) {
    var e = t.alternate;
    e !== null && ((t.alternate = null), ch(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && ws(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null);
  }
  var jt = null,
    ge = !1;
  function Rn(t, e, n) {
    for (n = n.child; n !== null; ) oh(t, e, n), (n = n.sibling);
  }
  function oh(t, e, n) {
    if (be && typeof be.onCommitFiberUnmount == "function")
      try {
        be.onCommitFiberUnmount(ra, n);
      } catch {}
    switch (n.tag) {
      case 26:
        Kt || en(n, e),
          Rn(t, e, n),
          n.memoizedState
            ? n.memoizedState.count--
            : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n));
        break;
      case 27:
        Kt || en(n, e);
        var a = jt,
          i = ge;
        Jn(n.type) && ((jt = n.stateNode), (ge = !1)),
          Rn(t, e, n),
          Ai(n.stateNode),
          (jt = a),
          (ge = i);
        break;
      case 5:
        Kt || en(n, e);
      case 6:
        if (
          ((a = jt),
          (i = ge),
          (jt = null),
          Rn(t, e, n),
          (jt = a),
          (ge = i),
          jt !== null)
        )
          if (ge)
            try {
              (jt.nodeType === 9
                ? jt.body
                : jt.nodeName === "HTML"
                  ? jt.ownerDocument.body
                  : jt
              ).removeChild(n.stateNode);
            } catch (r) {
              Lt(n, e, r);
            }
          else
            try {
              jt.removeChild(n.stateNode);
            } catch (r) {
              Lt(n, e, r);
            }
        break;
      case 18:
        jt !== null &&
          (ge
            ? ((t = jt),
              Wh(
                t.nodeType === 9
                  ? t.body
                  : t.nodeName === "HTML"
                    ? t.ownerDocument.body
                    : t,
                n.stateNode,
              ),
              Li(t))
            : Wh(jt, n.stateNode));
        break;
      case 4:
        (a = jt),
          (i = ge),
          (jt = n.stateNode.containerInfo),
          (ge = !0),
          Rn(t, e, n),
          (jt = a),
          (ge = i);
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Kt || qn(2, n, e), Kt || qn(4, n, e), Rn(t, e, n);
        break;
      case 1:
        Kt ||
          (en(n, e),
          (a = n.stateNode),
          typeof a.componentWillUnmount == "function" && ah(n, e, a)),
          Rn(t, e, n);
        break;
      case 21:
        Rn(t, e, n);
        break;
      case 22:
        (Kt = (a = Kt) || n.memoizedState !== null), Rn(t, e, n), (Kt = a);
        break;
      default:
        Rn(t, e, n);
    }
  }
  function fh(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate),
      t !== null &&
        ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        Li(t);
      } catch (n) {
        Lt(e, e.return, n);
      }
  }
  function a0(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new sh()), e;
      case 22:
        return (
          (t = t.stateNode),
          (e = t._retryCache),
          e === null && (e = t._retryCache = new sh()),
          e
        );
      default:
        throw Error(c(435, t.tag));
    }
  }
  function ec(t, e) {
    var n = a0(t);
    e.forEach(function (a) {
      var i = d0.bind(null, t, a);
      n.has(a) || (n.add(a), a.then(i, i));
    });
  }
  function Te(t, e) {
    var n = e.deletions;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var i = n[a],
          r = t,
          o = e,
          y = o;
        t: for (; y !== null; ) {
          switch (y.tag) {
            case 27:
              if (Jn(y.type)) {
                (jt = y.stateNode), (ge = !1);
                break t;
              }
              break;
            case 5:
              (jt = y.stateNode), (ge = !1);
              break t;
            case 3:
            case 4:
              (jt = y.stateNode.containerInfo), (ge = !0);
              break t;
          }
          y = y.return;
        }
        if (jt === null) throw Error(c(160));
        oh(r, o, i),
          (jt = null),
          (ge = !1),
          (r = i.alternate),
          r !== null && (r.return = null),
          (i.return = null);
      }
    if (e.subtreeFlags & 13878)
      for (e = e.child; e !== null; ) dh(e, t), (e = e.sibling);
  }
  var ke = null;
  function dh(t, e) {
    var n = t.alternate,
      a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Te(e, t),
          Me(t),
          a & 4 && (qn(3, t, t.return), pi(3, t), qn(5, t, t.return));
        break;
      case 1:
        Te(e, t),
          Me(t),
          a & 512 && (Kt || n === null || en(n, n.return)),
          a & 64 &&
            En &&
            ((t = t.updateQueue),
            t !== null &&
              ((a = t.callbacks),
              a !== null &&
                ((n = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = n === null ? a : n.concat(a)))));
        break;
      case 26:
        var i = ke;
        if (
          (Te(e, t),
          Me(t),
          a & 512 && (Kt || n === null || en(n, n.return)),
          a & 4)
        ) {
          var r = n !== null ? n.memoizedState : null;
          if (((a = t.memoizedState), n === null))
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  (a = t.type),
                    (n = t.memoizedProps),
                    (i = i.ownerDocument || i);
                  e: switch (a) {
                    case "title":
                      (r = i.getElementsByTagName("title")[0]),
                        (!r ||
                          r[Yl] ||
                          r[ue] ||
                          r.namespaceURI === "http://www.w3.org/2000/svg" ||
                          r.hasAttribute("itemprop")) &&
                          ((r = i.createElement(a)),
                          i.head.insertBefore(
                            r,
                            i.querySelector("head > title"),
                          )),
                        ie(r, a, n),
                        (r[ue] = t),
                        It(r),
                        (a = r);
                      break t;
                    case "link":
                      var o = uy("link", "href", i).get(a + (n.href || ""));
                      if (o) {
                        for (var y = 0; y < o.length; y++)
                          if (
                            ((r = o[y]),
                            r.getAttribute("href") ===
                              (n.href == null || n.href === ""
                                ? null
                                : n.href) &&
                              r.getAttribute("rel") ===
                                (n.rel == null ? null : n.rel) &&
                              r.getAttribute("title") ===
                                (n.title == null ? null : n.title) &&
                              r.getAttribute("crossorigin") ===
                                (n.crossOrigin == null ? null : n.crossOrigin))
                          ) {
                            o.splice(y, 1);
                            break e;
                          }
                      }
                      (r = i.createElement(a)),
                        ie(r, a, n),
                        i.head.appendChild(r);
                      break;
                    case "meta":
                      if (
                        (o = uy("meta", "content", i).get(
                          a + (n.content || ""),
                        ))
                      ) {
                        for (y = 0; y < o.length; y++)
                          if (
                            ((r = o[y]),
                            r.getAttribute("content") ===
                              (n.content == null ? null : "" + n.content) &&
                              r.getAttribute("name") ===
                                (n.name == null ? null : n.name) &&
                              r.getAttribute("property") ===
                                (n.property == null ? null : n.property) &&
                              r.getAttribute("http-equiv") ===
                                (n.httpEquiv == null ? null : n.httpEquiv) &&
                              r.getAttribute("charset") ===
                                (n.charSet == null ? null : n.charSet))
                          ) {
                            o.splice(y, 1);
                            break e;
                          }
                      }
                      (r = i.createElement(a)),
                        ie(r, a, n),
                        i.head.appendChild(r);
                      break;
                    default:
                      throw Error(c(468, a));
                  }
                  (r[ue] = t), It(r), (a = r);
                }
                t.stateNode = a;
              } else sy(i, t.type, t.stateNode);
            else t.stateNode = iy(i, a, t.memoizedProps);
          else
            r !== a
              ? (r === null
                  ? n.stateNode !== null &&
                    ((n = n.stateNode), n.parentNode.removeChild(n))
                  : r.count--,
                a === null
                  ? sy(i, t.type, t.stateNode)
                  : iy(i, a, t.memoizedProps))
              : a === null &&
                t.stateNode !== null &&
                $r(t, t.memoizedProps, n.memoizedProps);
        }
        break;
      case 27:
        Te(e, t),
          Me(t),
          a & 512 && (Kt || n === null || en(n, n.return)),
          n !== null && a & 4 && $r(t, t.memoizedProps, n.memoizedProps);
        break;
      case 5:
        if (
          (Te(e, t),
          Me(t),
          a & 512 && (Kt || n === null || en(n, n.return)),
          t.flags & 32)
        ) {
          i = t.stateNode;
          try {
            Xa(i, "");
          } catch (z) {
            Lt(t, t.return, z);
          }
        }
        a & 4 &&
          t.stateNode != null &&
          ((i = t.memoizedProps), $r(t, i, n !== null ? n.memoizedProps : i)),
          a & 1024 && (tc = !0);
        break;
      case 6:
        if ((Te(e, t), Me(t), a & 4)) {
          if (t.stateNode === null) throw Error(c(162));
          (a = t.memoizedProps), (n = t.stateNode);
          try {
            n.nodeValue = a;
          } catch (z) {
            Lt(t, t.return, z);
          }
        }
        break;
      case 3:
        if (
          ((Wu = null),
          (i = ke),
          (ke = Pu(e.containerInfo)),
          Te(e, t),
          (ke = i),
          Me(t),
          a & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            Li(e.containerInfo);
          } catch (z) {
            Lt(t, t.return, z);
          }
        tc && ((tc = !1), hh(t));
        break;
      case 4:
        (a = ke),
          (ke = Pu(t.stateNode.containerInfo)),
          Te(e, t),
          Me(t),
          (ke = a);
        break;
      case 12:
        Te(e, t), Me(t);
        break;
      case 13:
        Te(e, t),
          Me(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) !=
              (n !== null && n.memoizedState !== null) &&
            (sc = Wt()),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), ec(t, a)));
        break;
      case 22:
        i = t.memoizedState !== null;
        var _ = n !== null && n.memoizedState !== null,
          A = En,
          H = Kt;
        if (
          ((En = A || i),
          (Kt = H || _),
          Te(e, t),
          (Kt = H),
          (En = A),
          Me(t),
          a & 8192)
        )
          t: for (
            e = t.stateNode,
              e._visibility = i ? e._visibility & -2 : e._visibility | 1,
              i && (n === null || _ || En || Kt || Ta(t)),
              n = null,
              e = t;
            ;

          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (n === null) {
                _ = n = e;
                try {
                  if (((r = _.stateNode), i))
                    (o = r.style),
                      typeof o.setProperty == "function"
                        ? o.setProperty("display", "none", "important")
                        : (o.display = "none");
                  else {
                    y = _.stateNode;
                    var Q = _.memoizedProps.style,
                      D =
                        Q != null && Q.hasOwnProperty("display")
                          ? Q.display
                          : null;
                    y.style.display =
                      D == null || typeof D == "boolean" ? "" : ("" + D).trim();
                  }
                } catch (z) {
                  Lt(_, _.return, z);
                }
              }
            } else if (e.tag === 6) {
              if (n === null) {
                _ = e;
                try {
                  _.stateNode.nodeValue = i ? "" : _.memoizedProps;
                } catch (z) {
                  Lt(_, _.return, z);
                }
              }
            } else if (
              ((e.tag !== 22 && e.tag !== 23) ||
                e.memoizedState === null ||
                e === t) &&
              e.child !== null
            ) {
              (e.child.return = e), (e = e.child);
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              n === e && (n = null), (e = e.return);
            }
            n === e && (n = null),
              (e.sibling.return = e.return),
              (e = e.sibling);
          }
        a & 4 &&
          ((a = t.updateQueue),
          a !== null &&
            ((n = a.retryQueue),
            n !== null && ((a.retryQueue = null), ec(t, n))));
        break;
      case 19:
        Te(e, t),
          Me(t),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), ec(t, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Te(e, t), Me(t);
    }
  }
  function Me(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, a = t.return; a !== null; ) {
          if (ih(a)) {
            n = a;
            break;
          }
          a = a.return;
        }
        if (n == null) throw Error(c(160));
        switch (n.tag) {
          case 27:
            var i = n.stateNode,
              r = Wr(t);
            ju(t, r, i);
            break;
          case 5:
            var o = n.stateNode;
            n.flags & 32 && (Xa(o, ""), (n.flags &= -33));
            var y = Wr(t);
            ju(t, y, o);
            break;
          case 3:
          case 4:
            var _ = n.stateNode.containerInfo,
              A = Wr(t);
            Ir(t, A, _);
            break;
          default:
            throw Error(c(161));
        }
      } catch (H) {
        Lt(t, t.return, H);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function hh(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        hh(e),
          e.tag === 5 && e.flags & 1024 && e.stateNode.reset(),
          (t = t.sibling);
      }
  }
  function Qn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; ) rh(t, e.alternate, e), (e = e.sibling);
  }
  function Ta(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          qn(4, e, e.return), Ta(e);
          break;
        case 1:
          en(e, e.return);
          var n = e.stateNode;
          typeof n.componentWillUnmount == "function" && ah(e, e.return, n),
            Ta(e);
          break;
        case 27:
          Ai(e.stateNode);
        case 26:
        case 5:
          en(e, e.return), Ta(e);
          break;
        case 22:
          e.memoizedState === null && Ta(e);
          break;
        case 30:
          Ta(e);
          break;
        default:
          Ta(e);
      }
      t = t.sibling;
    }
  }
  function Gn(t, e, n) {
    for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var a = e.alternate,
        i = t,
        r = e,
        o = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          Gn(i, r, n), pi(4, r);
          break;
        case 1:
          if (
            (Gn(i, r, n),
            (a = r),
            (i = a.stateNode),
            typeof i.componentDidMount == "function")
          )
            try {
              i.componentDidMount();
            } catch (A) {
              Lt(a, a.return, A);
            }
          if (((a = r), (i = a.updateQueue), i !== null)) {
            var y = a.stateNode;
            try {
              var _ = i.shared.hiddenCallbacks;
              if (_ !== null)
                for (i.shared.hiddenCallbacks = null, i = 0; i < _.length; i++)
                  Yf(_[i], y);
            } catch (A) {
              Lt(a, a.return, A);
            }
          }
          n && o & 64 && nh(r), gi(r, r.return);
          break;
        case 27:
          uh(r);
        case 26:
        case 5:
          Gn(i, r, n), n && a === null && o & 4 && lh(r), gi(r, r.return);
          break;
        case 12:
          Gn(i, r, n);
          break;
        case 13:
          Gn(i, r, n), n && o & 4 && fh(i, r);
          break;
        case 22:
          r.memoizedState === null && Gn(i, r, n), gi(r, r.return);
          break;
        case 30:
          break;
        default:
          Gn(i, r, n);
      }
      e = e.sibling;
    }
  }
  function nc(t, e) {
    var n = null;
    t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (n = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (t = e.memoizedState.cachePool.pool),
      t !== n && (t != null && t.refCount++, n != null && ai(n));
  }
  function ac(t, e) {
    (t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && ai(t));
  }
  function nn(t, e, n, a) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) yh(t, e, n, a), (e = e.sibling);
  }
  function yh(t, e, n, a) {
    var i = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        nn(t, e, n, a), i & 2048 && pi(9, e);
        break;
      case 1:
        nn(t, e, n, a);
        break;
      case 3:
        nn(t, e, n, a),
          i & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && ai(t)));
        break;
      case 12:
        if (i & 2048) {
          nn(t, e, n, a), (t = e.stateNode);
          try {
            var r = e.memoizedProps,
              o = r.id,
              y = r.onPostCommit;
            typeof y == "function" &&
              y(
                o,
                e.alternate === null ? "mount" : "update",
                t.passiveEffectDuration,
                -0,
              );
          } catch (_) {
            Lt(e, e.return, _);
          }
        } else nn(t, e, n, a);
        break;
      case 13:
        nn(t, e, n, a);
        break;
      case 23:
        break;
      case 22:
        (r = e.stateNode),
          (o = e.alternate),
          e.memoizedState !== null
            ? r._visibility & 2
              ? nn(t, e, n, a)
              : Si(t, e)
            : r._visibility & 2
              ? nn(t, e, n, a)
              : ((r._visibility |= 2),
                cl(t, e, n, a, (e.subtreeFlags & 10256) !== 0)),
          i & 2048 && nc(o, e);
        break;
      case 24:
        nn(t, e, n, a), i & 2048 && ac(e.alternate, e);
        break;
      default:
        nn(t, e, n, a);
    }
  }
  function cl(t, e, n, a, i) {
    for (i = i && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var r = t,
        o = e,
        y = n,
        _ = a,
        A = o.flags;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          cl(r, o, y, _, i), pi(8, o);
          break;
        case 23:
          break;
        case 22:
          var H = o.stateNode;
          o.memoizedState !== null
            ? H._visibility & 2
              ? cl(r, o, y, _, i)
              : Si(r, o)
            : ((H._visibility |= 2), cl(r, o, y, _, i)),
            i && A & 2048 && nc(o.alternate, o);
          break;
        case 24:
          cl(r, o, y, _, i), i && A & 2048 && ac(o.alternate, o);
          break;
        default:
          cl(r, o, y, _, i);
      }
      e = e.sibling;
    }
  }
  function Si(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t,
          a = e,
          i = a.flags;
        switch (a.tag) {
          case 22:
            Si(n, a), i & 2048 && nc(a.alternate, a);
            break;
          case 24:
            Si(n, a), i & 2048 && ac(a.alternate, a);
            break;
          default:
            Si(n, a);
        }
        e = e.sibling;
      }
  }
  var bi = 8192;
  function ol(t) {
    if (t.subtreeFlags & bi)
      for (t = t.child; t !== null; ) vh(t), (t = t.sibling);
  }
  function vh(t) {
    switch (t.tag) {
      case 26:
        ol(t),
          t.flags & bi &&
            t.memoizedState !== null &&
            Y0(ke, t.memoizedState, t.memoizedProps);
        break;
      case 5:
        ol(t);
        break;
      case 3:
      case 4:
        var e = ke;
        (ke = Pu(t.stateNode.containerInfo)), ol(t), (ke = e);
        break;
      case 22:
        t.memoizedState === null &&
          ((e = t.alternate),
          e !== null && e.memoizedState !== null
            ? ((e = bi), (bi = 16777216), ol(t), (bi = e))
            : ol(t));
        break;
      default:
        ol(t);
    }
  }
  function mh(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do (e = t.sibling), (t.sibling = null), (t = e);
      while (t !== null);
    }
  }
  function _i(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var a = e[n];
          (ee = a), gh(a, t);
        }
      mh(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) ph(t), (t = t.sibling);
  }
  function ph(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        _i(t), t.flags & 2048 && qn(9, t, t.return);
        break;
      case 3:
        _i(t);
        break;
      case 12:
        _i(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null &&
        e._visibility & 2 &&
        (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), Bu(t))
          : _i(t);
        break;
      default:
        _i(t);
    }
  }
  function Bu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var a = e[n];
          (ee = a), gh(a, t);
        }
      mh(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          qn(8, e, e.return), Bu(e);
          break;
        case 22:
          (n = e.stateNode),
            n._visibility & 2 && ((n._visibility &= -3), Bu(e));
          break;
        default:
          Bu(e);
      }
      t = t.sibling;
    }
  }
  function gh(t, e) {
    for (; ee !== null; ) {
      var n = ee;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          qn(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var a = n.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          ai(n.memoizedState.cache);
      }
      if (((a = n.child), a !== null)) (a.return = n), (ee = a);
      else
        t: for (n = t; ee !== null; ) {
          a = ee;
          var i = a.sibling,
            r = a.return;
          if ((ch(a), a === n)) {
            ee = null;
            break t;
          }
          if (i !== null) {
            (i.return = r), (ee = i);
            break t;
          }
          ee = r;
        }
    }
  }
  var l0 = {
      getCacheForType: function (t) {
        var e = se(Pt),
          n = e.data.get(t);
        return n === void 0 && ((n = t()), e.data.set(t, n)), n;
      },
    },
    i0 = typeof WeakMap == "function" ? WeakMap : Map,
    Dt = 0,
    Ht = null,
    Et = null,
    Tt = 0,
    Ct = 0,
    Oe = null,
    Yn = !1,
    fl = !1,
    lc = !1,
    Tn = 0,
    Yt = 0,
    Vn = 0,
    Ma = 0,
    ic = 0,
    qe = 0,
    dl = 0,
    Ei = null,
    Se = null,
    uc = !1,
    sc = 0,
    qu = 1 / 0,
    Qu = null,
    Xn = null,
    le = 0,
    Kn = null,
    hl = null,
    yl = 0,
    rc = 0,
    cc = null,
    Sh = null,
    Ri = 0,
    oc = null;
  function Ae() {
    if ((Dt & 2) !== 0 && Tt !== 0) return Tt & -Tt;
    if (C.T !== null) {
      var t = el;
      return t !== 0 ? t : pc();
    }
    return No();
  }
  function bh() {
    qe === 0 && (qe = (Tt & 536870912) === 0 || At ? Co() : 536870912);
    var t = Be.current;
    return t !== null && (t.flags |= 32), qe;
  }
  function xe(t, e, n) {
    ((t === Ht && (Ct === 2 || Ct === 9)) || t.cancelPendingCommit !== null) &&
      (vl(t, 0), Zn(t, Tt, qe, !1)),
      Gl(t, n),
      ((Dt & 2) === 0 || t !== Ht) &&
        (t === Ht &&
          ((Dt & 2) === 0 && (Ma |= n), Yt === 4 && Zn(t, Tt, qe, !1)),
        an(t));
  }
  function _h(t, e, n) {
    if ((Dt & 6) !== 0) throw Error(c(327));
    var a = (!n && (e & 124) === 0 && (e & t.expiredLanes) === 0) || Ql(t, e),
      i = a ? r0(t, e) : hc(t, e, !0),
      r = a;
    do {
      if (i === 0) {
        fl && !a && Zn(t, e, 0, !1);
        break;
      } else {
        if (((n = t.current.alternate), r && !u0(n))) {
          (i = hc(t, e, !1)), (r = !1);
          continue;
        }
        if (i === 2) {
          if (((r = e), t.errorRecoveryDisabledLanes & r)) var o = 0;
          else
            (o = t.pendingLanes & -536870913),
              (o = o !== 0 ? o : o & 536870912 ? 536870912 : 0);
          if (o !== 0) {
            e = o;
            t: {
              var y = t;
              i = Ei;
              var _ = y.current.memoizedState.isDehydrated;
              if ((_ && (vl(y, o).flags |= 256), (o = hc(y, o, !1)), o !== 2)) {
                if (lc && !_) {
                  (y.errorRecoveryDisabledLanes |= r), (Ma |= r), (i = 4);
                  break t;
                }
                (r = Se),
                  (Se = i),
                  r !== null && (Se === null ? (Se = r) : Se.push.apply(Se, r));
              }
              i = o;
            }
            if (((r = !1), i !== 2)) continue;
          }
        }
        if (i === 1) {
          vl(t, 0), Zn(t, e, 0, !0);
          break;
        }
        t: {
          switch (((a = t), (r = i), r)) {
            case 0:
            case 1:
              throw Error(c(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              Zn(a, e, qe, !Yn);
              break t;
            case 2:
              Se = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(c(329));
          }
          if ((e & 62914560) === e && ((i = sc + 300 - Wt()), 10 < i)) {
            if ((Zn(a, e, qe, !Yn), $i(a, 0, !0) !== 0)) break t;
            a.timeoutHandle = Ph(
              Eh.bind(null, a, n, Se, Qu, uc, e, qe, Ma, dl, Yn, r, 2, -0, 0),
              i,
            );
            break t;
          }
          Eh(a, n, Se, Qu, uc, e, qe, Ma, dl, Yn, r, 0, -0, 0);
        }
      }
      break;
    } while (!0);
    an(t);
  }
  function Eh(t, e, n, a, i, r, o, y, _, A, H, Q, D, z) {
    if (
      ((t.timeoutHandle = -1),
      (Q = e.subtreeFlags),
      (Q & 8192 || (Q & 16785408) === 16785408) &&
        ((Ci = { stylesheets: null, count: 0, unsuspend: G0 }),
        vh(e),
        (Q = V0()),
        Q !== null))
    ) {
      (t.cancelPendingCommit = Q(
        Dh.bind(null, t, e, r, n, a, i, o, y, _, H, 1, D, z),
      )),
        Zn(t, r, o, !A);
      return;
    }
    Dh(t, e, r, n, a, i, o, y, _);
  }
  function u0(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if (
        (n === 0 || n === 11 || n === 15) &&
        e.flags & 16384 &&
        ((n = e.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var a = 0; a < n.length; a++) {
          var i = n[a],
            r = i.getSnapshot;
          i = i.value;
          try {
            if (!Ee(r(), i)) return !1;
          } catch {
            return !1;
          }
        }
      if (((n = e.child), e.subtreeFlags & 16384 && n !== null))
        (n.return = e), (e = n);
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    }
    return !0;
  }
  function Zn(t, e, n, a) {
    (e &= ~ic),
      (e &= ~Ma),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      a && (t.warmLanes |= e),
      (a = t.expirationTimes);
    for (var i = e; 0 < i; ) {
      var r = 31 - _e(i),
        o = 1 << r;
      (a[r] = -1), (i &= ~o);
    }
    n !== 0 && Uo(t, n, e);
  }
  function Gu() {
    return (Dt & 6) === 0 ? (Ti(0), !1) : !0;
  }
  function fc() {
    if (Et !== null) {
      if (Ct === 0) var t = Et.return;
      else (t = Et), (mn = Sa = null), xr(t), (sl = null), (yi = 0), (t = Et);
      for (; t !== null; ) eh(t.alternate, t), (t = t.return);
      Et = null;
    }
  }
  function vl(t, e) {
    var n = t.timeoutHandle;
    n !== -1 && ((t.timeoutHandle = -1), T0(n)),
      (n = t.cancelPendingCommit),
      n !== null && ((t.cancelPendingCommit = null), n()),
      fc(),
      (Ht = t),
      (Et = n = hn(t.current, null)),
      (Tt = e),
      (Ct = 0),
      (Oe = null),
      (Yn = !1),
      (fl = Ql(t, e)),
      (lc = !1),
      (dl = qe = ic = Ma = Vn = Yt = 0),
      (Se = Ei = null),
      (uc = !1),
      (e & 8) !== 0 && (e |= e & 32);
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= e; 0 < a; ) {
        var i = 31 - _e(a),
          r = 1 << i;
        (e |= t[i]), (a &= ~r);
      }
    return (Tn = e), cu(), n;
  }
  function Rh(t, e) {
    (mt = null),
      (C.H = xu),
      e === ii || e === gu
        ? ((e = Qf()), (Ct = 3))
        : e === jf
          ? ((e = Qf()), (Ct = 4))
          : (Ct =
              e === Gd
                ? 8
                : e !== null &&
                    typeof e == "object" &&
                    typeof e.then == "function"
                  ? 6
                  : 1),
      (Oe = e),
      Et === null && ((Yt = 1), wu(t, Ne(e, t.current)));
  }
  function Th() {
    var t = C.H;
    return (C.H = xu), t === null ? xu : t;
  }
  function Mh() {
    var t = C.A;
    return (C.A = l0), t;
  }
  function dc() {
    (Yt = 4),
      Yn || ((Tt & 4194048) !== Tt && Be.current !== null) || (fl = !0),
      ((Vn & 134217727) === 0 && (Ma & 134217727) === 0) ||
        Ht === null ||
        Zn(Ht, Tt, qe, !1);
  }
  function hc(t, e, n) {
    var a = Dt;
    Dt |= 2;
    var i = Th(),
      r = Mh();
    (Ht !== t || Tt !== e) && ((Qu = null), vl(t, e)), (e = !1);
    var o = Yt;
    t: do
      try {
        if (Ct !== 0 && Et !== null) {
          var y = Et,
            _ = Oe;
          switch (Ct) {
            case 8:
              fc(), (o = 6);
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Be.current === null && (e = !0);
              var A = Ct;
              if (((Ct = 0), (Oe = null), ml(t, y, _, A), n && fl)) {
                o = 0;
                break t;
              }
              break;
            default:
              (A = Ct), (Ct = 0), (Oe = null), ml(t, y, _, A);
          }
        }
        s0(), (o = Yt);
        break;
      } catch (H) {
        Rh(t, H);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (mn = Sa = null),
      (Dt = a),
      (C.H = i),
      (C.A = r),
      Et === null && ((Ht = null), (Tt = 0), cu()),
      o
    );
  }
  function s0() {
    for (; Et !== null; ) Oh(Et);
  }
  function r0(t, e) {
    var n = Dt;
    Dt |= 2;
    var a = Th(),
      i = Mh();
    Ht !== t || Tt !== e
      ? ((Qu = null), (qu = Wt() + 500), vl(t, e))
      : (fl = Ql(t, e));
    t: do
      try {
        if (Ct !== 0 && Et !== null) {
          e = Et;
          var r = Oe;
          e: switch (Ct) {
            case 1:
              (Ct = 0), (Oe = null), ml(t, e, r, 1);
              break;
            case 2:
            case 9:
              if (Bf(r)) {
                (Ct = 0), (Oe = null), Ah(e);
                break;
              }
              (e = function () {
                (Ct !== 2 && Ct !== 9) || Ht !== t || (Ct = 7), an(t);
              }),
                r.then(e, e);
              break t;
            case 3:
              Ct = 7;
              break t;
            case 4:
              Ct = 5;
              break t;
            case 7:
              Bf(r)
                ? ((Ct = 0), (Oe = null), Ah(e))
                : ((Ct = 0), (Oe = null), ml(t, e, r, 7));
              break;
            case 5:
              var o = null;
              switch (Et.tag) {
                case 26:
                  o = Et.memoizedState;
                case 5:
                case 27:
                  var y = Et;
                  if (!o || ry(o)) {
                    (Ct = 0), (Oe = null);
                    var _ = y.sibling;
                    if (_ !== null) Et = _;
                    else {
                      var A = y.return;
                      A !== null ? ((Et = A), Yu(A)) : (Et = null);
                    }
                    break e;
                  }
              }
              (Ct = 0), (Oe = null), ml(t, e, r, 5);
              break;
            case 6:
              (Ct = 0), (Oe = null), ml(t, e, r, 6);
              break;
            case 8:
              fc(), (Yt = 6);
              break t;
            default:
              throw Error(c(462));
          }
        }
        c0();
        break;
      } catch (H) {
        Rh(t, H);
      }
    while (!0);
    return (
      (mn = Sa = null),
      (C.H = a),
      (C.A = i),
      (Dt = n),
      Et !== null ? 0 : ((Ht = null), (Tt = 0), cu(), Yt)
    );
  }
  function c0() {
    for (; Et !== null && !xn(); ) Oh(Et);
  }
  function Oh(t) {
    var e = Id(t.alternate, t, Tn);
    (t.memoizedProps = t.pendingProps), e === null ? Yu(t) : (Et = e);
  }
  function Ah(t) {
    var e = t,
      n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Jd(n, e, e.pendingProps, e.type, void 0, Tt);
        break;
      case 11:
        e = Jd(n, e, e.pendingProps, e.type.render, e.ref, Tt);
        break;
      case 5:
        xr(e);
      default:
        eh(n, e), (e = Et = xf(e, Tn)), (e = Id(n, e, Tn));
    }
    (t.memoizedProps = t.pendingProps), e === null ? Yu(t) : (Et = e);
  }
  function ml(t, e, n, a) {
    (mn = Sa = null), xr(e), (sl = null), (yi = 0);
    var i = e.return;
    try {
      if (Wm(t, i, e, n, Tt)) {
        (Yt = 1), wu(t, Ne(n, t.current)), (Et = null);
        return;
      }
    } catch (r) {
      if (i !== null) throw ((Et = i), r);
      (Yt = 1), wu(t, Ne(n, t.current)), (Et = null);
      return;
    }
    e.flags & 32768
      ? (At || a === 1
          ? (t = !0)
          : fl || (Tt & 536870912) !== 0
            ? (t = !1)
            : ((Yn = t = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = Be.current),
                a !== null && a.tag === 13 && (a.flags |= 16384))),
        xh(e, t))
      : Yu(e);
  }
  function Yu(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        xh(e, Yn);
        return;
      }
      t = e.return;
      var n = t0(e.alternate, e, Tn);
      if (n !== null) {
        Et = n;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        Et = e;
        return;
      }
      Et = e = t;
    } while (e !== null);
    Yt === 0 && (Yt = 5);
  }
  function xh(t, e) {
    do {
      var n = e0(t.alternate, t);
      if (n !== null) {
        (n.flags &= 32767), (Et = n);
        return;
      }
      if (
        ((n = t.return),
        n !== null &&
          ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        Et = t;
        return;
      }
      Et = t = n;
    } while (t !== null);
    (Yt = 6), (Et = null);
  }
  function Dh(t, e, n, a, i, r, o, y, _) {
    t.cancelPendingCommit = null;
    do Vu();
    while (le !== 0);
    if ((Dt & 6) !== 0) throw Error(c(327));
    if (e !== null) {
      if (e === t.current) throw Error(c(177));
      if (
        ((r = e.lanes | e.childLanes),
        (r |= ar),
        Gv(t, n, r, o, y, _),
        t === Ht && ((Et = Ht = null), (Tt = 0)),
        (hl = e),
        (Kn = t),
        (yl = n),
        (rc = r),
        (cc = i),
        (Sh = a),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            h0(xt, function () {
              return Nh(), null;
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (a = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || a)
      ) {
        (a = C.T), (C.T = null), (i = X.p), (X.p = 2), (o = Dt), (Dt |= 4);
        try {
          n0(t, e, n);
        } finally {
          (Dt = o), (X.p = i), (C.T = a);
        }
      }
      (le = 1), Ch(), zh(), Uh();
    }
  }
  function Ch() {
    if (le === 1) {
      le = 0;
      var t = Kn,
        e = hl,
        n = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || n) {
        (n = C.T), (C.T = null);
        var a = X.p;
        X.p = 2;
        var i = Dt;
        Dt |= 4;
        try {
          dh(e, t);
          var r = Mc,
            o = gf(t.containerInfo),
            y = r.focusedElem,
            _ = r.selectionRange;
          if (
            o !== y &&
            y &&
            y.ownerDocument &&
            pf(y.ownerDocument.documentElement, y)
          ) {
            if (_ !== null && Ws(y)) {
              var A = _.start,
                H = _.end;
              if ((H === void 0 && (H = A), "selectionStart" in y))
                (y.selectionStart = A),
                  (y.selectionEnd = Math.min(H, y.value.length));
              else {
                var Q = y.ownerDocument || document,
                  D = (Q && Q.defaultView) || window;
                if (D.getSelection) {
                  var z = D.getSelection(),
                    ft = y.textContent.length,
                    ct = Math.min(_.start, ft),
                    wt = _.end === void 0 ? ct : Math.min(_.end, ft);
                  !z.extend && ct > wt && ((o = wt), (wt = ct), (ct = o));
                  var T = mf(y, ct),
                    R = mf(y, wt);
                  if (
                    T &&
                    R &&
                    (z.rangeCount !== 1 ||
                      z.anchorNode !== T.node ||
                      z.anchorOffset !== T.offset ||
                      z.focusNode !== R.node ||
                      z.focusOffset !== R.offset)
                  ) {
                    var O = Q.createRange();
                    O.setStart(T.node, T.offset),
                      z.removeAllRanges(),
                      ct > wt
                        ? (z.addRange(O), z.extend(R.node, R.offset))
                        : (O.setEnd(R.node, R.offset), z.addRange(O));
                  }
                }
              }
            }
            for (Q = [], z = y; (z = z.parentNode); )
              z.nodeType === 1 &&
                Q.push({ element: z, left: z.scrollLeft, top: z.scrollTop });
            for (
              typeof y.focus == "function" && y.focus(), y = 0;
              y < Q.length;
              y++
            ) {
              var j = Q[y];
              (j.element.scrollLeft = j.left), (j.element.scrollTop = j.top);
            }
          }
          (es = !!Tc), (Mc = Tc = null);
        } finally {
          (Dt = i), (X.p = a), (C.T = n);
        }
      }
      (t.current = e), (le = 2);
    }
  }
  function zh() {
    if (le === 2) {
      le = 0;
      var t = Kn,
        e = hl,
        n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        (n = C.T), (C.T = null);
        var a = X.p;
        X.p = 2;
        var i = Dt;
        Dt |= 4;
        try {
          rh(t, e.alternate, e);
        } finally {
          (Dt = i), (X.p = a), (C.T = n);
        }
      }
      le = 3;
    }
  }
  function Uh() {
    if (le === 4 || le === 3) {
      (le = 0), ze();
      var t = Kn,
        e = hl,
        n = yl,
        a = Sh;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (le = 5)
        : ((le = 0), (hl = Kn = null), wh(t, t.pendingLanes));
      var i = t.pendingLanes;
      if (
        (i === 0 && (Xn = null),
        zs(n),
        (e = e.stateNode),
        be && typeof be.onCommitFiberRoot == "function")
      )
        try {
          be.onCommitFiberRoot(ra, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        (e = C.T), (i = X.p), (X.p = 2), (C.T = null);
        try {
          for (var r = t.onRecoverableError, o = 0; o < a.length; o++) {
            var y = a[o];
            r(y.value, { componentStack: y.stack });
          }
        } finally {
          (C.T = e), (X.p = i);
        }
      }
      (yl & 3) !== 0 && Vu(),
        an(t),
        (i = t.pendingLanes),
        (n & 4194090) !== 0 && (i & 42) !== 0
          ? t === oc
            ? Ri++
            : ((Ri = 0), (oc = t))
          : (Ri = 0),
        Ti(0);
    }
  }
  function wh(t, e) {
    (t.pooledCacheLanes &= e) === 0 &&
      ((e = t.pooledCache), e != null && ((t.pooledCache = null), ai(e)));
  }
  function Vu(t) {
    return Ch(), zh(), Uh(), Nh();
  }
  function Nh() {
    if (le !== 5) return !1;
    var t = Kn,
      e = rc;
    rc = 0;
    var n = zs(yl),
      a = C.T,
      i = X.p;
    try {
      (X.p = 32 > n ? 32 : n), (C.T = null), (n = cc), (cc = null);
      var r = Kn,
        o = yl;
      if (((le = 0), (hl = Kn = null), (yl = 0), (Dt & 6) !== 0))
        throw Error(c(331));
      var y = Dt;
      if (
        ((Dt |= 4),
        ph(r.current),
        yh(r, r.current, o, n),
        (Dt = y),
        Ti(0, !1),
        be && typeof be.onPostCommitFiberRoot == "function")
      )
        try {
          be.onPostCommitFiberRoot(ra, r);
        } catch {}
      return !0;
    } finally {
      (X.p = i), (C.T = a), wh(t, e);
    }
  }
  function Lh(t, e, n) {
    (e = Ne(n, e)),
      (e = Yr(t.stateNode, e, 2)),
      (t = Ln(t, e, 2)),
      t !== null && (Gl(t, 2), an(t));
  }
  function Lt(t, e, n) {
    if (t.tag === 3) Lh(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Lh(e, t, n);
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == "function" ||
            (typeof a.componentDidCatch == "function" &&
              (Xn === null || !Xn.has(a)))
          ) {
            (t = Ne(n, t)),
              (n = qd(2)),
              (a = Ln(e, n, 2)),
              a !== null && (Qd(n, a, e, t), Gl(a, 2), an(a));
            break;
          }
        }
        e = e.return;
      }
  }
  function yc(t, e, n) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new i0();
      var i = new Set();
      a.set(e, i);
    } else (i = a.get(e)), i === void 0 && ((i = new Set()), a.set(e, i));
    i.has(n) ||
      ((lc = !0), i.add(n), (t = o0.bind(null, t, e, n)), e.then(t, t));
  }
  function o0(t, e, n) {
    var a = t.pingCache;
    a !== null && a.delete(e),
      (t.pingedLanes |= t.suspendedLanes & n),
      (t.warmLanes &= ~n),
      Ht === t &&
        (Tt & n) === n &&
        (Yt === 4 || (Yt === 3 && (Tt & 62914560) === Tt && 300 > Wt() - sc)
          ? (Dt & 2) === 0 && vl(t, 0)
          : (ic |= n),
        dl === Tt && (dl = 0)),
      an(t);
  }
  function Hh(t, e) {
    e === 0 && (e = zo()), (t = $a(t, e)), t !== null && (Gl(t, e), an(t));
  }
  function f0(t) {
    var e = t.memoizedState,
      n = 0;
    e !== null && (n = e.retryLane), Hh(t, n);
  }
  function d0(t, e) {
    var n = 0;
    switch (t.tag) {
      case 13:
        var a = t.stateNode,
          i = t.memoizedState;
        i !== null && (n = i.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(c(314));
    }
    a !== null && a.delete(e), Hh(t, n);
  }
  function h0(t, e) {
    return ye(t, e);
  }
  var Xu = null,
    pl = null,
    vc = !1,
    Ku = !1,
    mc = !1,
    Oa = 0;
  function an(t) {
    t !== pl &&
      t.next === null &&
      (pl === null ? (Xu = pl = t) : (pl = pl.next = t)),
      (Ku = !0),
      vc || ((vc = !0), v0());
  }
  function Ti(t, e) {
    if (!mc && Ku) {
      mc = !0;
      do
        for (var n = !1, a = Xu; a !== null; ) {
          if (t !== 0) {
            var i = a.pendingLanes;
            if (i === 0) var r = 0;
            else {
              var o = a.suspendedLanes,
                y = a.pingedLanes;
              (r = (1 << (31 - _e(42 | t) + 1)) - 1),
                (r &= i & ~(o & ~y)),
                (r = r & 201326741 ? (r & 201326741) | 1 : r ? r | 2 : 0);
            }
            r !== 0 && ((n = !0), Qh(a, r));
          } else
            (r = Tt),
              (r = $i(
                a,
                a === Ht ? r : 0,
                a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
              )),
              (r & 3) === 0 || Ql(a, r) || ((n = !0), Qh(a, r));
          a = a.next;
        }
      while (n);
      mc = !1;
    }
  }
  function y0() {
    jh();
  }
  function jh() {
    Ku = vc = !1;
    var t = 0;
    Oa !== 0 && (R0() && (t = Oa), (Oa = 0));
    for (var e = Wt(), n = null, a = Xu; a !== null; ) {
      var i = a.next,
        r = Bh(a, e);
      r === 0
        ? ((a.next = null),
          n === null ? (Xu = i) : (n.next = i),
          i === null && (pl = n))
        : ((n = a), (t !== 0 || (r & 3) !== 0) && (Ku = !0)),
        (a = i);
    }
    Ti(t);
  }
  function Bh(t, e) {
    for (
      var n = t.suspendedLanes,
        a = t.pingedLanes,
        i = t.expirationTimes,
        r = t.pendingLanes & -62914561;
      0 < r;

    ) {
      var o = 31 - _e(r),
        y = 1 << o,
        _ = i[o];
      _ === -1
        ? ((y & n) === 0 || (y & a) !== 0) && (i[o] = Qv(y, e))
        : _ <= e && (t.expiredLanes |= y),
        (r &= ~y);
    }
    if (
      ((e = Ht),
      (n = Tt),
      (n = $i(
        t,
        t === e ? n : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
      )),
      (a = t.callbackNode),
      n === 0 ||
        (t === e && (Ct === 2 || Ct === 9)) ||
        t.cancelPendingCommit !== null)
    )
      return (
        a !== null && a !== null && Ze(a),
        (t.callbackNode = null),
        (t.callbackPriority = 0)
      );
    if ((n & 3) === 0 || Ql(t, n)) {
      if (((e = n & -n), e === t.callbackPriority)) return e;
      switch ((a !== null && Ze(a), zs(n))) {
        case 2:
        case 8:
          n = ql;
          break;
        case 32:
          n = xt;
          break;
        case 268435456:
          n = Ha;
          break;
        default:
          n = xt;
      }
      return (
        (a = qh.bind(null, t)),
        (n = ye(n, a)),
        (t.callbackPriority = e),
        (t.callbackNode = n),
        e
      );
    }
    return (
      a !== null && a !== null && Ze(a),
      (t.callbackPriority = 2),
      (t.callbackNode = null),
      2
    );
  }
  function qh(t, e) {
    if (le !== 0 && le !== 5)
      return (t.callbackNode = null), (t.callbackPriority = 0), null;
    var n = t.callbackNode;
    if (Vu() && t.callbackNode !== n) return null;
    var a = Tt;
    return (
      (a = $i(
        t,
        t === Ht ? a : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
      )),
      a === 0
        ? null
        : (_h(t, a, e),
          Bh(t, Wt()),
          t.callbackNode != null && t.callbackNode === n
            ? qh.bind(null, t)
            : null)
    );
  }
  function Qh(t, e) {
    if (Vu()) return null;
    _h(t, e, !0);
  }
  function v0() {
    M0(function () {
      (Dt & 6) !== 0 ? ye(Bl, y0) : jh();
    });
  }
  function pc() {
    return Oa === 0 && (Oa = Co()), Oa;
  }
  function Gh(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean"
      ? null
      : typeof t == "function"
        ? t
        : nu("" + t);
  }
  function Yh(t, e) {
    var n = e.ownerDocument.createElement("input");
    return (
      (n.name = e.name),
      (n.value = e.value),
      t.id && n.setAttribute("form", t.id),
      e.parentNode.insertBefore(n, e),
      (t = new FormData(t)),
      n.parentNode.removeChild(n),
      t
    );
  }
  function m0(t, e, n, a, i) {
    if (e === "submit" && n && n.stateNode === i) {
      var r = Gh((i[ve] || null).action),
        o = a.submitter;
      o &&
        ((e = (e = o[ve] || null)
          ? Gh(e.formAction)
          : o.getAttribute("formAction")),
        e !== null && ((r = e), (o = null)));
      var y = new uu("action", "action", null, a, i);
      t.push({
        event: y,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (Oa !== 0) {
                  var _ = o ? Yh(i, o) : new FormData(i);
                  jr(
                    n,
                    { pending: !0, data: _, method: i.method, action: r },
                    null,
                    _,
                  );
                }
              } else
                typeof r == "function" &&
                  (y.preventDefault(),
                  (_ = o ? Yh(i, o) : new FormData(i)),
                  jr(
                    n,
                    { pending: !0, data: _, method: i.method, action: r },
                    r,
                    _,
                  ));
            },
            currentTarget: i,
          },
        ],
      });
    }
  }
  for (var gc = 0; gc < nr.length; gc++) {
    var Sc = nr[gc],
      p0 = Sc.toLowerCase(),
      g0 = Sc[0].toUpperCase() + Sc.slice(1);
    Je(p0, "on" + g0);
  }
  Je(_f, "onAnimationEnd"),
    Je(Ef, "onAnimationIteration"),
    Je(Rf, "onAnimationStart"),
    Je("dblclick", "onDoubleClick"),
    Je("focusin", "onFocus"),
    Je("focusout", "onBlur"),
    Je(Lm, "onTransitionRun"),
    Je(Hm, "onTransitionStart"),
    Je(jm, "onTransitionCancel"),
    Je(Tf, "onTransitionEnd"),
    Ga("onMouseEnter", ["mouseout", "mouseover"]),
    Ga("onMouseLeave", ["mouseout", "mouseover"]),
    Ga("onPointerEnter", ["pointerout", "pointerover"]),
    Ga("onPointerLeave", ["pointerout", "pointerover"]),
    oa(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    oa(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    oa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    oa(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    oa(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    oa(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    );
  var Mi =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    S0 = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(Mi),
    );
  function Vh(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var a = t[n],
        i = a.event;
      a = a.listeners;
      t: {
        var r = void 0;
        if (e)
          for (var o = a.length - 1; 0 <= o; o--) {
            var y = a[o],
              _ = y.instance,
              A = y.currentTarget;
            if (((y = y.listener), _ !== r && i.isPropagationStopped()))
              break t;
            (r = y), (i.currentTarget = A);
            try {
              r(i);
            } catch (H) {
              Uu(H);
            }
            (i.currentTarget = null), (r = _);
          }
        else
          for (o = 0; o < a.length; o++) {
            if (
              ((y = a[o]),
              (_ = y.instance),
              (A = y.currentTarget),
              (y = y.listener),
              _ !== r && i.isPropagationStopped())
            )
              break t;
            (r = y), (i.currentTarget = A);
            try {
              r(i);
            } catch (H) {
              Uu(H);
            }
            (i.currentTarget = null), (r = _);
          }
      }
    }
  }
  function Rt(t, e) {
    var n = e[Us];
    n === void 0 && (n = e[Us] = new Set());
    var a = t + "__bubble";
    n.has(a) || (Xh(e, t, 2, !1), n.add(a));
  }
  function bc(t, e, n) {
    var a = 0;
    e && (a |= 4), Xh(n, t, a, e);
  }
  var Zu = "_reactListening" + Math.random().toString(36).slice(2);
  function _c(t) {
    if (!t[Zu]) {
      (t[Zu] = !0),
        Ho.forEach(function (n) {
          n !== "selectionchange" && (S0.has(n) || bc(n, !1, t), bc(n, !0, t));
        });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Zu] || ((e[Zu] = !0), bc("selectionchange", !1, e));
    }
  }
  function Xh(t, e, n, a) {
    switch (yy(e)) {
      case 2:
        var i = Z0;
        break;
      case 8:
        i = J0;
        break;
      default:
        i = Lc;
    }
    (n = i.bind(null, e, n, t)),
      (i = void 0),
      !Vs ||
        (e !== "touchstart" && e !== "touchmove" && e !== "wheel") ||
        (i = !0),
      a
        ? i !== void 0
          ? t.addEventListener(e, n, { capture: !0, passive: i })
          : t.addEventListener(e, n, !0)
        : i !== void 0
          ? t.addEventListener(e, n, { passive: i })
          : t.addEventListener(e, n, !1);
  }
  function Ec(t, e, n, a, i) {
    var r = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (;;) {
        if (a === null) return;
        var o = a.tag;
        if (o === 3 || o === 4) {
          var y = a.stateNode.containerInfo;
          if (y === i) break;
          if (o === 4)
            for (o = a.return; o !== null; ) {
              var _ = o.tag;
              if ((_ === 3 || _ === 4) && o.stateNode.containerInfo === i)
                return;
              o = o.return;
            }
          for (; y !== null; ) {
            if (((o = Ba(y)), o === null)) return;
            if (((_ = o.tag), _ === 5 || _ === 6 || _ === 26 || _ === 27)) {
              a = r = o;
              continue t;
            }
            y = y.parentNode;
          }
        }
        a = a.return;
      }
    Po(function () {
      var A = r,
        H = Gs(n),
        Q = [];
      t: {
        var D = Mf.get(t);
        if (D !== void 0) {
          var z = uu,
            ft = t;
          switch (t) {
            case "keypress":
              if (lu(n) === 0) break t;
            case "keydown":
            case "keyup":
              z = hm;
              break;
            case "focusin":
              (ft = "focus"), (z = Js);
              break;
            case "focusout":
              (ft = "blur"), (z = Js);
              break;
            case "beforeblur":
            case "afterblur":
              z = Js;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              z = Io;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              z = em;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              z = mm;
              break;
            case _f:
            case Ef:
            case Rf:
              z = lm;
              break;
            case Tf:
              z = gm;
              break;
            case "scroll":
            case "scrollend":
              z = Iv;
              break;
            case "wheel":
              z = bm;
              break;
            case "copy":
            case "cut":
            case "paste":
              z = um;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              z = ef;
              break;
            case "toggle":
            case "beforetoggle":
              z = Em;
          }
          var ct = (e & 4) !== 0,
            wt = !ct && (t === "scroll" || t === "scrollend"),
            T = ct ? (D !== null ? D + "Capture" : null) : D;
          ct = [];
          for (var R = A, O; R !== null; ) {
            var j = R;
            if (
              ((O = j.stateNode),
              (j = j.tag),
              (j !== 5 && j !== 26 && j !== 27) ||
                O === null ||
                T === null ||
                ((j = Xl(R, T)), j != null && ct.push(Oi(R, j, O))),
              wt)
            )
              break;
            R = R.return;
          }
          0 < ct.length &&
            ((D = new z(D, ft, null, n, H)),
            Q.push({ event: D, listeners: ct }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((D = t === "mouseover" || t === "pointerover"),
            (z = t === "mouseout" || t === "pointerout"),
            D &&
              n !== Qs &&
              (ft = n.relatedTarget || n.fromElement) &&
              (Ba(ft) || ft[ja]))
          )
            break t;
          if (
            (z || D) &&
            ((D =
              H.window === H
                ? H
                : (D = H.ownerDocument)
                  ? D.defaultView || D.parentWindow
                  : window),
            z
              ? ((ft = n.relatedTarget || n.toElement),
                (z = A),
                (ft = ft ? Ba(ft) : null),
                ft !== null &&
                  ((wt = h(ft)),
                  (ct = ft.tag),
                  ft !== wt || (ct !== 5 && ct !== 27 && ct !== 6)) &&
                  (ft = null))
              : ((z = null), (ft = A)),
            z !== ft)
          ) {
            if (
              ((ct = Io),
              (j = "onMouseLeave"),
              (T = "onMouseEnter"),
              (R = "mouse"),
              (t === "pointerout" || t === "pointerover") &&
                ((ct = ef),
                (j = "onPointerLeave"),
                (T = "onPointerEnter"),
                (R = "pointer")),
              (wt = z == null ? D : Vl(z)),
              (O = ft == null ? D : Vl(ft)),
              (D = new ct(j, R + "leave", z, n, H)),
              (D.target = wt),
              (D.relatedTarget = O),
              (j = null),
              Ba(H) === A &&
                ((ct = new ct(T, R + "enter", ft, n, H)),
                (ct.target = O),
                (ct.relatedTarget = wt),
                (j = ct)),
              (wt = j),
              z && ft)
            )
              e: {
                for (ct = z, T = ft, R = 0, O = ct; O; O = gl(O)) R++;
                for (O = 0, j = T; j; j = gl(j)) O++;
                for (; 0 < R - O; ) (ct = gl(ct)), R--;
                for (; 0 < O - R; ) (T = gl(T)), O--;
                for (; R--; ) {
                  if (ct === T || (T !== null && ct === T.alternate)) break e;
                  (ct = gl(ct)), (T = gl(T));
                }
                ct = null;
              }
            else ct = null;
            z !== null && Kh(Q, D, z, ct, !1),
              ft !== null && wt !== null && Kh(Q, wt, ft, ct, !0);
          }
        }
        t: {
          if (
            ((D = A ? Vl(A) : window),
            (z = D.nodeName && D.nodeName.toLowerCase()),
            z === "select" || (z === "input" && D.type === "file"))
          )
            var nt = of;
          else if (rf(D))
            if (ff) nt = Um;
            else {
              nt = Cm;
              var _t = Dm;
            }
          else
            (z = D.nodeName),
              !z ||
              z.toLowerCase() !== "input" ||
              (D.type !== "checkbox" && D.type !== "radio")
                ? A && qs(A.elementType) && (nt = of)
                : (nt = zm);
          if (nt && (nt = nt(t, A))) {
            cf(Q, nt, n, H);
            break t;
          }
          _t && _t(t, D, A),
            t === "focusout" &&
              A &&
              D.type === "number" &&
              A.memoizedProps.value != null &&
              Bs(D, "number", D.value);
        }
        switch (((_t = A ? Vl(A) : window), t)) {
          case "focusin":
            (rf(_t) || _t.contentEditable === "true") &&
              ((ka = _t), (Is = A), (Wl = null));
            break;
          case "focusout":
            Wl = Is = ka = null;
            break;
          case "mousedown":
            tr = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            (tr = !1), Sf(Q, n, H);
            break;
          case "selectionchange":
            if (Nm) break;
          case "keydown":
          case "keyup":
            Sf(Q, n, H);
        }
        var ut;
        if (Fs)
          t: {
            switch (t) {
              case "compositionstart":
                var ot = "onCompositionStart";
                break t;
              case "compositionend":
                ot = "onCompositionEnd";
                break t;
              case "compositionupdate":
                ot = "onCompositionUpdate";
                break t;
            }
            ot = void 0;
          }
        else
          Ja
            ? uf(t, n) && (ot = "onCompositionEnd")
            : t === "keydown" &&
              n.keyCode === 229 &&
              (ot = "onCompositionStart");
        ot &&
          (nf &&
            n.locale !== "ko" &&
            (Ja || ot !== "onCompositionStart"
              ? ot === "onCompositionEnd" && Ja && (ut = $o())
              : ((zn = H),
                (Xs = "value" in zn ? zn.value : zn.textContent),
                (Ja = !0))),
          (_t = Ju(A, ot)),
          0 < _t.length &&
            ((ot = new tf(ot, t, null, n, H)),
            Q.push({ event: ot, listeners: _t }),
            ut
              ? (ot.data = ut)
              : ((ut = sf(n)), ut !== null && (ot.data = ut)))),
          (ut = Tm ? Mm(t, n) : Om(t, n)) &&
            ((ot = Ju(A, "onBeforeInput")),
            0 < ot.length &&
              ((_t = new tf("onBeforeInput", "beforeinput", null, n, H)),
              Q.push({ event: _t, listeners: ot }),
              (_t.data = ut))),
          m0(Q, t, A, n, H);
      }
      Vh(Q, e);
    });
  }
  function Oi(t, e, n) {
    return { instance: t, listener: e, currentTarget: n };
  }
  function Ju(t, e) {
    for (var n = e + "Capture", a = []; t !== null; ) {
      var i = t,
        r = i.stateNode;
      if (
        ((i = i.tag),
        (i !== 5 && i !== 26 && i !== 27) ||
          r === null ||
          ((i = Xl(t, n)),
          i != null && a.unshift(Oi(t, i, r)),
          (i = Xl(t, e)),
          i != null && a.push(Oi(t, i, r))),
        t.tag === 3)
      )
        return a;
      t = t.return;
    }
    return [];
  }
  function gl(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Kh(t, e, n, a, i) {
    for (var r = e._reactName, o = []; n !== null && n !== a; ) {
      var y = n,
        _ = y.alternate,
        A = y.stateNode;
      if (((y = y.tag), _ !== null && _ === a)) break;
      (y !== 5 && y !== 26 && y !== 27) ||
        A === null ||
        ((_ = A),
        i
          ? ((A = Xl(n, r)), A != null && o.unshift(Oi(n, A, _)))
          : i || ((A = Xl(n, r)), A != null && o.push(Oi(n, A, _)))),
        (n = n.return);
    }
    o.length !== 0 && t.push({ event: e, listeners: o });
  }
  var b0 = /\r\n?/g,
    _0 = /\u0000|\uFFFD/g;
  function Zh(t) {
    return (typeof t == "string" ? t : "" + t)
      .replace(
        b0,
        `
`,
      )
      .replace(_0, "");
  }
  function Jh(t, e) {
    return (e = Zh(e)), Zh(t) === e;
  }
  function ku() {}
  function Ut(t, e, n, a, i, r) {
    switch (n) {
      case "children":
        typeof a == "string"
          ? e === "body" || (e === "textarea" && a === "") || Xa(t, a)
          : (typeof a == "number" || typeof a == "bigint") &&
            e !== "body" &&
            Xa(t, "" + a);
        break;
      case "className":
        Ii(t, "class", a);
        break;
      case "tabIndex":
        Ii(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ii(t, n, a);
        break;
      case "style":
        ko(t, a, r);
        break;
      case "data":
        if (e !== "object") {
          Ii(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "symbol" ||
          typeof a == "boolean"
        ) {
          t.removeAttribute(n);
          break;
        }
        (a = nu("" + a)), t.setAttribute(n, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof r == "function" &&
            (n === "formAction"
              ? (e !== "input" && Ut(t, e, "name", i.name, i, null),
                Ut(t, e, "formEncType", i.formEncType, i, null),
                Ut(t, e, "formMethod", i.formMethod, i, null),
                Ut(t, e, "formTarget", i.formTarget, i, null))
              : (Ut(t, e, "encType", i.encType, i, null),
                Ut(t, e, "method", i.method, i, null),
                Ut(t, e, "target", i.target, i, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(n);
          break;
        }
        (a = nu("" + a)), t.setAttribute(n, a);
        break;
      case "onClick":
        a != null && (t.onclick = ku);
        break;
      case "onScroll":
        a != null && Rt("scroll", t);
        break;
      case "onScrollEnd":
        a != null && Rt("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(c(61));
          if (((n = a.__html), n != null)) {
            if (i.children != null) throw Error(c(60));
            t.innerHTML = n;
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "boolean" ||
          typeof a == "symbol"
        ) {
          t.removeAttribute("xlink:href");
          break;
        }
        (n = nu("" + a)),
          t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol"
          ? t.setAttribute(n, "" + a)
          : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol"
          ? t.setAttribute(n, "")
          : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        a === !0
          ? t.setAttribute(n, "")
          : a !== !1 &&
              a != null &&
              typeof a != "function" &&
              typeof a != "symbol"
            ? t.setAttribute(n, a)
            : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null &&
        typeof a != "function" &&
        typeof a != "symbol" &&
        !isNaN(a) &&
        1 <= a
          ? t.setAttribute(n, a)
          : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
          ? t.removeAttribute(n)
          : t.setAttribute(n, a);
        break;
      case "popover":
        Rt("beforetoggle", t), Rt("toggle", t), Wi(t, "popover", a);
        break;
      case "xlinkActuate":
        fn(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
        break;
      case "xlinkArcrole":
        fn(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
        break;
      case "xlinkRole":
        fn(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
        break;
      case "xlinkShow":
        fn(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
        break;
      case "xlinkTitle":
        fn(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
        break;
      case "xlinkType":
        fn(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
        break;
      case "xmlBase":
        fn(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
        break;
      case "xmlLang":
        fn(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
        break;
      case "xmlSpace":
        fn(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
        break;
      case "is":
        Wi(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) ||
          (n[0] !== "o" && n[0] !== "O") ||
          (n[1] !== "n" && n[1] !== "N")) &&
          ((n = $v.get(n) || n), Wi(t, n, a));
    }
  }
  function Rc(t, e, n, a, i, r) {
    switch (n) {
      case "style":
        ko(t, a, r);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(c(61));
          if (((n = a.__html), n != null)) {
            if (i.children != null) throw Error(c(60));
            t.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof a == "string"
          ? Xa(t, a)
          : (typeof a == "number" || typeof a == "bigint") && Xa(t, "" + a);
        break;
      case "onScroll":
        a != null && Rt("scroll", t);
        break;
      case "onScrollEnd":
        a != null && Rt("scrollend", t);
        break;
      case "onClick":
        a != null && (t.onclick = ku);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!jo.hasOwnProperty(n))
          t: {
            if (
              n[0] === "o" &&
              n[1] === "n" &&
              ((i = n.endsWith("Capture")),
              (e = n.slice(2, i ? n.length - 7 : void 0)),
              (r = t[ve] || null),
              (r = r != null ? r[n] : null),
              typeof r == "function" && t.removeEventListener(e, r, i),
              typeof a == "function")
            ) {
              typeof r != "function" &&
                r !== null &&
                (n in t
                  ? (t[n] = null)
                  : t.hasAttribute(n) && t.removeAttribute(n)),
                t.addEventListener(e, a, i);
              break t;
            }
            n in t
              ? (t[n] = a)
              : a === !0
                ? t.setAttribute(n, "")
                : Wi(t, n, a);
          }
    }
  }
  function ie(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Rt("error", t), Rt("load", t);
        var a = !1,
          i = !1,
          r;
        for (r in n)
          if (n.hasOwnProperty(r)) {
            var o = n[r];
            if (o != null)
              switch (r) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  i = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(c(137, e));
                default:
                  Ut(t, e, r, o, n, null);
              }
          }
        i && Ut(t, e, "srcSet", n.srcSet, n, null),
          a && Ut(t, e, "src", n.src, n, null);
        return;
      case "input":
        Rt("invalid", t);
        var y = (r = o = i = null),
          _ = null,
          A = null;
        for (a in n)
          if (n.hasOwnProperty(a)) {
            var H = n[a];
            if (H != null)
              switch (a) {
                case "name":
                  i = H;
                  break;
                case "type":
                  o = H;
                  break;
                case "checked":
                  _ = H;
                  break;
                case "defaultChecked":
                  A = H;
                  break;
                case "value":
                  r = H;
                  break;
                case "defaultValue":
                  y = H;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (H != null) throw Error(c(137, e));
                  break;
                default:
                  Ut(t, e, a, H, n, null);
              }
          }
        Xo(t, r, y, _, A, o, i, !1), tu(t);
        return;
      case "select":
        Rt("invalid", t), (a = o = r = null);
        for (i in n)
          if (n.hasOwnProperty(i) && ((y = n[i]), y != null))
            switch (i) {
              case "value":
                r = y;
                break;
              case "defaultValue":
                o = y;
                break;
              case "multiple":
                a = y;
              default:
                Ut(t, e, i, y, n, null);
            }
        (e = r),
          (n = o),
          (t.multiple = !!a),
          e != null ? Va(t, !!a, e, !1) : n != null && Va(t, !!a, n, !0);
        return;
      case "textarea":
        Rt("invalid", t), (r = i = a = null);
        for (o in n)
          if (n.hasOwnProperty(o) && ((y = n[o]), y != null))
            switch (o) {
              case "value":
                a = y;
                break;
              case "defaultValue":
                i = y;
                break;
              case "children":
                r = y;
                break;
              case "dangerouslySetInnerHTML":
                if (y != null) throw Error(c(91));
                break;
              default:
                Ut(t, e, o, y, n, null);
            }
        Zo(t, a, i, r), tu(t);
        return;
      case "option":
        for (_ in n)
          if (n.hasOwnProperty(_) && ((a = n[_]), a != null))
            switch (_) {
              case "selected":
                t.selected =
                  a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Ut(t, e, _, a, n, null);
            }
        return;
      case "dialog":
        Rt("beforetoggle", t), Rt("toggle", t), Rt("cancel", t), Rt("close", t);
        break;
      case "iframe":
      case "object":
        Rt("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Mi.length; a++) Rt(Mi[a], t);
        break;
      case "image":
        Rt("error", t), Rt("load", t);
        break;
      case "details":
        Rt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        Rt("error", t), Rt("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (A in n)
          if (n.hasOwnProperty(A) && ((a = n[A]), a != null))
            switch (A) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(c(137, e));
              default:
                Ut(t, e, A, a, n, null);
            }
        return;
      default:
        if (qs(e)) {
          for (H in n)
            n.hasOwnProperty(H) &&
              ((a = n[H]), a !== void 0 && Rc(t, e, H, a, n, void 0));
          return;
        }
    }
    for (y in n)
      n.hasOwnProperty(y) && ((a = n[y]), a != null && Ut(t, e, y, a, n, null));
  }
  function E0(t, e, n, a) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var i = null,
          r = null,
          o = null,
          y = null,
          _ = null,
          A = null,
          H = null;
        for (z in n) {
          var Q = n[z];
          if (n.hasOwnProperty(z) && Q != null)
            switch (z) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                _ = Q;
              default:
                a.hasOwnProperty(z) || Ut(t, e, z, null, a, Q);
            }
        }
        for (var D in a) {
          var z = a[D];
          if (((Q = n[D]), a.hasOwnProperty(D) && (z != null || Q != null)))
            switch (D) {
              case "type":
                r = z;
                break;
              case "name":
                i = z;
                break;
              case "checked":
                A = z;
                break;
              case "defaultChecked":
                H = z;
                break;
              case "value":
                o = z;
                break;
              case "defaultValue":
                y = z;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (z != null) throw Error(c(137, e));
                break;
              default:
                z !== Q && Ut(t, e, D, z, a, Q);
            }
        }
        js(t, o, y, _, A, H, r, i);
        return;
      case "select":
        z = o = y = D = null;
        for (r in n)
          if (((_ = n[r]), n.hasOwnProperty(r) && _ != null))
            switch (r) {
              case "value":
                break;
              case "multiple":
                z = _;
              default:
                a.hasOwnProperty(r) || Ut(t, e, r, null, a, _);
            }
        for (i in a)
          if (
            ((r = a[i]),
            (_ = n[i]),
            a.hasOwnProperty(i) && (r != null || _ != null))
          )
            switch (i) {
              case "value":
                D = r;
                break;
              case "defaultValue":
                y = r;
                break;
              case "multiple":
                o = r;
              default:
                r !== _ && Ut(t, e, i, r, a, _);
            }
        (e = y),
          (n = o),
          (a = z),
          D != null
            ? Va(t, !!n, D, !1)
            : !!a != !!n &&
              (e != null ? Va(t, !!n, e, !0) : Va(t, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        z = D = null;
        for (y in n)
          if (
            ((i = n[y]),
            n.hasOwnProperty(y) && i != null && !a.hasOwnProperty(y))
          )
            switch (y) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ut(t, e, y, null, a, i);
            }
        for (o in a)
          if (
            ((i = a[o]),
            (r = n[o]),
            a.hasOwnProperty(o) && (i != null || r != null))
          )
            switch (o) {
              case "value":
                D = i;
                break;
              case "defaultValue":
                z = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(c(91));
                break;
              default:
                i !== r && Ut(t, e, o, i, a, r);
            }
        Ko(t, D, z);
        return;
      case "option":
        for (var ft in n)
          if (
            ((D = n[ft]),
            n.hasOwnProperty(ft) && D != null && !a.hasOwnProperty(ft))
          )
            switch (ft) {
              case "selected":
                t.selected = !1;
                break;
              default:
                Ut(t, e, ft, null, a, D);
            }
        for (_ in a)
          if (
            ((D = a[_]),
            (z = n[_]),
            a.hasOwnProperty(_) && D !== z && (D != null || z != null))
          )
            switch (_) {
              case "selected":
                t.selected =
                  D && typeof D != "function" && typeof D != "symbol";
                break;
              default:
                Ut(t, e, _, D, a, z);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ct in n)
          (D = n[ct]),
            n.hasOwnProperty(ct) &&
              D != null &&
              !a.hasOwnProperty(ct) &&
              Ut(t, e, ct, null, a, D);
        for (A in a)
          if (
            ((D = a[A]),
            (z = n[A]),
            a.hasOwnProperty(A) && D !== z && (D != null || z != null))
          )
            switch (A) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null) throw Error(c(137, e));
                break;
              default:
                Ut(t, e, A, D, a, z);
            }
        return;
      default:
        if (qs(e)) {
          for (var wt in n)
            (D = n[wt]),
              n.hasOwnProperty(wt) &&
                D !== void 0 &&
                !a.hasOwnProperty(wt) &&
                Rc(t, e, wt, void 0, a, D);
          for (H in a)
            (D = a[H]),
              (z = n[H]),
              !a.hasOwnProperty(H) ||
                D === z ||
                (D === void 0 && z === void 0) ||
                Rc(t, e, H, D, a, z);
          return;
        }
    }
    for (var T in n)
      (D = n[T]),
        n.hasOwnProperty(T) &&
          D != null &&
          !a.hasOwnProperty(T) &&
          Ut(t, e, T, null, a, D);
    for (Q in a)
      (D = a[Q]),
        (z = n[Q]),
        !a.hasOwnProperty(Q) ||
          D === z ||
          (D == null && z == null) ||
          Ut(t, e, Q, D, a, z);
  }
  var Tc = null,
    Mc = null;
  function Fu(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function kh(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Fh(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Oc(t, e) {
    return (
      t === "textarea" ||
      t === "noscript" ||
      typeof e.children == "string" ||
      typeof e.children == "number" ||
      typeof e.children == "bigint" ||
      (typeof e.dangerouslySetInnerHTML == "object" &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Ac = null;
  function R0() {
    var t = window.event;
    return t && t.type === "popstate"
      ? t === Ac
        ? !1
        : ((Ac = t), !0)
      : ((Ac = null), !1);
  }
  var Ph = typeof setTimeout == "function" ? setTimeout : void 0,
    T0 = typeof clearTimeout == "function" ? clearTimeout : void 0,
    $h = typeof Promise == "function" ? Promise : void 0,
    M0 =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof $h < "u"
          ? function (t) {
              return $h.resolve(null).then(t).catch(O0);
            }
          : Ph;
  function O0(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function Jn(t) {
    return t === "head";
  }
  function Wh(t, e) {
    var n = e,
      a = 0,
      i = 0;
    do {
      var r = n.nextSibling;
      if ((t.removeChild(n), r && r.nodeType === 8))
        if (((n = r.data), n === "/$")) {
          if (0 < a && 8 > a) {
            n = a;
            var o = t.ownerDocument;
            if ((n & 1 && Ai(o.documentElement), n & 2 && Ai(o.body), n & 4))
              for (n = o.head, Ai(n), o = n.firstChild; o; ) {
                var y = o.nextSibling,
                  _ = o.nodeName;
                o[Yl] ||
                  _ === "SCRIPT" ||
                  _ === "STYLE" ||
                  (_ === "LINK" && o.rel.toLowerCase() === "stylesheet") ||
                  n.removeChild(o),
                  (o = y);
              }
          }
          if (i === 0) {
            t.removeChild(r), Li(e);
            return;
          }
          i--;
        } else
          n === "$" || n === "$?" || n === "$!"
            ? i++
            : (a = n.charCodeAt(0) - 48);
      else a = 0;
      n = r;
    } while (n);
    Li(e);
  }
  function xc(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (((e = e.nextSibling), n.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          xc(n), ws(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function A0(t, e, n, a) {
    for (; t.nodeType === 1; ) {
      var i = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
      } else if (a) {
        if (!t[Yl])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (
                ((r = t.getAttribute("rel")),
                r === "stylesheet" && t.hasAttribute("data-precedence"))
              )
                break;
              if (
                r !== i.rel ||
                t.getAttribute("href") !==
                  (i.href == null || i.href === "" ? null : i.href) ||
                t.getAttribute("crossorigin") !==
                  (i.crossOrigin == null ? null : i.crossOrigin) ||
                t.getAttribute("title") !== (i.title == null ? null : i.title)
              )
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (
                ((r = t.getAttribute("src")),
                (r !== (i.src == null ? null : i.src) ||
                  t.getAttribute("type") !== (i.type == null ? null : i.type) ||
                  t.getAttribute("crossorigin") !==
                    (i.crossOrigin == null ? null : i.crossOrigin)) &&
                  r &&
                  t.hasAttribute("async") &&
                  !t.hasAttribute("itemprop"))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var r = i.name == null ? null : "" + i.name;
        if (i.type === "hidden" && t.getAttribute("name") === r) return t;
      } else return t;
      if (((t = Fe(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function x0(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") &&
          !n) ||
        ((t = Fe(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Dc(t) {
    return (
      t.data === "$!" ||
      (t.data === "$?" && t.ownerDocument.readyState === "complete")
    );
  }
  function D0(t, e) {
    var n = t.ownerDocument;
    if (t.data !== "$?" || n.readyState === "complete") e();
    else {
      var a = function () {
        e(), n.removeEventListener("DOMContentLoaded", a);
      };
      n.addEventListener("DOMContentLoaded", a), (t._reactRetry = a);
    }
  }
  function Fe(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (
          ((e = t.data),
          e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")
        )
          break;
        if (e === "/$") return null;
      }
    }
    return t;
  }
  var Cc = null;
  function Ih(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (e === 0) return t;
          e--;
        } else n === "/$" && e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function ty(t, e, n) {
    switch (((e = Fu(n)), t)) {
      case "html":
        if (((t = e.documentElement), !t)) throw Error(c(452));
        return t;
      case "head":
        if (((t = e.head), !t)) throw Error(c(453));
        return t;
      case "body":
        if (((t = e.body), !t)) throw Error(c(454));
        return t;
      default:
        throw Error(c(451));
    }
  }
  function Ai(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    ws(t);
  }
  var Qe = new Map(),
    ey = new Set();
  function Pu(t) {
    return typeof t.getRootNode == "function"
      ? t.getRootNode()
      : t.nodeType === 9
        ? t
        : t.ownerDocument;
  }
  var Mn = X.d;
  X.d = { f: C0, r: z0, D: U0, C: w0, L: N0, m: L0, X: j0, S: H0, M: B0 };
  function C0() {
    var t = Mn.f(),
      e = Gu();
    return t || e;
  }
  function z0(t) {
    var e = qa(t);
    e !== null && e.tag === 5 && e.type === "form" ? _d(e) : Mn.r(t);
  }
  var Sl = typeof document > "u" ? null : document;
  function ny(t, e, n) {
    var a = Sl;
    if (a && typeof e == "string" && e) {
      var i = we(e);
      (i = 'link[rel="' + t + '"][href="' + i + '"]'),
        typeof n == "string" && (i += '[crossorigin="' + n + '"]'),
        ey.has(i) ||
          (ey.add(i),
          (t = { rel: t, crossOrigin: n, href: e }),
          a.querySelector(i) === null &&
            ((e = a.createElement("link")),
            ie(e, "link", t),
            It(e),
            a.head.appendChild(e)));
    }
  }
  function U0(t) {
    Mn.D(t), ny("dns-prefetch", t, null);
  }
  function w0(t, e) {
    Mn.C(t, e), ny("preconnect", t, e);
  }
  function N0(t, e, n) {
    Mn.L(t, e, n);
    var a = Sl;
    if (a && t && e) {
      var i = 'link[rel="preload"][as="' + we(e) + '"]';
      e === "image" && n && n.imageSrcSet
        ? ((i += '[imagesrcset="' + we(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == "string" &&
            (i += '[imagesizes="' + we(n.imageSizes) + '"]'))
        : (i += '[href="' + we(t) + '"]');
      var r = i;
      switch (e) {
        case "style":
          r = bl(t);
          break;
        case "script":
          r = _l(t);
      }
      Qe.has(r) ||
        ((t = p(
          {
            rel: "preload",
            href: e === "image" && n && n.imageSrcSet ? void 0 : t,
            as: e,
          },
          n,
        )),
        Qe.set(r, t),
        a.querySelector(i) !== null ||
          (e === "style" && a.querySelector(xi(r))) ||
          (e === "script" && a.querySelector(Di(r))) ||
          ((e = a.createElement("link")),
          ie(e, "link", t),
          It(e),
          a.head.appendChild(e)));
    }
  }
  function L0(t, e) {
    Mn.m(t, e);
    var n = Sl;
    if (n && t) {
      var a = e && typeof e.as == "string" ? e.as : "script",
        i =
          'link[rel="modulepreload"][as="' + we(a) + '"][href="' + we(t) + '"]',
        r = i;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          r = _l(t);
      }
      if (
        !Qe.has(r) &&
        ((t = p({ rel: "modulepreload", href: t }, e)),
        Qe.set(r, t),
        n.querySelector(i) === null)
      ) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Di(r))) return;
        }
        (a = n.createElement("link")),
          ie(a, "link", t),
          It(a),
          n.head.appendChild(a);
      }
    }
  }
  function H0(t, e, n) {
    Mn.S(t, e, n);
    var a = Sl;
    if (a && t) {
      var i = Qa(a).hoistableStyles,
        r = bl(t);
      e = e || "default";
      var o = i.get(r);
      if (!o) {
        var y = { loading: 0, preload: null };
        if ((o = a.querySelector(xi(r)))) y.loading = 5;
        else {
          (t = p({ rel: "stylesheet", href: t, "data-precedence": e }, n)),
            (n = Qe.get(r)) && zc(t, n);
          var _ = (o = a.createElement("link"));
          It(_),
            ie(_, "link", t),
            (_._p = new Promise(function (A, H) {
              (_.onload = A), (_.onerror = H);
            })),
            _.addEventListener("load", function () {
              y.loading |= 1;
            }),
            _.addEventListener("error", function () {
              y.loading |= 2;
            }),
            (y.loading |= 4),
            $u(o, e, a);
        }
        (o = { type: "stylesheet", instance: o, count: 1, state: y }),
          i.set(r, o);
      }
    }
  }
  function j0(t, e) {
    Mn.X(t, e);
    var n = Sl;
    if (n && t) {
      var a = Qa(n).hoistableScripts,
        i = _l(t),
        r = a.get(i);
      r ||
        ((r = n.querySelector(Di(i))),
        r ||
          ((t = p({ src: t, async: !0 }, e)),
          (e = Qe.get(i)) && Uc(t, e),
          (r = n.createElement("script")),
          It(r),
          ie(r, "link", t),
          n.head.appendChild(r)),
        (r = { type: "script", instance: r, count: 1, state: null }),
        a.set(i, r));
    }
  }
  function B0(t, e) {
    Mn.M(t, e);
    var n = Sl;
    if (n && t) {
      var a = Qa(n).hoistableScripts,
        i = _l(t),
        r = a.get(i);
      r ||
        ((r = n.querySelector(Di(i))),
        r ||
          ((t = p({ src: t, async: !0, type: "module" }, e)),
          (e = Qe.get(i)) && Uc(t, e),
          (r = n.createElement("script")),
          It(r),
          ie(r, "link", t),
          n.head.appendChild(r)),
        (r = { type: "script", instance: r, count: 1, state: null }),
        a.set(i, r));
    }
  }
  function ay(t, e, n, a) {
    var i = (i = tt.current) ? Pu(i) : null;
    if (!i) throw Error(c(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string"
          ? ((e = bl(n.href)),
            (n = Qa(i).hoistableStyles),
            (a = n.get(e)),
            a ||
              ((a = { type: "style", instance: null, count: 0, state: null }),
              n.set(e, a)),
            a)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          n.rel === "stylesheet" &&
          typeof n.href == "string" &&
          typeof n.precedence == "string"
        ) {
          t = bl(n.href);
          var r = Qa(i).hoistableStyles,
            o = r.get(t);
          if (
            (o ||
              ((i = i.ownerDocument || i),
              (o = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              r.set(t, o),
              (r = i.querySelector(xi(t))) &&
                !r._p &&
                ((o.instance = r), (o.state.loading = 5)),
              Qe.has(t) ||
                ((n = {
                  rel: "preload",
                  as: "style",
                  href: n.href,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  media: n.media,
                  hrefLang: n.hrefLang,
                  referrerPolicy: n.referrerPolicy,
                }),
                Qe.set(t, n),
                r || q0(i, t, n, o.state))),
            e && a === null)
          )
            throw Error(c(528, ""));
          return o;
        }
        if (e && a !== null) throw Error(c(529, ""));
        return null;
      case "script":
        return (
          (e = n.async),
          (n = n.src),
          typeof n == "string" &&
          e &&
          typeof e != "function" &&
          typeof e != "symbol"
            ? ((e = _l(n)),
              (n = Qa(i).hoistableScripts),
              (a = n.get(e)),
              a ||
                ((a = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                n.set(e, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(c(444, t));
    }
  }
  function bl(t) {
    return 'href="' + we(t) + '"';
  }
  function xi(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function ly(t) {
    return p({}, t, { "data-precedence": t.precedence, precedence: null });
  }
  function q0(t, e, n, a) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]")
      ? (a.loading = 1)
      : ((e = t.createElement("link")),
        (a.preload = e),
        e.addEventListener("load", function () {
          return (a.loading |= 1);
        }),
        e.addEventListener("error", function () {
          return (a.loading |= 2);
        }),
        ie(e, "link", n),
        It(e),
        t.head.appendChild(e));
  }
  function _l(t) {
    return '[src="' + we(t) + '"]';
  }
  function Di(t) {
    return "script[async]" + t;
  }
  function iy(t, e, n) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case "style":
          var a = t.querySelector('style[data-href~="' + we(n.href) + '"]');
          if (a) return (e.instance = a), It(a), a;
          var i = p({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null,
          });
          return (
            (a = (t.ownerDocument || t).createElement("style")),
            It(a),
            ie(a, "style", i),
            $u(a, n.precedence, t),
            (e.instance = a)
          );
        case "stylesheet":
          i = bl(n.href);
          var r = t.querySelector(xi(i));
          if (r) return (e.state.loading |= 4), (e.instance = r), It(r), r;
          (a = ly(n)),
            (i = Qe.get(i)) && zc(a, i),
            (r = (t.ownerDocument || t).createElement("link")),
            It(r);
          var o = r;
          return (
            (o._p = new Promise(function (y, _) {
              (o.onload = y), (o.onerror = _);
            })),
            ie(r, "link", a),
            (e.state.loading |= 4),
            $u(r, n.precedence, t),
            (e.instance = r)
          );
        case "script":
          return (
            (r = _l(n.src)),
            (i = t.querySelector(Di(r)))
              ? ((e.instance = i), It(i), i)
              : ((a = n),
                (i = Qe.get(r)) && ((a = p({}, n)), Uc(a, i)),
                (t = t.ownerDocument || t),
                (i = t.createElement("script")),
                It(i),
                ie(i, "link", a),
                t.head.appendChild(i),
                (e.instance = i))
          );
        case "void":
          return null;
        default:
          throw Error(c(443, e.type));
      }
    else
      e.type === "stylesheet" &&
        (e.state.loading & 4) === 0 &&
        ((a = e.instance), (e.state.loading |= 4), $u(a, n.precedence, t));
    return e.instance;
  }
  function $u(t, e, n) {
    for (
      var a = n.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]',
        ),
        i = a.length ? a[a.length - 1] : null,
        r = i,
        o = 0;
      o < a.length;
      o++
    ) {
      var y = a[o];
      if (y.dataset.precedence === e) r = y;
      else if (r !== i) break;
    }
    r
      ? r.parentNode.insertBefore(t, r.nextSibling)
      : ((e = n.nodeType === 9 ? n.head : n), e.insertBefore(t, e.firstChild));
  }
  function zc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title);
  }
  function Uc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity);
  }
  var Wu = null;
  function uy(t, e, n) {
    if (Wu === null) {
      var a = new Map(),
        i = (Wu = new Map());
      i.set(n, a);
    } else (i = Wu), (a = i.get(n)), a || ((a = new Map()), i.set(n, a));
    if (a.has(t)) return a;
    for (
      a.set(t, null), n = n.getElementsByTagName(t), i = 0;
      i < n.length;
      i++
    ) {
      var r = n[i];
      if (
        !(
          r[Yl] ||
          r[ue] ||
          (t === "link" && r.getAttribute("rel") === "stylesheet")
        ) &&
        r.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var o = r.getAttribute(e) || "";
        o = t + o;
        var y = a.get(o);
        y ? y.push(r) : a.set(o, [r]);
      }
    }
    return a;
  }
  function sy(t, e, n) {
    (t = t.ownerDocument || t),
      t.head.insertBefore(
        n,
        e === "title" ? t.querySelector("head > title") : null,
      );
  }
  function Q0(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof e.precedence != "string" ||
          typeof e.href != "string" ||
          e.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof e.rel != "string" ||
          typeof e.href != "string" ||
          e.href === "" ||
          e.onLoad ||
          e.onError
        )
          break;
        switch (e.rel) {
          case "stylesheet":
            return (
              (t = e.disabled), typeof e.precedence == "string" && t == null
            );
          default:
            return !0;
        }
      case "script":
        if (
          e.async &&
          typeof e.async != "function" &&
          typeof e.async != "symbol" &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function ry(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  var Ci = null;
  function G0() {}
  function Y0(t, e, n) {
    if (Ci === null) throw Error(c(475));
    var a = Ci;
    if (
      e.type === "stylesheet" &&
      (typeof n.media != "string" || matchMedia(n.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var i = bl(n.href),
          r = t.querySelector(xi(i));
        if (r) {
          (t = r._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (a.count++, (a = Iu.bind(a)), t.then(a, a)),
            (e.state.loading |= 4),
            (e.instance = r),
            It(r);
          return;
        }
        (r = t.ownerDocument || t),
          (n = ly(n)),
          (i = Qe.get(i)) && zc(n, i),
          (r = r.createElement("link")),
          It(r);
        var o = r;
        (o._p = new Promise(function (y, _) {
          (o.onload = y), (o.onerror = _);
        })),
          ie(r, "link", n),
          (e.instance = r);
      }
      a.stylesheets === null && (a.stylesheets = new Map()),
        a.stylesheets.set(e, t),
        (t = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (a.count++,
          (e = Iu.bind(a)),
          t.addEventListener("load", e),
          t.addEventListener("error", e));
    }
  }
  function V0() {
    if (Ci === null) throw Error(c(475));
    var t = Ci;
    return (
      t.stylesheets && t.count === 0 && wc(t, t.stylesheets),
      0 < t.count
        ? function (e) {
            var n = setTimeout(function () {
              if ((t.stylesheets && wc(t, t.stylesheets), t.unsuspend)) {
                var a = t.unsuspend;
                (t.unsuspend = null), a();
              }
            }, 6e4);
            return (
              (t.unsuspend = e),
              function () {
                (t.unsuspend = null), clearTimeout(n);
              }
            );
          }
        : null
    );
  }
  function Iu() {
    if ((this.count--, this.count === 0)) {
      if (this.stylesheets) wc(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        (this.unsuspend = null), t();
      }
    }
  }
  var ts = null;
  function wc(t, e) {
    (t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++,
        (ts = new Map()),
        e.forEach(X0, t),
        (ts = null),
        Iu.call(t));
  }
  function X0(t, e) {
    if (!(e.state.loading & 4)) {
      var n = ts.get(t);
      if (n) var a = n.get(null);
      else {
        (n = new Map()), ts.set(t, n);
        for (
          var i = t.querySelectorAll(
              "link[data-precedence],style[data-precedence]",
            ),
            r = 0;
          r < i.length;
          r++
        ) {
          var o = i[r];
          (o.nodeName === "LINK" || o.getAttribute("media") !== "not all") &&
            (n.set(o.dataset.precedence, o), (a = o));
        }
        a && n.set(null, a);
      }
      (i = e.instance),
        (o = i.getAttribute("data-precedence")),
        (r = n.get(o) || a),
        r === a && n.set(null, i),
        n.set(o, i),
        this.count++,
        (a = Iu.bind(this)),
        i.addEventListener("load", a),
        i.addEventListener("error", a),
        r
          ? r.parentNode.insertBefore(i, r.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t),
            t.insertBefore(i, t.firstChild)),
        (e.state.loading |= 4);
    }
  }
  var zi = {
    $$typeof: V,
    Provider: null,
    Consumer: null,
    _currentValue: at,
    _currentValue2: at,
    _threadCount: 0,
  };
  function K0(t, e, n, a, i, r, o, y) {
    (this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Ds(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Ds(0)),
      (this.hiddenUpdates = Ds(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = i),
      (this.onCaughtError = r),
      (this.onRecoverableError = o),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = y),
      (this.incompleteTransitions = new Map());
  }
  function cy(t, e, n, a, i, r, o, y, _, A, H, Q) {
    return (
      (t = new K0(t, e, n, o, y, _, A, Q)),
      (e = 1),
      r === !0 && (e |= 24),
      (r = Re(3, null, null, e)),
      (t.current = r),
      (r.stateNode = t),
      (e = yr()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (r.memoizedState = { element: a, isDehydrated: n, cache: e }),
      gr(r),
      t
    );
  }
  function oy(t) {
    return t ? ((t = Wa), t) : Wa;
  }
  function fy(t, e, n, a, i, r) {
    (i = oy(i)),
      a.context === null ? (a.context = i) : (a.pendingContext = i),
      (a = Nn(e)),
      (a.payload = { element: n }),
      (r = r === void 0 ? null : r),
      r !== null && (a.callback = r),
      (n = Ln(t, a, e)),
      n !== null && (xe(n, t, e), si(n, t, e));
  }
  function dy(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function Nc(t, e) {
    dy(t, e), (t = t.alternate) && dy(t, e);
  }
  function hy(t) {
    if (t.tag === 13) {
      var e = $a(t, 67108864);
      e !== null && xe(e, t, 67108864), Nc(t, 67108864);
    }
  }
  var es = !0;
  function Z0(t, e, n, a) {
    var i = C.T;
    C.T = null;
    var r = X.p;
    try {
      (X.p = 2), Lc(t, e, n, a);
    } finally {
      (X.p = r), (C.T = i);
    }
  }
  function J0(t, e, n, a) {
    var i = C.T;
    C.T = null;
    var r = X.p;
    try {
      (X.p = 8), Lc(t, e, n, a);
    } finally {
      (X.p = r), (C.T = i);
    }
  }
  function Lc(t, e, n, a) {
    if (es) {
      var i = Hc(a);
      if (i === null) Ec(t, e, a, ns, n), vy(t, a);
      else if (F0(i, t, e, n, a)) a.stopPropagation();
      else if ((vy(t, a), e & 4 && -1 < k0.indexOf(t))) {
        for (; i !== null; ) {
          var r = qa(i);
          if (r !== null)
            switch (r.tag) {
              case 3:
                if (((r = r.stateNode), r.current.memoizedState.isDehydrated)) {
                  var o = ca(r.pendingLanes);
                  if (o !== 0) {
                    var y = r;
                    for (y.pendingLanes |= 2, y.entangledLanes |= 2; o; ) {
                      var _ = 1 << (31 - _e(o));
                      (y.entanglements[1] |= _), (o &= ~_);
                    }
                    an(r), (Dt & 6) === 0 && ((qu = Wt() + 500), Ti(0));
                  }
                }
                break;
              case 13:
                (y = $a(r, 2)), y !== null && xe(y, r, 2), Gu(), Nc(r, 2);
            }
          if (((r = Hc(a)), r === null && Ec(t, e, a, ns, n), r === i)) break;
          i = r;
        }
        i !== null && a.stopPropagation();
      } else Ec(t, e, a, null, n);
    }
  }
  function Hc(t) {
    return (t = Gs(t)), jc(t);
  }
  var ns = null;
  function jc(t) {
    if (((ns = null), (t = Ba(t)), t !== null)) {
      var e = h(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (((t = v(e)), t !== null)) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return (ns = t), null;
  }
  function yy(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (La()) {
          case Bl:
            return 2;
          case ql:
            return 8;
          case xt:
          case Jt:
            return 32;
          case Ha:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Bc = !1,
    kn = null,
    Fn = null,
    Pn = null,
    Ui = new Map(),
    wi = new Map(),
    $n = [],
    k0 =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function vy(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        kn = null;
        break;
      case "dragenter":
      case "dragleave":
        Fn = null;
        break;
      case "mouseover":
      case "mouseout":
        Pn = null;
        break;
      case "pointerover":
      case "pointerout":
        Ui.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        wi.delete(e.pointerId);
    }
  }
  function Ni(t, e, n, a, i, r) {
    return t === null || t.nativeEvent !== r
      ? ((t = {
          blockedOn: e,
          domEventName: n,
          eventSystemFlags: a,
          nativeEvent: r,
          targetContainers: [i],
        }),
        e !== null && ((e = qa(e)), e !== null && hy(e)),
        t)
      : ((t.eventSystemFlags |= a),
        (e = t.targetContainers),
        i !== null && e.indexOf(i) === -1 && e.push(i),
        t);
  }
  function F0(t, e, n, a, i) {
    switch (e) {
      case "focusin":
        return (kn = Ni(kn, t, e, n, a, i)), !0;
      case "dragenter":
        return (Fn = Ni(Fn, t, e, n, a, i)), !0;
      case "mouseover":
        return (Pn = Ni(Pn, t, e, n, a, i)), !0;
      case "pointerover":
        var r = i.pointerId;
        return Ui.set(r, Ni(Ui.get(r) || null, t, e, n, a, i)), !0;
      case "gotpointercapture":
        return (
          (r = i.pointerId), wi.set(r, Ni(wi.get(r) || null, t, e, n, a, i)), !0
        );
    }
    return !1;
  }
  function my(t) {
    var e = Ba(t.target);
    if (e !== null) {
      var n = h(e);
      if (n !== null) {
        if (((e = n.tag), e === 13)) {
          if (((e = v(n)), e !== null)) {
            (t.blockedOn = e),
              Yv(t.priority, function () {
                if (n.tag === 13) {
                  var a = Ae();
                  a = Cs(a);
                  var i = $a(n, a);
                  i !== null && xe(i, n, a), Nc(n, a);
                }
              });
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function as(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = Hc(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var a = new n.constructor(n.type, n);
        (Qs = a), n.target.dispatchEvent(a), (Qs = null);
      } else return (e = qa(n)), e !== null && hy(e), (t.blockedOn = n), !1;
      e.shift();
    }
    return !0;
  }
  function py(t, e, n) {
    as(t) && n.delete(e);
  }
  function P0() {
    (Bc = !1),
      kn !== null && as(kn) && (kn = null),
      Fn !== null && as(Fn) && (Fn = null),
      Pn !== null && as(Pn) && (Pn = null),
      Ui.forEach(py),
      wi.forEach(py);
  }
  function ls(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null),
      Bc ||
        ((Bc = !0),
        l.unstable_scheduleCallback(l.unstable_NormalPriority, P0)));
  }
  var is = null;
  function gy(t) {
    is !== t &&
      ((is = t),
      l.unstable_scheduleCallback(l.unstable_NormalPriority, function () {
        is === t && (is = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e],
            a = t[e + 1],
            i = t[e + 2];
          if (typeof a != "function") {
            if (jc(a || n) === null) continue;
            break;
          }
          var r = qa(n);
          r !== null &&
            (t.splice(e, 3),
            (e -= 3),
            jr(r, { pending: !0, data: i, method: n.method, action: a }, a, i));
        }
      }));
  }
  function Li(t) {
    function e(_) {
      return ls(_, t);
    }
    kn !== null && ls(kn, t),
      Fn !== null && ls(Fn, t),
      Pn !== null && ls(Pn, t),
      Ui.forEach(e),
      wi.forEach(e);
    for (var n = 0; n < $n.length; n++) {
      var a = $n[n];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < $n.length && ((n = $n[0]), n.blockedOn === null); )
      my(n), n.blockedOn === null && $n.shift();
    if (((n = (t.ownerDocument || t).$$reactFormReplay), n != null))
      for (a = 0; a < n.length; a += 3) {
        var i = n[a],
          r = n[a + 1],
          o = i[ve] || null;
        if (typeof r == "function") o || gy(n);
        else if (o) {
          var y = null;
          if (r && r.hasAttribute("formAction")) {
            if (((i = r), (o = r[ve] || null))) y = o.formAction;
            else if (jc(i) !== null) continue;
          } else y = o.action;
          typeof y == "function" ? (n[a + 1] = y) : (n.splice(a, 3), (a -= 3)),
            gy(n);
        }
      }
  }
  function qc(t) {
    this._internalRoot = t;
  }
  (us.prototype.render = qc.prototype.render =
    function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(c(409));
      var n = e.current,
        a = Ae();
      fy(n, a, t, e, null, null);
    }),
    (us.prototype.unmount = qc.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var e = t.containerInfo;
          fy(t.current, 2, null, t, null, null), Gu(), (e[ja] = null);
        }
      });
  function us(t) {
    this._internalRoot = t;
  }
  us.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = No();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < $n.length && e !== 0 && e < $n[n].priority; n++);
      $n.splice(n, 0, t), n === 0 && my(t);
    }
  };
  var Sy = s.version;
  if (Sy !== "19.1.0") throw Error(c(527, Sy, "19.1.0"));
  X.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function"
        ? Error(c(188))
        : ((t = Object.keys(t).join(",")), Error(c(268, t)));
    return (
      (t = S(e)),
      (t = t !== null ? d(t) : null),
      (t = t === null ? null : t.stateNode),
      t
    );
  };
  var $0 = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: C,
    reconcilerVersion: "19.1.0",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ss = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ss.isDisabled && ss.supportsFiber)
      try {
        (ra = ss.inject($0)), (be = ss);
      } catch {}
  }
  return (
    (ji.createRoot = function (t, e) {
      if (!f(t)) throw Error(c(299));
      var n = !1,
        a = "",
        i = Ld,
        r = Hd,
        o = jd,
        y = null;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (n = !0),
          e.identifierPrefix !== void 0 && (a = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (i = e.onUncaughtError),
          e.onCaughtError !== void 0 && (r = e.onCaughtError),
          e.onRecoverableError !== void 0 && (o = e.onRecoverableError),
          e.unstable_transitionCallbacks !== void 0 &&
            (y = e.unstable_transitionCallbacks)),
        (e = cy(t, 1, !1, null, null, n, a, i, r, o, y, null)),
        (t[ja] = e.current),
        _c(t),
        new qc(e)
      );
    }),
    (ji.hydrateRoot = function (t, e, n) {
      if (!f(t)) throw Error(c(299));
      var a = !1,
        i = "",
        r = Ld,
        o = Hd,
        y = jd,
        _ = null,
        A = null;
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (a = !0),
          n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (r = n.onUncaughtError),
          n.onCaughtError !== void 0 && (o = n.onCaughtError),
          n.onRecoverableError !== void 0 && (y = n.onRecoverableError),
          n.unstable_transitionCallbacks !== void 0 &&
            (_ = n.unstable_transitionCallbacks),
          n.formState !== void 0 && (A = n.formState)),
        (e = cy(t, 1, !0, e, n ?? null, a, i, r, o, y, _, A)),
        (e.context = oy(null)),
        (n = e.current),
        (a = Ae()),
        (a = Cs(a)),
        (i = Nn(a)),
        (i.callback = null),
        Ln(n, i, a),
        (n = a),
        (e.current.lanes = n),
        Gl(e, n),
        an(e),
        (t[ja] = e.current),
        _c(t),
        new us(e)
      );
    }),
    (ji.version = "19.1.0"),
    ji
  );
}
var Cy;
function cp() {
  if (Cy) return Vc.exports;
  Cy = 1;
  function l() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (s) {
        console.error(s);
      }
  }
  return l(), (Vc.exports = rp()), Vc.exports;
}
var op = cp();
const Tl = new WeakMap(),
  ys = new WeakMap(),
  ms = { current: [] };
let Jc = !1,
  Gi = 0;
const qi = new Set(),
  cs = new Map();
function fv(l) {
  const s = Array.from(l).sort((u, c) =>
    u instanceof Ml && u.options.deps.includes(c)
      ? 1
      : c instanceof Ml && c.options.deps.includes(u)
        ? -1
        : 0,
  );
  for (const u of s) {
    if (ms.current.includes(u)) continue;
    ms.current.push(u), u.recompute();
    const c = ys.get(u);
    if (c)
      for (const f of c) {
        const h = Tl.get(f);
        h && fv(h);
      }
  }
}
function fp(l) {
  l.listeners.forEach((s) => s({ prevVal: l.prevState, currentVal: l.state }));
}
function dp(l) {
  l.listeners.forEach((s) => s({ prevVal: l.prevState, currentVal: l.state }));
}
function dv(l) {
  if (
    (Gi > 0 && !cs.has(l) && cs.set(l, l.prevState),
    qi.add(l),
    !(Gi > 0) && !Jc)
  )
    try {
      for (Jc = !0; qi.size > 0; ) {
        const s = Array.from(qi);
        qi.clear();
        for (const u of s) {
          const c = cs.get(u) ?? u.prevState;
          (u.prevState = c), fp(u);
        }
        for (const u of s) {
          const c = Tl.get(u);
          c && (ms.current.push(u), fv(c));
        }
        for (const u of s) {
          const c = Tl.get(u);
          if (c) for (const f of c) dp(f);
        }
      }
    } finally {
      (Jc = !1), (ms.current = []), cs.clear();
    }
}
function zy(l) {
  Gi++;
  try {
    l();
  } finally {
    if ((Gi--, Gi === 0)) {
      const s = Array.from(qi)[0];
      s && dv(s);
    }
  }
}
function hp(l) {
  return typeof l == "function";
}
class uo {
  constructor(s, u) {
    (this.listeners = new Set()),
      (this.subscribe = (c) => {
        var f, h;
        this.listeners.add(c);
        const v =
          (h = (f = this.options) == null ? void 0 : f.onSubscribe) == null
            ? void 0
            : h.call(f, c, this);
        return () => {
          this.listeners.delete(c), v == null || v();
        };
      }),
      (this.prevState = s),
      (this.state = s),
      (this.options = u);
  }
  setState(s) {
    var u, c, f;
    (this.prevState = this.state),
      (u = this.options) != null && u.updateFn
        ? (this.state = this.options.updateFn(this.prevState)(s))
        : hp(s)
          ? (this.state = s(this.prevState))
          : (this.state = s),
      (f = (c = this.options) == null ? void 0 : c.onUpdate) == null ||
        f.call(c),
      dv(this);
  }
}
class Ml {
  constructor(s) {
    (this.listeners = new Set()),
      (this._subscriptions = []),
      (this.lastSeenDepValues = []),
      (this.getDepVals = () => {
        const u = [],
          c = [];
        for (const f of this.options.deps) u.push(f.prevState), c.push(f.state);
        return (
          (this.lastSeenDepValues = c),
          { prevDepVals: u, currDepVals: c, prevVal: this.prevState ?? void 0 }
        );
      }),
      (this.recompute = () => {
        var u, c;
        this.prevState = this.state;
        const {
          prevDepVals: f,
          currDepVals: h,
          prevVal: v,
        } = this.getDepVals();
        (this.state = this.options.fn({
          prevDepVals: f,
          currDepVals: h,
          prevVal: v,
        })),
          (c = (u = this.options).onUpdate) == null || c.call(u);
      }),
      (this.checkIfRecalculationNeededDeeply = () => {
        for (const h of this.options.deps)
          h instanceof Ml && h.checkIfRecalculationNeededDeeply();
        let u = !1;
        const c = this.lastSeenDepValues,
          { currDepVals: f } = this.getDepVals();
        for (let h = 0; h < f.length; h++)
          if (f[h] !== c[h]) {
            u = !0;
            break;
          }
        u && this.recompute();
      }),
      (this.mount = () => (
        this.registerOnGraph(),
        this.checkIfRecalculationNeededDeeply(),
        () => {
          this.unregisterFromGraph();
          for (const u of this._subscriptions) u();
        }
      )),
      (this.subscribe = (u) => {
        var c, f;
        this.listeners.add(u);
        const h =
          (f = (c = this.options).onSubscribe) == null
            ? void 0
            : f.call(c, u, this);
        return () => {
          this.listeners.delete(u), h == null || h();
        };
      }),
      (this.options = s),
      (this.state = s.fn({
        prevDepVals: void 0,
        prevVal: void 0,
        currDepVals: this.getDepVals().currDepVals,
      }));
  }
  registerOnGraph(s = this.options.deps) {
    for (const u of s)
      if (u instanceof Ml)
        u.registerOnGraph(), this.registerOnGraph(u.options.deps);
      else if (u instanceof uo) {
        let c = Tl.get(u);
        c || ((c = new Set()), Tl.set(u, c)), c.add(this);
        let f = ys.get(this);
        f || ((f = new Set()), ys.set(this, f)), f.add(u);
      }
  }
  unregisterFromGraph(s = this.options.deps) {
    for (const u of s)
      if (u instanceof Ml) this.unregisterFromGraph(u.options.deps);
      else if (u instanceof uo) {
        const c = Tl.get(u);
        c && c.delete(this);
        const f = ys.get(this);
        f && f.delete(u);
      }
  }
}
const sa = "__TSR_index",
  Uy = "popstate",
  wy = "beforeunload";
function hv(l) {
  let s = l.getLocation();
  const u = new Set(),
    c = (v) => {
      (s = l.getLocation()), u.forEach((g) => g({ location: s, action: v }));
    },
    f = (v) => {
      (l.notifyOnIndexChange ?? !0) ? c(v) : (s = l.getLocation());
    },
    h = async ({ task: v, navigateOpts: g, ...S }) => {
      var d, p;
      if ((g == null ? void 0 : g.ignoreBlocker) ?? !1) {
        v();
        return;
      }
      const b = ((d = l.getBlockers) == null ? void 0 : d.call(l)) ?? [],
        x = S.type === "PUSH" || S.type === "REPLACE";
      if (typeof document < "u" && b.length && x)
        for (const M of b) {
          const U = Vi(S.path, S.state);
          if (
            await M.blockerFn({
              currentLocation: s,
              nextLocation: U,
              action: S.type,
            })
          ) {
            (p = l.onBlocked) == null || p.call(l);
            return;
          }
        }
      v();
    };
  return {
    get location() {
      return s;
    },
    get length() {
      return l.getLength();
    },
    subscribers: u,
    subscribe: (v) => (
      u.add(v),
      () => {
        u.delete(v);
      }
    ),
    push: (v, g, S) => {
      const d = s.state[sa];
      (g = so(d + 1, g)),
        h({
          task: () => {
            l.pushState(v, g), c({ type: "PUSH" });
          },
          navigateOpts: S,
          type: "PUSH",
          path: v,
          state: g,
        });
    },
    replace: (v, g, S) => {
      const d = s.state[sa];
      (g = so(d, g)),
        h({
          task: () => {
            l.replaceState(v, g), c({ type: "REPLACE" });
          },
          navigateOpts: S,
          type: "REPLACE",
          path: v,
          state: g,
        });
    },
    go: (v, g) => {
      h({
        task: () => {
          l.go(v), f({ type: "GO", index: v });
        },
        navigateOpts: g,
        type: "GO",
      });
    },
    back: (v) => {
      h({
        task: () => {
          l.back((v == null ? void 0 : v.ignoreBlocker) ?? !1),
            f({ type: "BACK" });
        },
        navigateOpts: v,
        type: "BACK",
      });
    },
    forward: (v) => {
      h({
        task: () => {
          l.forward((v == null ? void 0 : v.ignoreBlocker) ?? !1),
            f({ type: "FORWARD" });
        },
        navigateOpts: v,
        type: "FORWARD",
      });
    },
    canGoBack: () => s.state[sa] !== 0,
    createHref: (v) => l.createHref(v),
    block: (v) => {
      var g;
      if (!l.setBlockers) return () => {};
      const S = ((g = l.getBlockers) == null ? void 0 : g.call(l)) ?? [];
      return (
        l.setBlockers([...S, v]),
        () => {
          var d, p;
          const m = ((d = l.getBlockers) == null ? void 0 : d.call(l)) ?? [];
          (p = l.setBlockers) == null ||
            p.call(
              l,
              m.filter((b) => b !== v),
            );
        }
      );
    },
    flush: () => {
      var v;
      return (v = l.flush) == null ? void 0 : v.call(l);
    },
    destroy: () => {
      var v;
      return (v = l.destroy) == null ? void 0 : v.call(l);
    },
    notify: c,
  };
}
function so(l, s) {
  return s || (s = {}), { ...s, key: So(), [sa]: l };
}
function yp(l) {
  var s;
  const u = typeof document < "u" ? window : void 0,
    c = u.history.pushState,
    f = u.history.replaceState;
  let h = [];
  const v = () => h,
    g = (w) => (h = w),
    S = (w) => w,
    d = () =>
      Vi(
        `${u.location.pathname}${u.location.search}${u.location.hash}`,
        u.history.state,
      );
  ((s = u.history.state) != null && s.key) ||
    u.history.replaceState({ [sa]: 0, key: So() }, "");
  let p = d(),
    m,
    b = !1,
    x = !1,
    M = !1,
    U = !1;
  const L = () => p;
  let q, K;
  const V = () => {
      q &&
        ((G._ignoreSubscribers = !0),
        (q.isPush ? u.history.pushState : u.history.replaceState)(
          q.state,
          "",
          q.href,
        ),
        (G._ignoreSubscribers = !1),
        (q = void 0),
        (K = void 0),
        (m = void 0));
    },
    I = (w, W, rt) => {
      const et = S(W);
      K || (m = p),
        (p = Vi(W, rt)),
        (q = {
          href: et,
          state: rt,
          isPush: (q == null ? void 0 : q.isPush) || w === "push",
        }),
        K || (K = Promise.resolve().then(() => V()));
    },
    P = (w) => {
      (p = d()), G.notify({ type: w });
    },
    Y = async () => {
      if (x) {
        x = !1;
        return;
      }
      const w = d(),
        W = w.state[sa] - p.state[sa],
        rt = W === 1,
        et = W === -1,
        dt = (!rt && !et) || b;
      b = !1;
      const pt = dt ? "GO" : et ? "BACK" : "FORWARD",
        ht = dt ? { type: "GO", index: W } : { type: et ? "BACK" : "FORWARD" };
      if (M) M = !1;
      else {
        const C = v();
        if (typeof document < "u" && C.length) {
          for (const X of C)
            if (
              await X.blockerFn({
                currentLocation: p,
                nextLocation: w,
                action: pt,
              })
            ) {
              (x = !0), u.history.go(1), G.notify(ht);
              return;
            }
        }
      }
      (p = d()), G.notify(ht);
    },
    F = (w) => {
      if (U) {
        U = !1;
        return;
      }
      let W = !1;
      const rt = v();
      if (typeof document < "u" && rt.length)
        for (const et of rt) {
          const dt = et.enableBeforeUnload ?? !0;
          if (dt === !0) {
            W = !0;
            break;
          }
          if (typeof dt == "function" && dt() === !0) {
            W = !0;
            break;
          }
        }
      if (W) return w.preventDefault(), (w.returnValue = "");
    },
    G = hv({
      getLocation: L,
      getLength: () => u.history.length,
      pushState: (w, W) => I("push", w, W),
      replaceState: (w, W) => I("replace", w, W),
      back: (w) => (w && (M = !0), (U = !0), u.history.back()),
      forward: (w) => {
        w && (M = !0), (U = !0), u.history.forward();
      },
      go: (w) => {
        (b = !0), u.history.go(w);
      },
      createHref: (w) => S(w),
      flush: V,
      destroy: () => {
        (u.history.pushState = c),
          (u.history.replaceState = f),
          u.removeEventListener(wy, F, { capture: !0 }),
          u.removeEventListener(Uy, Y);
      },
      onBlocked: () => {
        m && p !== m && (p = m);
      },
      getBlockers: v,
      setBlockers: g,
      notifyOnIndexChange: !1,
    });
  return (
    u.addEventListener(wy, F, { capture: !0 }),
    u.addEventListener(Uy, Y),
    (u.history.pushState = function (...w) {
      const W = c.apply(u.history, w);
      return G._ignoreSubscribers || P("PUSH"), W;
    }),
    (u.history.replaceState = function (...w) {
      const W = f.apply(u.history, w);
      return G._ignoreSubscribers || P("REPLACE"), W;
    }),
    G
  );
}
function vp(l = { initialEntries: ["/"] }) {
  const s = l.initialEntries;
  let u = l.initialIndex
    ? Math.min(Math.max(l.initialIndex, 0), s.length - 1)
    : s.length - 1;
  const c = s.map((h, v) => so(v, void 0));
  return hv({
    getLocation: () => Vi(s[u], c[u]),
    getLength: () => s.length,
    pushState: (h, v) => {
      u < s.length - 1 && (s.splice(u + 1), c.splice(u + 1)),
        c.push(v),
        s.push(h),
        (u = Math.max(s.length - 1, 0));
    },
    replaceState: (h, v) => {
      (c[u] = v), (s[u] = h);
    },
    back: () => {
      u = Math.max(u - 1, 0);
    },
    forward: () => {
      u = Math.min(u + 1, s.length - 1);
    },
    go: (h) => {
      u = Math.min(Math.max(u + h, 0), s.length - 1);
    },
    createHref: (h) => h,
  });
}
function Vi(l, s) {
  const u = l.indexOf("#"),
    c = l.indexOf("?");
  return {
    href: l,
    pathname: l.substring(
      0,
      u > 0 ? (c > 0 ? Math.min(u, c) : u) : c > 0 ? c : l.length,
    ),
    hash: u > -1 ? l.substring(u) : "",
    search: c > -1 ? l.slice(c, u === -1 ? void 0 : u) : "",
    state: s || { [sa]: 0, key: So() },
  };
}
function So() {
  return (Math.random() + 1).toString(36).substring(7);
}
var mp = "Invariant failed";
function on(l, s) {
  if (!l) throw new Error(mp);
}
function ro(l) {
  return l[l.length - 1];
}
function pp(l) {
  return typeof l == "function";
}
function Ua(l, s) {
  return pp(l) ? l(s) : l;
}
function co(l, s) {
  return s.reduce((u, c) => ((u[c] = l[c]), u), {});
}
function Ge(l, s) {
  if (l === s) return l;
  const u = s,
    c = Hy(l) && Hy(u);
  if (c || (Ny(l) && Ny(u))) {
    const f = c ? l : Object.keys(l).concat(Object.getOwnPropertySymbols(l)),
      h = f.length,
      v = c ? u : Object.keys(u).concat(Object.getOwnPropertySymbols(u)),
      g = v.length,
      S = c ? [] : {};
    let d = 0;
    for (let p = 0; p < g; p++) {
      const m = c ? p : v[p];
      ((!c && f.includes(m)) || c) && l[m] === void 0 && u[m] === void 0
        ? ((S[m] = void 0), d++)
        : ((S[m] = Ge(l[m], u[m])), S[m] === l[m] && l[m] !== void 0 && d++);
    }
    return h === g && d === h ? l : S;
  }
  return u;
}
function Ny(l) {
  return (
    ua(l) && Object.getOwnPropertyNames(l).length === Object.keys(l).length
  );
}
function ua(l) {
  if (!Ly(l)) return !1;
  const s = l.constructor;
  if (typeof s > "u") return !0;
  const u = s.prototype;
  return !(!Ly(u) || !u.hasOwnProperty("isPrototypeOf"));
}
function Ly(l) {
  return Object.prototype.toString.call(l) === "[object Object]";
}
function Hy(l) {
  return Array.isArray(l) && l.length === Object.keys(l).length;
}
function jy(l, s) {
  let u = Object.keys(l);
  return s && (u = u.filter((c) => l[c] !== void 0)), u;
}
function Ol(l, s, u) {
  if (l === s) return !0;
  if (typeof l != typeof s) return !1;
  if (ua(l) && ua(s)) {
    const c = (u == null ? void 0 : u.ignoreUndefined) ?? !0,
      f = jy(l, c),
      h = jy(s, c);
    return !(u != null && u.partial) && f.length !== h.length
      ? !1
      : h.every((v) => Ol(l[v], s[v], u));
  }
  return Array.isArray(l) && Array.isArray(s)
    ? l.length !== s.length
      ? !1
      : !l.some((c, f) => !Ol(c, s[f], u))
    : !1;
}
function El(l) {
  let s, u;
  const c = new Promise((f, h) => {
    (s = f), (u = h);
  });
  return (
    (c.status = "pending"),
    (c.resolve = (f) => {
      (c.status = "resolved"), (c.value = f), s(f), l == null || l(f);
    }),
    (c.reject = (f) => {
      (c.status = "rejected"), u(f);
    }),
    c
  );
}
function cn(l) {
  return Rs(l.filter((s) => s !== void 0).join("/"));
}
function Rs(l) {
  return l.replace(/\/{2,}/g, "/");
}
function bo(l) {
  return l === "/" ? l : l.replace(/^\/{1,}/, "");
}
function Hl(l) {
  return l === "/" ? l : l.replace(/\/{1,}$/, "");
}
function kc(l) {
  return Hl(bo(l));
}
function ps(l, s) {
  return l != null && l.endsWith("/") && l !== "/" && l !== `${s}/`
    ? l.slice(0, -1)
    : l;
}
function gp(l, s, u) {
  return ps(l, u) === ps(s, u);
}
function Sp({
  basepath: l,
  base: s,
  to: u,
  trailingSlash: c = "never",
  caseSensitive: f,
}) {
  var h, v;
  (s = gs(l, s, f)), (u = gs(l, u, f));
  let g = jl(s);
  const S = jl(u);
  g.length > 1 && ((h = ro(g)) == null ? void 0 : h.value) === "/" && g.pop(),
    S.forEach((m, b) => {
      m.value === "/"
        ? b
          ? b === S.length - 1 && g.push(m)
          : (g = [m])
        : m.value === ".."
          ? g.pop()
          : m.value === "." || g.push(m);
    }),
    g.length > 1 &&
      (((v = ro(g)) == null ? void 0 : v.value) === "/"
        ? c === "never" && g.pop()
        : c === "always" && g.push({ type: "pathname", value: "/" }));
  const d = g.map((m) => {
      if (m.type === "param") {
        const b = m.value.substring(1);
        if (m.prefixSegment && m.suffixSegment)
          return `${m.prefixSegment}{$${b}}${m.suffixSegment}`;
        if (m.prefixSegment) return `${m.prefixSegment}{$${b}}`;
        if (m.suffixSegment) return `{$${b}}${m.suffixSegment}`;
      }
      if (m.type === "wildcard") {
        if (m.prefixSegment && m.suffixSegment)
          return `${m.prefixSegment}{$}${m.suffixSegment}`;
        if (m.prefixSegment) return `${m.prefixSegment}{$}`;
        if (m.suffixSegment) return `{$}${m.suffixSegment}`;
      }
      return m.value;
    }),
    p = cn([l, ...d]);
  return Rs(p);
}
const bp = /^\$.{1,}$/,
  _p = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/,
  Ep = /^\$$/,
  Rp = /^(.*?)\{\$\}(.*)$/;
function jl(l) {
  if (!l) return [];
  l = Rs(l);
  const s = [];
  if (
    (l.slice(0, 1) === "/" &&
      ((l = l.substring(1)), s.push({ type: "pathname", value: "/" })),
    !l)
  )
    return s;
  const u = l.split("/").filter(Boolean);
  return (
    s.push(
      ...u.map((c) => {
        const f = c.match(Rp);
        if (f) {
          const v = f[1],
            g = f[2];
          return {
            type: "wildcard",
            value: "$",
            prefixSegment: v || void 0,
            suffixSegment: g || void 0,
          };
        }
        const h = c.match(_p);
        if (h) {
          const v = h[1],
            g = h[2],
            S = h[3];
          return {
            type: "param",
            value: "" + g,
            prefixSegment: v || void 0,
            suffixSegment: S || void 0,
          };
        }
        return bp.test(c)
          ? {
              type: "param",
              value: "$" + c.substring(1),
              prefixSegment: void 0,
              suffixSegment: void 0,
            }
          : Ep.test(c)
            ? {
                type: "wildcard",
                value: "$",
                prefixSegment: void 0,
                suffixSegment: void 0,
              }
            : {
                type: "pathname",
                value: c.includes("%25")
                  ? c
                      .split("%25")
                      .map((v) => decodeURI(v))
                      .join("%25")
                  : decodeURI(c),
              };
      }),
    ),
    l.slice(-1) === "/" &&
      ((l = l.substring(1)), s.push({ type: "pathname", value: "/" })),
    s
  );
}
function Fc({
  path: l,
  params: s,
  leaveWildcards: u,
  leaveParams: c,
  decodeCharMap: f,
}) {
  const h = jl(l);
  function v(p) {
    const m = s[p],
      b = typeof m == "string";
    return ["*", "_splat"].includes(p)
      ? b
        ? encodeURI(m)
        : m
      : b
        ? Tp(m, f)
        : m;
  }
  let g = !1;
  const S = {},
    d = cn(
      h.map((p) => {
        if (p.type === "wildcard") {
          S._splat = s._splat;
          const m = p.prefixSegment || "",
            b = p.suffixSegment || "",
            x = v("_splat");
          return u ? `${m}${p.value}${x ?? ""}${b}` : `${m}${x}${b}`;
        }
        if (p.type === "param") {
          const m = p.value.substring(1);
          !g && !(m in s) && (g = !0), (S[m] = s[m]);
          const b = p.prefixSegment || "",
            x = p.suffixSegment || "";
          if (c) {
            const M = v(p.value);
            return `${b}${p.value}${M ?? ""}${x}`;
          }
          return `${b}${v(m) ?? "undefined"}${x}`;
        }
        return p.value;
      }),
    );
  return { usedParams: S, interpolatedPath: d, isMissingParams: g };
}
function Tp(l, s) {
  let u = encodeURIComponent(l);
  if (s) for (const [c, f] of s) u = u.replaceAll(c, f);
  return u;
}
function oo(l, s, u) {
  const c = Mp(l, s, u);
  if (!(u.to && !c)) return c ?? {};
}
function gs(l, s, u = !1) {
  const c = u ? l : l.toLowerCase(),
    f = u ? s : s.toLowerCase();
  switch (!0) {
    case c === "/":
      return s;
    case f === c:
      return "";
    case s.length < l.length:
      return s;
    case f[c.length] !== "/":
      return s;
    case f.startsWith(c):
      return s.slice(l.length);
    default:
      return s;
  }
}
function Mp(l, s, u) {
  if (l !== "/" && !s.startsWith(l)) return;
  s = gs(l, s, u.caseSensitive);
  const c = gs(l, `${u.to ?? "$"}`, u.caseSensitive),
    f = jl(s),
    h = jl(c);
  s.startsWith("/") || f.unshift({ type: "pathname", value: "/" }),
    c.startsWith("/") || h.unshift({ type: "pathname", value: "/" });
  const v = {};
  return (() => {
    var S;
    for (let d = 0; d < Math.max(f.length, h.length); d++) {
      const p = f[d],
        m = h[d],
        b = d >= f.length - 1,
        x = d >= h.length - 1;
      if (m) {
        if (m.type === "wildcard") {
          const M = f.slice(d);
          let U;
          if (m.prefixSegment || m.suffixSegment) {
            if (!p) return !1;
            const L = m.prefixSegment || "",
              q = m.suffixSegment || "",
              K = p.value;
            if (
              ("prefixSegment" in m && !K.startsWith(L)) ||
              ("suffixSegment" in m &&
                !((S = f[f.length - 1]) != null && S.value.endsWith(q)))
            )
              return !1;
            let V = decodeURI(cn(M.map((I) => I.value)));
            L && V.startsWith(L) && (V = V.slice(L.length)),
              q && V.endsWith(q) && (V = V.slice(0, V.length - q.length)),
              (U = V);
          } else U = decodeURI(cn(M.map((L) => L.value)));
          return (v["*"] = U), (v._splat = U), !0;
        }
        if (m.type === "pathname") {
          if (m.value === "/" && !(p != null && p.value)) return !0;
          if (p) {
            if (u.caseSensitive) {
              if (m.value !== p.value) return !1;
            } else if (m.value.toLowerCase() !== p.value.toLowerCase())
              return !1;
          }
        }
        if (!p) return !1;
        if (m.type === "param") {
          if (p.value === "/") return !1;
          let M;
          if (m.prefixSegment || m.suffixSegment) {
            const U = m.prefixSegment || "",
              L = m.suffixSegment || "",
              q = p.value;
            if ((U && !q.startsWith(U)) || (L && !q.endsWith(L))) return !1;
            let K = q;
            U && K.startsWith(U) && (K = K.slice(U.length)),
              L && K.endsWith(L) && (K = K.slice(0, K.length - L.length)),
              (M = decodeURIComponent(K));
          } else M = decodeURIComponent(p.value);
          v[m.value.substring(1)] = M;
        }
      }
      if (!b && x)
        return (
          (v["**"] = cn(f.slice(d + 1).map((M) => M.value))),
          !!u.fuzzy && (m == null ? void 0 : m.value) !== "/"
        );
    }
    return !0;
  })()
    ? v
    : void 0;
}
function Xe(l) {
  return !!(l != null && l.isNotFound);
}
function Op() {
  try {
    if (typeof window < "u" && typeof window.sessionStorage == "object")
      return window.sessionStorage;
  } catch {
    return;
  }
}
const Ss = "tsr-scroll-restoration-v1_3",
  Ap = (l, s) => {
    let u;
    return (...c) => {
      u ||
        (u = setTimeout(() => {
          l(...c), (u = null);
        }, s));
    };
  };
function xp() {
  const l = Op();
  if (!l) return;
  const s = l.getItem(Ss);
  let u = s ? JSON.parse(s) : {};
  return {
    state: u,
    set: (c) => ((u = Ua(c, u) || u), l.setItem(Ss, JSON.stringify(u))),
  };
}
const Pc = xp(),
  fo = (l) => l.state.key || l.href;
function Dp(l) {
  const s = [];
  let u;
  for (; (u = l.parentNode); )
    s.unshift(`${l.tagName}:nth-child(${[].indexOf.call(u.children, l) + 1})`),
      (l = u);
  return `${s.join(" > ")}`.toLowerCase();
}
let bs = !1;
function yv(l, s, u, c, f) {
  var h;
  let v;
  try {
    v = JSON.parse(sessionStorage.getItem(l) || "{}");
  } catch (d) {
    console.error(d);
    return;
  }
  const g = s || ((h = window.history.state) == null ? void 0 : h.key),
    S = v[g];
  (bs = !0),
    (() => {
      if (c && S) {
        for (const p in S) {
          const m = S[p];
          if (p === "window")
            window.scrollTo({ top: m.scrollY, left: m.scrollX, behavior: u });
          else if (p) {
            const b = document.querySelector(p);
            b && ((b.scrollLeft = m.scrollX), (b.scrollTop = m.scrollY));
          }
        }
        return;
      }
      const d = window.location.hash.split("#")[1];
      if (d) {
        const p =
          (window.history.state || {}).__hashScrollIntoViewOptions ?? !0;
        if (p) {
          const m = document.getElementById(d);
          m && m.scrollIntoView(p);
        }
        return;
      }
      [
        "window",
        ...((f == null ? void 0 : f.filter((p) => p !== "window")) ?? []),
      ].forEach((p) => {
        const m =
          p === "window"
            ? window
            : typeof p == "function"
              ? p()
              : document.querySelector(p);
        m && m.scrollTo({ top: 0, left: 0, behavior: u });
      });
    })(),
    (bs = !1);
}
function Cp(l, s) {
  if (
    Pc === void 0 ||
    ((l.options.scrollRestoration ?? !1) && (l.isScrollRestoring = !0),
    typeof document > "u" || l.isScrollRestorationSetup)
  )
    return;
  (l.isScrollRestorationSetup = !0), (bs = !1);
  const c = l.options.getScrollRestorationKey || fo;
  window.history.scrollRestoration = "manual";
  const f = (h) => {
    if (bs || !l.isScrollRestoring) return;
    let v = "";
    if (h.target === document || h.target === window) v = "window";
    else {
      const S = h.target.getAttribute("data-scroll-restoration-id");
      S ? (v = `[data-scroll-restoration-id="${S}"]`) : (v = Dp(h.target));
    }
    const g = c(l.state.location);
    Pc.set((S) => {
      const d = (S[g] = S[g] || {}),
        p = (d[v] = d[v] || {});
      if (v === "window")
        (p.scrollX = window.scrollX || 0), (p.scrollY = window.scrollY || 0);
      else if (v) {
        const m = document.querySelector(v);
        m && ((p.scrollX = m.scrollLeft || 0), (p.scrollY = m.scrollTop || 0));
      }
      return S;
    });
  };
  typeof document < "u" && document.addEventListener("scroll", Ap(f, 100), !0),
    l.subscribe("onRendered", (h) => {
      const v = c(h.toLocation);
      if (!l.resetNextScroll) {
        l.resetNextScroll = !0;
        return;
      }
      yv(
        Ss,
        v,
        l.options.scrollRestorationBehavior || void 0,
        l.isScrollRestoring || void 0,
        l.options.scrollToTopSelectors || void 0,
      ),
        l.isScrollRestoring && Pc.set((g) => ((g[v] = g[v] || {}), g));
    });
}
function zp(l) {
  if (typeof document < "u" && document.querySelector) {
    const s = l.state.location.state.__hashScrollIntoViewOptions ?? !0;
    if (s && l.state.location.hash !== "") {
      const u = document.getElementById(l.state.location.hash);
      u && u.scrollIntoView(s);
    }
  }
}
function Up(l, s) {
  const u = Object.entries(l).flatMap(([f, h]) =>
    Array.isArray(h) ? h.map((v) => [f, String(v)]) : [[f, String(h)]],
  );
  return "" + new URLSearchParams(u).toString();
}
function $c(l) {
  return l
    ? l === "false"
      ? !1
      : l === "true"
        ? !0
        : +l * 0 === 0 && +l + "" === l
          ? +l
          : l
    : "";
}
function wp(l, s) {
  const u = l;
  return [...new URLSearchParams(u).entries()].reduce((h, [v, g]) => {
    const S = h[v];
    return (
      S == null
        ? (h[v] = $c(g))
        : (h[v] = Array.isArray(S) ? [...S, $c(g)] : [S, $c(g)]),
      h
    );
  }, {});
}
const Np = Hp(JSON.parse),
  Lp = jp(JSON.stringify, JSON.parse);
function Hp(l) {
  return (s) => {
    s.substring(0, 1) === "?" && (s = s.substring(1));
    const u = wp(s);
    for (const c in u) {
      const f = u[c];
      if (typeof f == "string")
        try {
          u[c] = l(f);
        } catch {}
    }
    return u;
  };
}
function jp(l, s) {
  function u(c) {
    if (typeof c == "object" && c !== null)
      try {
        return l(c);
      } catch {}
    else if (typeof c == "string" && typeof s == "function")
      try {
        return s(c), l(c);
      } catch {}
    return c;
  }
  return (c) => {
    (c = { ...c }),
      Object.keys(c).forEach((h) => {
        const v = c[h];
        typeof v > "u" || v === void 0 ? delete c[h] : (c[h] = u(v));
      });
    const f = Up(c).toString();
    return f ? `?${f}` : "";
  };
}
const We = "__root__";
function Bp(l) {
  if (((l.statusCode = l.statusCode || l.code || 307), !l.reloadDocument))
    try {
      new URL(`${l.href}`), (l.reloadDocument = !0);
    } catch {}
  const s = new Headers(l.headers || {});
  l.href && s.get("Location") === null && s.set("Location", l.href);
  const u = new Response(null, { status: l.statusCode, headers: s });
  if (((u.options = l), l.throw)) throw u;
  return u;
}
function Ye(l) {
  return l instanceof Response && !!l.options;
}
function qp(l) {
  return l instanceof Error
    ? { name: l.name, message: l.message }
    : { data: l };
}
function wa(l) {
  const s = l.resolvedLocation,
    u = l.location,
    c = (s == null ? void 0 : s.pathname) !== u.pathname,
    f = (s == null ? void 0 : s.href) !== u.href,
    h = (s == null ? void 0 : s.hash) !== u.hash;
  return {
    fromLocation: s,
    toLocation: u,
    pathChanged: c,
    hrefChanged: f,
    hashChanged: h,
  };
}
class Qp {
  constructor(s) {
    (this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`),
      (this.resetNextScroll = !0),
      (this.shouldViewTransition = void 0),
      (this.isViewTransitionTypesSupported = void 0),
      (this.subscribers = new Set()),
      (this.isScrollRestoring = !1),
      (this.isScrollRestorationSetup = !1),
      (this.startTransition = (u) => u()),
      (this.isShell = !1),
      (this.update = (u) => {
        var c;
        u.notFoundRoute &&
          console.warn(
            "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.",
          );
        const f = this.options;
        (this.options = { ...this.options, ...u }),
          (this.isServer = this.options.isServer ?? typeof document > "u"),
          (this.pathParamsDecodeCharMap = this.options
            .pathParamsAllowedCharacters
            ? new Map(
                this.options.pathParamsAllowedCharacters.map((h) => [
                  encodeURIComponent(h),
                  h,
                ]),
              )
            : void 0),
          (!this.basepath || (u.basepath && u.basepath !== f.basepath)) &&
            (u.basepath === void 0 || u.basepath === "" || u.basepath === "/"
              ? (this.basepath = "/")
              : (this.basepath = `/${kc(u.basepath)}`)),
          (!this.history ||
            (this.options.history && this.options.history !== this.history)) &&
            ((this.history =
              this.options.history ??
              (this.isServer
                ? vp({ initialEntries: [this.basepath || "/"] })
                : yp())),
            (this.latestLocation = this.parseLocation())),
          this.options.routeTree !== this.routeTree &&
            ((this.routeTree = this.options.routeTree), this.buildRouteTree()),
          this.__store ||
            ((this.__store = new uo(Yp(this.latestLocation), {
              onUpdate: () => {
                this.__store.state = {
                  ...this.state,
                  cachedMatches: this.state.cachedMatches.filter(
                    (h) => !["redirected"].includes(h.status),
                  ),
                };
              },
            })),
            Cp(this)),
          typeof window < "u" &&
            "CSS" in window &&
            typeof ((c = window.CSS) == null ? void 0 : c.supports) ==
              "function" &&
            (this.isViewTransitionTypesSupported = window.CSS.supports(
              "selector(:active-view-transition-type(a)",
            )),
          this.latestLocation.search.__TSS_SHELL && (this.isShell = !0);
      }),
      (this.buildRouteTree = () => {
        const {
          routesById: u,
          routesByPath: c,
          flatRoutes: f,
        } = Vp({
          routeTree: this.routeTree,
          initRoute: (v, g) => {
            v.init({ originalIndex: g, defaultSsr: this.options.defaultSsr });
          },
        });
        (this.routesById = u), (this.routesByPath = c), (this.flatRoutes = f);
        const h = this.options.notFoundRoute;
        h &&
          (h.init({
            originalIndex: 99999999999,
            defaultSsr: this.options.defaultSsr,
          }),
          (this.routesById[h.id] = h));
      }),
      (this.subscribe = (u, c) => {
        const f = { eventType: u, fn: c };
        return (
          this.subscribers.add(f),
          () => {
            this.subscribers.delete(f);
          }
        );
      }),
      (this.emit = (u) => {
        this.subscribers.forEach((c) => {
          c.eventType === u.type && c.fn(u);
        });
      }),
      (this.parseLocation = (u, c) => {
        const f = ({ pathname: S, search: d, hash: p, state: m }) => {
            const b = this.options.parseSearch(d),
              x = this.options.stringifySearch(b);
            return {
              pathname: S,
              searchStr: x,
              search: Ge(u == null ? void 0 : u.search, b),
              hash: p.split("#").reverse()[0] ?? "",
              href: `${S}${x}${p}`,
              state: Ge(u == null ? void 0 : u.state, m),
            };
          },
          h = f(c ?? this.history.location),
          { __tempLocation: v, __tempKey: g } = h.state;
        if (v && (!g || g === this.tempLocationKey)) {
          const S = f(v);
          return (
            (S.state.key = h.state.key),
            delete S.state.__tempLocation,
            { ...S, maskedLocation: h }
          );
        }
        return h;
      }),
      (this.resolvePathWithBase = (u, c) =>
        Sp({
          basepath: this.basepath,
          base: u,
          to: Rs(c),
          trailingSlash: this.options.trailingSlash,
          caseSensitive: this.options.caseSensitive,
        })),
      (this.matchRoutes = (u, c, f) =>
        typeof u == "string"
          ? this.matchRoutesInternal({ pathname: u, search: c }, f)
          : this.matchRoutesInternal(u, c)),
      (this.getMatchedRoutes = (u, c) =>
        Xp({
          pathname: u,
          routePathname: c,
          basepath: this.basepath,
          caseSensitive: this.options.caseSensitive,
          routesByPath: this.routesByPath,
          routesById: this.routesById,
          flatRoutes: this.flatRoutes,
        })),
      (this.cancelMatch = (u) => {
        const c = this.getMatch(u);
        c && (c.abortController.abort(), clearTimeout(c.pendingTimeout));
      }),
      (this.cancelMatches = () => {
        var u;
        (u = this.state.pendingMatches) == null ||
          u.forEach((c) => {
            this.cancelMatch(c.id);
          });
      }),
      (this.buildLocation = (u) => {
        const c = (h = {}) => {
            var v;
            const g = h._fromLocation || this.latestLocation,
              S = this.matchRoutes(g, { _buildLocation: !0 }),
              d = ro(S);
            let p = d.fullPath;
            h.unsafeRelative === "path"
              ? (p = g.pathname)
              : h.to &&
                h.from &&
                ((p = h.from),
                [...S]
                  .reverse()
                  .find(
                    (F) => F.fullPath === p || F.fullPath === cn([p, "/"]),
                  ) ||
                  console.warn(`Could not find match for from: ${h.from}`));
            const m = d.search,
              b = { ...d.params },
              x = h.to ? this.resolvePathWithBase(p, `${h.to}`) : p;
            let M = (h.params ?? !0) === !0 ? b : { ...b, ...Ua(h.params, b) };
            const U = this.matchRoutes(x, {}, { _buildLocation: !0 }).map(
              (Y) => this.looseRoutesById[Y.routeId],
            );
            Object.keys(M).length > 0 &&
              U.map((Y) => {
                var F;
                return (
                  ((F = Y.options.params) == null ? void 0 : F.stringify) ??
                  Y.options.stringifyParams
                );
              })
                .filter(Boolean)
                .forEach((Y) => {
                  M = { ...M, ...Y(M) };
                });
            const L = Fc({
              path: x,
              params: M ?? {},
              leaveWildcards: !1,
              leaveParams: u.leaveParams,
              decodeCharMap: this.pathParamsDecodeCharMap,
            }).interpolatedPath;
            let q = m;
            if (
              u._includeValidateSearch &&
              (v = this.options.search) != null &&
              v.strict
            ) {
              let Y = {};
              U.forEach((F) => {
                try {
                  F.options.validateSearch &&
                    (Y = {
                      ...Y,
                      ...(ho(F.options.validateSearch, { ...Y, ...q }) ?? {}),
                    });
                } catch {}
              }),
                (q = Y);
            }
            (q = Kp({
              search: q,
              dest: h,
              destRoutes: U,
              _includeValidateSearch: u._includeValidateSearch,
            })),
              (q = Ge(m, q));
            const K = this.options.stringifySearch(q),
              V = h.hash === !0 ? g.hash : h.hash ? Ua(h.hash, g.hash) : void 0,
              I = V ? `#${V}` : "";
            let P =
              h.state === !0 ? g.state : h.state ? Ua(h.state, g.state) : {};
            return (
              (P = Ge(g.state, P)),
              {
                pathname: L,
                search: q,
                searchStr: K,
                state: P,
                hash: V ?? "",
                href: `${L}${K}${I}`,
                unmaskOnReload: h.unmaskOnReload,
              }
            );
          },
          f = (h = {}, v) => {
            var g;
            const S = c(h);
            let d = v ? c(v) : void 0;
            if (!d) {
              let p = {};
              const m =
                (g = this.options.routeMasks) == null
                  ? void 0
                  : g.find((b) => {
                      const x = oo(this.basepath, S.pathname, {
                        to: b.from,
                        caseSensitive: !1,
                        fuzzy: !1,
                      });
                      return x ? ((p = x), !0) : !1;
                    });
              if (m) {
                const { from: b, ...x } = m;
                (v = { ...co(u, ["from"]), ...x, params: p }), (d = c(v));
              }
            }
            if (d) {
              const p = c(v);
              S.maskedLocation = p;
            }
            return S;
          };
        return u.mask ? f(u, { ...co(u, ["from"]), ...u.mask }) : f(u);
      }),
      (this.commitLocation = ({
        viewTransition: u,
        ignoreBlocker: c,
        ...f
      }) => {
        const h = () => {
            const S = ["key", "__TSR_index", "__hashScrollIntoViewOptions"];
            S.forEach((p) => {
              f.state[p] = this.latestLocation.state[p];
            });
            const d = Ol(f.state, this.latestLocation.state);
            return (
              S.forEach((p) => {
                delete f.state[p];
              }),
              d
            );
          },
          v = this.latestLocation.href === f.href,
          g = this.commitLocationPromise;
        if (
          ((this.commitLocationPromise = El(() => {
            g == null || g.resolve();
          })),
          v && h())
        )
          this.load();
        else {
          let { maskedLocation: S, hashScrollIntoView: d, ...p } = f;
          S &&
            ((p = {
              ...S,
              state: {
                ...S.state,
                __tempKey: void 0,
                __tempLocation: {
                  ...p,
                  search: p.searchStr,
                  state: {
                    ...p.state,
                    __tempKey: void 0,
                    __tempLocation: void 0,
                    key: void 0,
                  },
                },
              },
            }),
            (p.unmaskOnReload ?? this.options.unmaskOnReload ?? !1) &&
              (p.state.__tempKey = this.tempLocationKey)),
            (p.state.__hashScrollIntoViewOptions =
              d ?? this.options.defaultHashScrollIntoView ?? !0),
            (this.shouldViewTransition = u),
            this.history[f.replace ? "replace" : "push"](p.href, p.state, {
              ignoreBlocker: c,
            });
        }
        return (
          (this.resetNextScroll = f.resetScroll ?? !0),
          this.history.subscribers.size || this.load(),
          this.commitLocationPromise
        );
      }),
      (this.buildAndCommitLocation = ({
        replace: u,
        resetScroll: c,
        hashScrollIntoView: f,
        viewTransition: h,
        ignoreBlocker: v,
        href: g,
        ...S
      } = {}) => {
        if (g) {
          const p = this.history.location.state.__TSR_index,
            m = Vi(g, { __TSR_index: u ? p : p + 1 });
          (S.to = m.pathname),
            (S.search = this.options.parseSearch(m.search)),
            (S.hash = m.hash.slice(1));
        }
        const d = this.buildLocation({ ...S, _includeValidateSearch: !0 });
        return this.commitLocation({
          ...d,
          viewTransition: h,
          replace: u,
          resetScroll: c,
          hashScrollIntoView: f,
          ignoreBlocker: v,
        });
      }),
      (this.navigate = ({ to: u, reloadDocument: c, href: f, ...h }) => {
        if (!c && f)
          try {
            new URL(`${f}`), (c = !0);
          } catch {}
        if (c) {
          if (!f) {
            const v = this.buildLocation({ to: u, ...h });
            f = this.history.createHref(v.href);
          }
          h.replace ? window.location.replace(f) : (window.location.href = f);
          return;
        }
        return this.buildAndCommitLocation({ ...h, href: f, to: u });
      }),
      (this.beforeLoad = () => {
        if (
          (this.cancelMatches(),
          (this.latestLocation = this.parseLocation(this.latestLocation)),
          this.isServer)
        ) {
          const c = this.buildLocation({
            to: this.latestLocation.pathname,
            search: !0,
            params: !0,
            hash: !0,
            state: !0,
            _includeValidateSearch: !0,
          });
          if (kc(this.latestLocation.href) !== kc(c.href))
            throw Bp({ href: c.href });
        }
        const u = this.matchRoutes(this.latestLocation);
        this.__store.setState((c) => ({
          ...c,
          status: "pending",
          isLoading: !0,
          location: this.latestLocation,
          pendingMatches: u,
          cachedMatches: c.cachedMatches.filter(
            (f) => !u.find((h) => h.id === f.id),
          ),
        }));
      }),
      (this.load = async (u) => {
        let c, f, h;
        for (
          h = new Promise((v) => {
            this.startTransition(async () => {
              var g;
              try {
                this.beforeLoad();
                const S = this.latestLocation,
                  d = this.state.resolvedLocation;
                this.state.redirect ||
                  this.emit({
                    type: "onBeforeNavigate",
                    ...wa({ resolvedLocation: d, location: S }),
                  }),
                  this.emit({
                    type: "onBeforeLoad",
                    ...wa({ resolvedLocation: d, location: S }),
                  }),
                  await this.loadMatches({
                    sync: u == null ? void 0 : u.sync,
                    matches: this.state.pendingMatches,
                    location: S,
                    onReady: async () => {
                      this.startViewTransition(async () => {
                        let p, m, b;
                        zy(() => {
                          this.__store.setState((x) => {
                            const M = x.matches,
                              U = x.pendingMatches || x.matches;
                            return (
                              (p = M.filter(
                                (L) => !U.find((q) => q.id === L.id),
                              )),
                              (m = U.filter(
                                (L) => !M.find((q) => q.id === L.id),
                              )),
                              (b = M.filter((L) =>
                                U.find((q) => q.id === L.id),
                              )),
                              {
                                ...x,
                                isLoading: !1,
                                loadedAt: Date.now(),
                                matches: U,
                                pendingMatches: void 0,
                                cachedMatches: [
                                  ...x.cachedMatches,
                                  ...p.filter((L) => L.status !== "error"),
                                ],
                              }
                            );
                          }),
                            this.clearExpiredCache();
                        }),
                          [
                            [p, "onLeave"],
                            [m, "onEnter"],
                            [b, "onStay"],
                          ].forEach(([x, M]) => {
                            x.forEach((U) => {
                              var L, q;
                              (q = (L =
                                this.looseRoutesById[U.routeId].options)[M]) ==
                                null || q.call(L, U);
                            });
                          });
                      });
                    },
                  });
              } catch (S) {
                Ye(S)
                  ? ((c = S),
                    this.isServer ||
                      this.navigate({
                        ...c.options,
                        replace: !0,
                        ignoreBlocker: !0,
                      }))
                  : Xe(S) && (f = S),
                  this.__store.setState((d) => ({
                    ...d,
                    statusCode: c
                      ? c.status
                      : f
                        ? 404
                        : d.matches.some((p) => p.status === "error")
                          ? 500
                          : 200,
                    redirect: c,
                  }));
              }
              this.latestLoadPromise === h &&
                ((g = this.commitLocationPromise) == null || g.resolve(),
                (this.latestLoadPromise = void 0),
                (this.commitLocationPromise = void 0)),
                v();
            });
          }),
            this.latestLoadPromise = h,
            await h;
          this.latestLoadPromise && h !== this.latestLoadPromise;

        )
          await this.latestLoadPromise;
        this.hasNotFoundMatch() &&
          this.__store.setState((v) => ({ ...v, statusCode: 404 }));
      }),
      (this.startViewTransition = (u) => {
        const c =
          this.shouldViewTransition ?? this.options.defaultViewTransition;
        if (
          (delete this.shouldViewTransition,
          c &&
            typeof document < "u" &&
            "startViewTransition" in document &&
            typeof document.startViewTransition == "function")
        ) {
          let f;
          if (typeof c == "object" && this.isViewTransitionTypesSupported) {
            const h = this.latestLocation,
              v = this.state.resolvedLocation,
              g =
                typeof c.types == "function"
                  ? c.types(wa({ resolvedLocation: v, location: h }))
                  : c.types;
            f = { update: u, types: g };
          } else f = u;
          document.startViewTransition(f);
        } else u();
      }),
      (this.updateMatch = (u, c) => {
        var f;
        let h;
        const v =
            (f = this.state.pendingMatches) == null
              ? void 0
              : f.find((p) => p.id === u),
          g = this.state.matches.find((p) => p.id === u),
          S = this.state.cachedMatches.find((p) => p.id === u),
          d = v ? "pendingMatches" : g ? "matches" : S ? "cachedMatches" : "";
        return (
          d &&
            this.__store.setState((p) => {
              var m;
              return {
                ...p,
                [d]:
                  (m = p[d]) == null
                    ? void 0
                    : m.map((b) => (b.id === u ? (h = c(b)) : b)),
              };
            }),
          h
        );
      }),
      (this.getMatch = (u) =>
        [
          ...this.state.cachedMatches,
          ...(this.state.pendingMatches ?? []),
          ...this.state.matches,
        ].find((c) => c.id === u)),
      (this.loadMatches = async ({
        location: u,
        matches: c,
        preload: f,
        onReady: h,
        updateMatch: v = this.updateMatch,
        sync: g,
      }) => {
        let S,
          d = !1;
        const p = async () => {
            d || ((d = !0), await (h == null ? void 0 : h()));
          },
          m = (x) => !!(f && !this.state.matches.find((M) => M.id === x)),
          b = (x, M) => {
            var U, L, q, K;
            if (Ye(M) || Xe(M)) {
              if (Ye(M) && M.redirectHandled && !M.options.reloadDocument)
                throw M;
              if (
                ((U = x.beforeLoadPromise) == null || U.resolve(),
                (L = x.loaderPromise) == null || L.resolve(),
                v(x.id, (V) => ({
                  ...V,
                  status: Ye(M) ? "redirected" : Xe(M) ? "notFound" : "error",
                  isFetching: !1,
                  error: M,
                  beforeLoadPromise: void 0,
                  loaderPromise: void 0,
                })),
                M.routeId || (M.routeId = x.routeId),
                (q = x.loadPromise) == null || q.resolve(),
                Ye(M))
              )
                throw (
                  ((d = !0),
                  (M.options._fromLocation = u),
                  (M.redirectHandled = !0),
                  (M = this.resolveRedirect(M)),
                  M)
                );
              if (Xe(M))
                throw (
                  (this._handleNotFound(c, M, { updateMatch: v }),
                  (K = this.serverSsr) == null ||
                    K.onMatchSettled({
                      router: this,
                      match: this.getMatch(x.id),
                    }),
                  M)
                );
            }
          };
        try {
          await new Promise((x, M) => {
            (async () => {
              var U, L, q, K;
              try {
                const V = (Y, F, G) => {
                  var w, W;
                  const { id: rt, routeId: et } = c[Y],
                    dt = this.looseRoutesById[et];
                  if (F instanceof Promise) throw F;
                  (F.routerCode = G), (S = S ?? Y), b(this.getMatch(rt), F);
                  try {
                    (W = (w = dt.options).onError) == null || W.call(w, F);
                  } catch (pt) {
                    (F = pt), b(this.getMatch(rt), F);
                  }
                  v(rt, (pt) => {
                    var ht, C;
                    return (
                      (ht = pt.beforeLoadPromise) == null || ht.resolve(),
                      (C = pt.loadPromise) == null || C.resolve(),
                      {
                        ...pt,
                        error: F,
                        status: "error",
                        isFetching: !1,
                        updatedAt: Date.now(),
                        abortController: new AbortController(),
                        beforeLoadPromise: void 0,
                      }
                    );
                  });
                };
                for (const [Y, { id: F, routeId: G }] of c.entries()) {
                  const w = this.getMatch(F),
                    W = (U = c[Y - 1]) == null ? void 0 : U.id,
                    rt = this.looseRoutesById[G],
                    et = rt.options.pendingMs ?? this.options.defaultPendingMs,
                    dt = !!(
                      h &&
                      !this.isServer &&
                      !m(F) &&
                      (rt.options.loader || rt.options.beforeLoad || By(rt)) &&
                      typeof et == "number" &&
                      et !== 1 / 0 &&
                      (rt.options.pendingComponent ??
                        ((L = this.options) == null
                          ? void 0
                          : L.defaultPendingComponent))
                    );
                  let pt = !0;
                  if (
                    ((w.beforeLoadPromise || w.loaderPromise) &&
                      (dt &&
                        setTimeout(() => {
                          try {
                            p();
                          } catch {}
                        }, et),
                      await w.beforeLoadPromise,
                      (pt = this.getMatch(F).status === "error")),
                    pt)
                  ) {
                    try {
                      v(F, (St) => {
                        const it = St.loadPromise;
                        return {
                          ...St,
                          loadPromise: El(() => {
                            it == null || it.resolve();
                          }),
                          beforeLoadPromise: El(),
                        };
                      });
                      const ht = new AbortController();
                      let C;
                      dt &&
                        (C = setTimeout(() => {
                          try {
                            p();
                          } catch {}
                        }, et));
                      const { paramsError: X, searchError: at } =
                        this.getMatch(F);
                      X && V(Y, X, "PARSE_PARAMS"),
                        at && V(Y, at, "VALIDATE_SEARCH");
                      const gt = () =>
                        W
                          ? this.getMatch(W).context
                          : (this.options.context ?? {});
                      v(F, (St) => ({
                        ...St,
                        isFetching: "beforeLoad",
                        fetchCount: St.fetchCount + 1,
                        abortController: ht,
                        pendingTimeout: C,
                        context: { ...gt(), ...St.__routeContext },
                      }));
                      const {
                          search: E,
                          params: N,
                          context: k,
                          cause: J,
                        } = this.getMatch(F),
                        $ = m(F),
                        lt = {
                          search: E,
                          abortController: ht,
                          params: N,
                          preload: $,
                          context: k,
                          location: u,
                          navigate: (St) =>
                            this.navigate({ ...St, _fromLocation: u }),
                          buildLocation: this.buildLocation,
                          cause: $ ? "preload" : J,
                          matches: c,
                        },
                        tt =
                          (await ((K = (q = rt.options).beforeLoad) == null
                            ? void 0
                            : K.call(q, lt))) ?? {};
                      (Ye(tt) || Xe(tt)) && V(Y, tt, "BEFORE_LOAD"),
                        v(F, (St) => ({
                          ...St,
                          __beforeLoadContext: tt,
                          context: { ...gt(), ...St.__routeContext, ...tt },
                          abortController: ht,
                        }));
                    } catch (ht) {
                      V(Y, ht, "BEFORE_LOAD");
                    }
                    v(F, (ht) => {
                      var C;
                      return (
                        (C = ht.beforeLoadPromise) == null || C.resolve(),
                        { ...ht, beforeLoadPromise: void 0, isFetching: !1 }
                      );
                    });
                  }
                }
                const I = c.slice(0, S),
                  P = [];
                I.forEach(({ id: Y, routeId: F }, G) => {
                  P.push(
                    (async () => {
                      const { loaderPromise: w } = this.getMatch(Y);
                      let W = !1,
                        rt = !1;
                      if (w) {
                        await w;
                        const et = this.getMatch(Y);
                        et.error && b(et, et.error);
                      } else {
                        const et = P[G - 1],
                          dt = this.looseRoutesById[F],
                          pt = () => {
                            const {
                                params: $,
                                loaderDeps: lt,
                                abortController: tt,
                                context: St,
                                cause: it,
                              } = this.getMatch(Y),
                              bt = m(Y);
                            return {
                              params: $,
                              deps: lt,
                              preload: !!bt,
                              parentMatchPromise: et,
                              abortController: tt,
                              context: St,
                              location: u,
                              navigate: (Nt) =>
                                this.navigate({ ...Nt, _fromLocation: u }),
                              cause: bt ? "preload" : it,
                              route: dt,
                            };
                          },
                          ht = Date.now() - this.getMatch(Y).updatedAt,
                          C = m(Y),
                          X = C
                            ? (dt.options.preloadStaleTime ??
                              this.options.defaultPreloadStaleTime ??
                              3e4)
                            : (dt.options.staleTime ??
                              this.options.defaultStaleTime ??
                              0),
                          at = dt.options.shouldReload,
                          gt = typeof at == "function" ? at(pt()) : at;
                        v(Y, ($) => ({
                          ...$,
                          loaderPromise: El(),
                          preload:
                            !!C &&
                            !this.state.matches.find((lt) => lt.id === Y),
                        }));
                        const E = async () => {
                            var $, lt, tt, St, it, bt;
                            const Nt = this.getMatch(Y);
                            if (!Nt) return;
                            const Qt = {
                                matches: c,
                                match: Nt,
                                params: Nt.params,
                                loaderData: Nt.loaderData,
                              },
                              Bt = await ((lt = ($ = dt.options).head) == null
                                ? void 0
                                : lt.call($, Qt)),
                              ye = Bt == null ? void 0 : Bt.meta,
                              Ze = Bt == null ? void 0 : Bt.links,
                              xn = Bt == null ? void 0 : Bt.scripts,
                              ze = await ((St = (tt = dt.options).scripts) ==
                              null
                                ? void 0
                                : St.call(tt, Qt)),
                              Wt = await ((bt = (it = dt.options).headers) ==
                              null
                                ? void 0
                                : bt.call(it, Qt));
                            return {
                              meta: ye,
                              links: Ze,
                              headScripts: xn,
                              headers: Wt,
                              scripts: ze,
                            };
                          },
                          N = async () => {
                            var $, lt, tt, St, it;
                            try {
                              const bt = async () => {
                                const Nt = this.getMatch(Y);
                                Nt.minPendingPromise &&
                                  (await Nt.minPendingPromise);
                              };
                              try {
                                this.loadRouteChunk(dt),
                                  v(Y, (Bt) => ({
                                    ...Bt,
                                    isFetching: "loader",
                                  }));
                                const Nt = await ((lt = ($ = dt.options)
                                  .loader) == null
                                  ? void 0
                                  : lt.call($, pt()));
                                b(this.getMatch(Y), Nt),
                                  await dt._lazyPromise,
                                  await bt(),
                                  await dt._componentsPromise,
                                  v(Y, (Bt) => ({
                                    ...Bt,
                                    error: void 0,
                                    status: "success",
                                    isFetching: !1,
                                    updatedAt: Date.now(),
                                    loaderData: Nt,
                                  }));
                                const Qt = await E();
                                v(Y, (Bt) => ({ ...Bt, ...Qt }));
                              } catch (Nt) {
                                let Qt = Nt;
                                await bt(), b(this.getMatch(Y), Nt);
                                try {
                                  (St = (tt = dt.options).onError) == null ||
                                    St.call(tt, Nt);
                                } catch (ye) {
                                  (Qt = ye), b(this.getMatch(Y), ye);
                                }
                                const Bt = await E();
                                v(Y, (ye) => ({
                                  ...ye,
                                  error: Qt,
                                  status: "error",
                                  isFetching: !1,
                                  ...Bt,
                                }));
                              }
                              (it = this.serverSsr) == null ||
                                it.onMatchSettled({
                                  router: this,
                                  match: this.getMatch(Y),
                                });
                            } catch (bt) {
                              const Nt = await E();
                              v(Y, (Qt) => ({
                                ...Qt,
                                loaderPromise: void 0,
                                ...Nt,
                              })),
                                b(this.getMatch(Y), bt);
                            }
                          },
                          { status: k, invalid: J } = this.getMatch(Y);
                        if (
                          ((W = k === "success" && (J || (gt ?? ht > X))),
                          !(C && dt.options.preload === !1))
                        )
                          if (W && !g)
                            (rt = !0),
                              (async () => {
                                try {
                                  await N();
                                  const { loaderPromise: $, loadPromise: lt } =
                                    this.getMatch(Y);
                                  $ == null || $.resolve(),
                                    lt == null || lt.resolve(),
                                    v(Y, (tt) => ({
                                      ...tt,
                                      loaderPromise: void 0,
                                    }));
                                } catch ($) {
                                  Ye($) && (await this.navigate($.options));
                                }
                              })();
                          else if (k !== "success" || (W && g)) await N();
                          else {
                            const $ = await E();
                            v(Y, (lt) => ({ ...lt, ...$ }));
                          }
                      }
                      if (!rt) {
                        const { loaderPromise: et, loadPromise: dt } =
                          this.getMatch(Y);
                        et == null || et.resolve(), dt == null || dt.resolve();
                      }
                      return (
                        v(Y, (et) => ({
                          ...et,
                          isFetching: rt ? et.isFetching : !1,
                          loaderPromise: rt ? et.loaderPromise : void 0,
                          invalid: !1,
                        })),
                        this.getMatch(Y)
                      );
                    })(),
                  );
                }),
                  await Promise.all(P),
                  x();
              } catch (V) {
                M(V);
              }
            })();
          }),
            await p();
        } catch (x) {
          if (Ye(x) || Xe(x)) throw (Xe(x) && !f && (await p()), x);
        }
        return c;
      }),
      (this.invalidate = (u) => {
        const c = (f) => {
          var h;
          return (((h = u == null ? void 0 : u.filter) == null
            ? void 0
            : h.call(u, f)) ?? !0)
            ? {
                ...f,
                invalid: !0,
                ...(f.status === "error"
                  ? { status: "pending", error: void 0 }
                  : {}),
              }
            : f;
        };
        return (
          this.__store.setState((f) => {
            var h;
            return {
              ...f,
              matches: f.matches.map(c),
              cachedMatches: f.cachedMatches.map(c),
              pendingMatches:
                (h = f.pendingMatches) == null ? void 0 : h.map(c),
            };
          }),
          (this.shouldViewTransition = !1),
          this.load({ sync: u == null ? void 0 : u.sync })
        );
      }),
      (this.resolveRedirect = (u) => (
        u.options.href ||
          ((u.options.href = this.buildLocation(u.options).href),
          u.headers.set("Location", u.options.href)),
        u.headers.get("Location") || u.headers.set("Location", u.options.href),
        u
      )),
      (this.clearCache = (u) => {
        const c = u == null ? void 0 : u.filter;
        c !== void 0
          ? this.__store.setState((f) => ({
              ...f,
              cachedMatches: f.cachedMatches.filter((h) => !c(h)),
            }))
          : this.__store.setState((f) => ({ ...f, cachedMatches: [] }));
      }),
      (this.clearExpiredCache = () => {
        const u = (c) => {
          const f = this.looseRoutesById[c.routeId];
          if (!f.options.loader) return !0;
          const h =
            (c.preload
              ? (f.options.preloadGcTime ?? this.options.defaultPreloadGcTime)
              : (f.options.gcTime ?? this.options.defaultGcTime)) ??
            5 * 60 * 1e3;
          return !(c.status !== "error" && Date.now() - c.updatedAt < h);
        };
        this.clearCache({ filter: u });
      }),
      (this.loadRouteChunk = (u) => (
        u._lazyPromise === void 0 &&
          (u.lazyFn
            ? (u._lazyPromise = u.lazyFn().then((c) => {
                const { id: f, ...h } = c.options;
                Object.assign(u.options, h);
              }))
            : (u._lazyPromise = Promise.resolve())),
        u._componentsPromise === void 0 &&
          (u._componentsPromise = u._lazyPromise.then(() =>
            Promise.all(
              vv.map(async (c) => {
                const f = u.options[c];
                f != null && f.preload && (await f.preload());
              }),
            ),
          )),
        u._componentsPromise
      )),
      (this.preloadRoute = async (u) => {
        const c = this.buildLocation(u);
        let f = this.matchRoutes(c, { throwOnError: !0, preload: !0, dest: u });
        const h = new Set(
            [...this.state.matches, ...(this.state.pendingMatches ?? [])].map(
              (g) => g.id,
            ),
          ),
          v = new Set([...h, ...this.state.cachedMatches.map((g) => g.id)]);
        zy(() => {
          f.forEach((g) => {
            v.has(g.id) ||
              this.__store.setState((S) => ({
                ...S,
                cachedMatches: [...S.cachedMatches, g],
              }));
          });
        });
        try {
          return (
            (f = await this.loadMatches({
              matches: f,
              location: c,
              preload: !0,
              updateMatch: (g, S) => {
                h.has(g)
                  ? (f = f.map((d) => (d.id === g ? S(d) : d)))
                  : this.updateMatch(g, S);
              },
            })),
            f
          );
        } catch (g) {
          if (Ye(g))
            return g.options.reloadDocument
              ? void 0
              : await this.preloadRoute({ ...g.options, _fromLocation: c });
          Xe(g) || console.error(g);
          return;
        }
      }),
      (this.matchRoute = (u, c) => {
        const f = {
            ...u,
            to: u.to ? this.resolvePathWithBase(u.from || "", u.to) : void 0,
            params: u.params || {},
            leaveParams: !0,
          },
          h = this.buildLocation(f);
        if (c != null && c.pending && this.state.status !== "pending")
          return !1;
        const g = (
            (c == null ? void 0 : c.pending) === void 0
              ? !this.state.isLoading
              : c.pending
          )
            ? this.latestLocation
            : this.state.resolvedLocation || this.state.location,
          S = oo(this.basepath, g.pathname, { ...c, to: h.pathname });
        return !S || (u.params && !Ol(S, u.params, { partial: !0 }))
          ? !1
          : S && ((c == null ? void 0 : c.includeSearch) ?? !0)
            ? Ol(g.search, h.search, { partial: !0 })
              ? S
              : !1
            : S;
      }),
      (this._handleNotFound = (
        u,
        c,
        { updateMatch: f = this.updateMatch } = {},
      ) => {
        var h;
        const v = this.routesById[c.routeId ?? ""] ?? this.routeTree,
          g = {};
        for (const d of u) g[d.routeId] = d;
        !v.options.notFoundComponent &&
          (h = this.options) != null &&
          h.defaultNotFoundComponent &&
          (v.options.notFoundComponent = this.options.defaultNotFoundComponent),
          on(v.options.notFoundComponent);
        const S = g[v.id];
        on(S, "Could not find match for route: " + v.id),
          f(S.id, (d) => ({
            ...d,
            status: "notFound",
            error: c,
            isFetching: !1,
          })),
          c.routerCode === "BEFORE_LOAD" &&
            v.parentRoute &&
            ((c.routeId = v.parentRoute.id),
            this._handleNotFound(u, c, { updateMatch: f }));
      }),
      (this.hasNotFoundMatch = () =>
        this.__store.state.matches.some(
          (u) => u.status === "notFound" || u.globalNotFound,
        )),
      this.update({
        defaultPreloadDelay: 50,
        defaultPendingMs: 1e3,
        defaultPendingMinMs: 500,
        context: void 0,
        ...s,
        caseSensitive: s.caseSensitive ?? !1,
        notFoundMode: s.notFoundMode ?? "fuzzy",
        stringifySearch: s.stringifySearch ?? Lp,
        parseSearch: s.parseSearch ?? Np,
      }),
      typeof document < "u" && (window.__TSR_ROUTER__ = this);
  }
  get state() {
    return this.__store.state;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  matchRoutesInternal(s, u) {
    var c;
    const {
      foundRoute: f,
      matchedRoutes: h,
      routeParams: v,
    } = this.getMatchedRoutes(
      s.pathname,
      (c = u == null ? void 0 : u.dest) == null ? void 0 : c.to,
    );
    let g = !1;
    (f ? f.path !== "/" && v["**"] : Hl(s.pathname)) &&
      (this.options.notFoundRoute
        ? h.push(this.options.notFoundRoute)
        : (g = !0));
    const S = (() => {
        if (g) {
          if (this.options.notFoundMode !== "root")
            for (let b = h.length - 1; b >= 0; b--) {
              const x = h[b];
              if (x.children) return x.id;
            }
          return We;
        }
      })(),
      d = h.map((b) => {
        var x;
        let M;
        const U =
          ((x = b.options.params) == null ? void 0 : x.parse) ??
          b.options.parseParams;
        if (U)
          try {
            const L = U(v);
            Object.assign(v, L);
          } catch (L) {
            if (
              ((M = new Gp(L.message, { cause: L })),
              u != null && u.throwOnError)
            )
              throw M;
            return M;
          }
      }),
      p = [],
      m = (b) =>
        (b == null ? void 0 : b.id)
          ? (b.context ?? this.options.context ?? {})
          : (this.options.context ?? {});
    return (
      h.forEach((b, x) => {
        var M, U;
        const L = p[x - 1],
          [q, K, V] = (() => {
            const pt = (L == null ? void 0 : L.search) ?? s.search,
              ht = (L == null ? void 0 : L._strictSearch) ?? {};
            try {
              const C = ho(b.options.validateSearch, { ...pt }) ?? {};
              return [{ ...pt, ...C }, { ...ht, ...C }, void 0];
            } catch (C) {
              let X = C;
              if (
                (C instanceof _s || (X = new _s(C.message, { cause: C })),
                u != null && u.throwOnError)
              )
                throw X;
              return [pt, {}, X];
            }
          })(),
          I =
            ((U = (M = b.options).loaderDeps) == null
              ? void 0
              : U.call(M, { search: q })) ?? "",
          P = I ? JSON.stringify(I) : "",
          { usedParams: Y, interpolatedPath: F } = Fc({
            path: b.fullPath,
            params: v,
            decodeCharMap: this.pathParamsDecodeCharMap,
          }),
          G =
            Fc({
              path: b.id,
              params: v,
              leaveWildcards: !0,
              decodeCharMap: this.pathParamsDecodeCharMap,
            }).interpolatedPath + P,
          w = this.getMatch(G),
          W = this.state.matches.find((pt) => pt.routeId === b.id),
          rt = W ? "stay" : "enter";
        let et;
        if (w)
          et = {
            ...w,
            cause: rt,
            params: W ? Ge(W.params, v) : v,
            _strictParams: Y,
            search: Ge(W ? W.search : w.search, q),
            _strictSearch: K,
          };
        else {
          const pt =
            b.options.loader || b.options.beforeLoad || b.lazyFn || By(b)
              ? "pending"
              : "success";
          et = {
            id: G,
            index: x,
            routeId: b.id,
            params: W ? Ge(W.params, v) : v,
            _strictParams: Y,
            pathname: cn([this.basepath, F]),
            updatedAt: Date.now(),
            search: W ? Ge(W.search, q) : q,
            _strictSearch: K,
            searchError: void 0,
            status: pt,
            isFetching: !1,
            error: void 0,
            paramsError: d[x],
            __routeContext: {},
            __beforeLoadContext: {},
            context: {},
            abortController: new AbortController(),
            fetchCount: 0,
            cause: rt,
            loaderDeps: W ? Ge(W.loaderDeps, I) : I,
            invalid: !1,
            preload: !1,
            links: void 0,
            scripts: void 0,
            headScripts: void 0,
            meta: void 0,
            staticData: b.options.staticData || {},
            loadPromise: El(),
            fullPath: b.fullPath,
          };
        }
        (u != null && u.preload) || (et.globalNotFound = S === b.id),
          (et.searchError = V);
        const dt = m(L);
        (et.context = {
          ...dt,
          ...et.__routeContext,
          ...et.__beforeLoadContext,
        }),
          p.push(et);
      }),
      p.forEach((b, x) => {
        var M, U;
        const L = this.looseRoutesById[b.routeId];
        if (
          !this.getMatch(b.id) &&
          (u == null ? void 0 : u._buildLocation) !== !0
        ) {
          const K = p[x - 1],
            V = m(K),
            I = {
              deps: b.loaderDeps,
              params: b.params,
              context: V,
              location: s,
              navigate: (P) => this.navigate({ ...P, _fromLocation: s }),
              buildLocation: this.buildLocation,
              cause: b.cause,
              abortController: b.abortController,
              preload: !!b.preload,
              matches: p,
            };
          (b.__routeContext =
            ((U = (M = L.options).context) == null ? void 0 : U.call(M, I)) ??
            {}),
            (b.context = {
              ...V,
              ...b.__routeContext,
              ...b.__beforeLoadContext,
            });
        }
      }),
      p
    );
  }
}
class _s extends Error {}
class Gp extends Error {}
function Yp(l) {
  return {
    loadedAt: 0,
    isLoading: !1,
    isTransitioning: !1,
    status: "idle",
    resolvedLocation: void 0,
    location: l,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200,
  };
}
function ho(l, s) {
  if (l == null) return {};
  if ("~standard" in l) {
    const u = l["~standard"].validate(s);
    if (u instanceof Promise) throw new _s("Async validation not supported");
    if (u.issues)
      throw new _s(JSON.stringify(u.issues, void 0, 2), { cause: u });
    return u.value;
  }
  return "parse" in l ? l.parse(s) : typeof l == "function" ? l(s) : {};
}
const vv = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent",
];
function By(l) {
  var s;
  for (const u of vv) if ((s = l.options[u]) != null && s.preload) return !0;
  return !1;
}
function Vp({ routeTree: l, initRoute: s }) {
  const u = {},
    c = {},
    f = (S) => {
      S.forEach((d, p) => {
        s == null || s(d, p);
        const m = u[d.id];
        if (
          (on(!m, `Duplicate routes found with id: ${String(d.id)}`),
          (u[d.id] = d),
          !d.isRoot && d.path)
        ) {
          const x = Hl(d.fullPath);
          (!c[x] || d.fullPath.endsWith("/")) && (c[x] = d);
        }
        const b = d.children;
        b != null && b.length && f(b);
      });
    };
  f([l]);
  const h = [];
  Object.values(u).forEach((S, d) => {
    var p;
    if (S.isRoot || !S.path) return;
    const m = bo(S.fullPath),
      b = jl(m);
    for (; b.length > 1 && ((p = b[0]) == null ? void 0 : p.value) === "/"; )
      b.shift();
    const x = b.map((M) =>
      M.value === "/"
        ? 0.75
        : M.type === "param" && M.prefixSegment && M.suffixSegment
          ? 0.55
          : M.type === "param" && M.prefixSegment
            ? 0.52
            : M.type === "param" && M.suffixSegment
              ? 0.51
              : M.type === "param"
                ? 0.5
                : M.type === "wildcard" && M.prefixSegment && M.suffixSegment
                  ? 0.3
                  : M.type === "wildcard" && M.prefixSegment
                    ? 0.27
                    : M.type === "wildcard" && M.suffixSegment
                      ? 0.26
                      : M.type === "wildcard"
                        ? 0.25
                        : 1,
    );
    h.push({ child: S, trimmed: m, parsed: b, index: d, scores: x });
  });
  const g = h
    .sort((S, d) => {
      const p = Math.min(S.scores.length, d.scores.length);
      for (let m = 0; m < p; m++)
        if (S.scores[m] !== d.scores[m]) return d.scores[m] - S.scores[m];
      if (S.scores.length !== d.scores.length)
        return d.scores.length - S.scores.length;
      for (let m = 0; m < p; m++)
        if (S.parsed[m].value !== d.parsed[m].value)
          return S.parsed[m].value > d.parsed[m].value ? 1 : -1;
      return S.index - d.index;
    })
    .map((S, d) => ((S.child.rank = d), S.child));
  return { routesById: u, routesByPath: c, flatRoutes: g };
}
function Xp({
  pathname: l,
  routePathname: s,
  basepath: u,
  caseSensitive: c,
  routesByPath: f,
  routesById: h,
  flatRoutes: v,
}) {
  let g = {};
  const S = Hl(l),
    d = (x) => {
      var M;
      return oo(u, S, {
        to: x.fullPath,
        caseSensitive:
          ((M = x.options) == null ? void 0 : M.caseSensitive) ?? c,
        fuzzy: !0,
      });
    };
  let p = s !== void 0 ? f[s] : void 0;
  p
    ? (g = d(p))
    : (p = v.find((x) => {
        const M = d(x);
        return M ? ((g = M), !0) : !1;
      }));
  let m = p || h[We];
  const b = [m];
  for (; m.parentRoute; ) (m = m.parentRoute), b.unshift(m);
  return { matchedRoutes: b, routeParams: g, foundRoute: p };
}
function Kp({ search: l, dest: s, destRoutes: u, _includeValidateSearch: c }) {
  const f =
      u.reduce((g, S) => {
        var d;
        const p = [];
        if ("search" in S.options)
          (d = S.options.search) != null &&
            d.middlewares &&
            p.push(...S.options.search.middlewares);
        else if (S.options.preSearchFilters || S.options.postSearchFilters) {
          const m = ({ search: b, next: x }) => {
            let M = b;
            "preSearchFilters" in S.options &&
              S.options.preSearchFilters &&
              (M = S.options.preSearchFilters.reduce((L, q) => q(L), b));
            const U = x(M);
            return "postSearchFilters" in S.options &&
              S.options.postSearchFilters
              ? S.options.postSearchFilters.reduce((L, q) => q(L), U)
              : U;
          };
          p.push(m);
        }
        if (c && S.options.validateSearch) {
          const m = ({ search: b, next: x }) => {
            const M = x(b);
            try {
              return { ...M, ...(ho(S.options.validateSearch, M) ?? {}) };
            } catch {
              return M;
            }
          };
          p.push(m);
        }
        return g.concat(p);
      }, []) ?? [],
    h = ({ search: g }) =>
      s.search ? (s.search === !0 ? g : Ua(s.search, g)) : {};
  f.push(h);
  const v = (g, S) => {
    if (g >= f.length) return S;
    const d = f[g];
    return d({ search: S, next: (m) => v(g + 1, m) });
  };
  return v(0, l);
}
const rn = Symbol.for("TSR_DEFERRED_PROMISE");
function Zp(l, s) {
  const u = l;
  return (
    u[rn] ||
      ((u[rn] = { status: "pending" }),
      u
        .then((c) => {
          (u[rn].status = "success"), (u[rn].data = c);
        })
        .catch((c) => {
          (u[rn].status = "error"),
            (u[rn].error = { data: qp(c), __isServerError: !0 });
        })),
    u
  );
}
const Jp = "Error preloading route! ☝️";
class mv {
  constructor(s) {
    if (
      ((this.init = (u) => {
        var c, f;
        this.originalIndex = u.originalIndex;
        const h = this.options,
          v = !(h != null && h.path) && !(h != null && h.id);
        (this.parentRoute =
          (f = (c = this.options).getParentRoute) == null ? void 0 : f.call(c)),
          v ? (this._path = We) : this.parentRoute || on(!1);
        let g = v ? We : h == null ? void 0 : h.path;
        g && g !== "/" && (g = bo(g));
        const S = (h == null ? void 0 : h.id) || g;
        let d = v
          ? We
          : cn([this.parentRoute.id === We ? "" : this.parentRoute.id, S]);
        g === We && (g = "/"), d !== We && (d = cn(["/", d]));
        const p = d === We ? "/" : cn([this.parentRoute.fullPath, g]);
        (this._path = g),
          (this._id = d),
          (this._fullPath = p),
          (this._to = p),
          (this._ssr = (h == null ? void 0 : h.ssr) ?? u.defaultSsr ?? !0);
      }),
      (this.clone = (u) => {
        (this._path = u._path),
          (this._id = u._id),
          (this._fullPath = u._fullPath),
          (this._to = u._to),
          (this._ssr = u._ssr),
          (this.options.getParentRoute = u.options.getParentRoute),
          (this.children = u.children);
      }),
      (this.addChildren = (u) => this._addFileChildren(u)),
      (this._addFileChildren = (u) => (
        Array.isArray(u) && (this.children = u),
        typeof u == "object" &&
          u !== null &&
          (this.children = Object.values(u)),
        this
      )),
      (this._addFileTypes = () => this),
      (this.updateLoader = (u) => (Object.assign(this.options, u), this)),
      (this.update = (u) => (Object.assign(this.options, u), this)),
      (this.lazy = (u) => ((this.lazyFn = u), this)),
      (this.options = s || {}),
      (this.isRoot = !(s != null && s.getParentRoute)),
      s != null && s.id && s != null && s.path)
    )
      throw new Error("Route cannot have both an 'id' and a 'path' option.");
  }
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  get ssr() {
    return this._ssr;
  }
}
class kp extends mv {
  constructor(s) {
    super(s);
  }
}
const Rl = {
    stringify: (l) =>
      JSON.stringify(l, function (u, c) {
        const f = this[u],
          h = os.find((v) => v.stringifyCondition(f));
        return h ? h.stringify(f) : c;
      }),
    parse: (l) =>
      JSON.parse(l, function (u, c) {
        const f = this[u];
        if (ua(f)) {
          const h = os.find((v) => v.parseCondition(f));
          if (h) return h.parse(f);
        }
        return c;
      }),
    encode: (l) => {
      if (Array.isArray(l)) return l.map((u) => Rl.encode(u));
      if (ua(l))
        return Object.fromEntries(
          Object.entries(l).map(([u, c]) => [u, Rl.encode(c)]),
        );
      const s = os.find((u) => u.stringifyCondition(l));
      return s ? s.stringify(l) : l;
    },
    decode: (l) => {
      if (ua(l)) {
        const s = os.find((u) => u.parseCondition(l));
        if (s) return s.parse(l);
      }
      return Array.isArray(l)
        ? l.map((s) => Rl.decode(s))
        : ua(l)
          ? Object.fromEntries(
              Object.entries(l).map(([s, u]) => [s, Rl.decode(u)]),
            )
          : l;
    },
  },
  Bi = (l, s, u, c) => ({
    key: l,
    stringifyCondition: s,
    stringify: (f) => ({ [`$${l}`]: u(f) }),
    parseCondition: (f) => Object.hasOwn(f, `$${l}`),
    parse: (f) => c(f[`$${l}`]),
  }),
  os = [
    Bi(
      "undefined",
      (l) => l === void 0,
      () => 0,
      () => {},
    ),
    Bi(
      "date",
      (l) => l instanceof Date,
      (l) => l.toISOString(),
      (l) => new Date(l),
    ),
    Bi(
      "error",
      (l) => l instanceof Error,
      (l) => ({ ...l, message: l.message, stack: void 0, cause: l.cause }),
      (l) => Object.assign(new Error(l.message), l),
    ),
    Bi(
      "formData",
      (l) => l instanceof FormData,
      (l) => {
        const s = {};
        return (
          l.forEach((u, c) => {
            const f = s[c];
            f !== void 0
              ? Array.isArray(f)
                ? f.push(u)
                : (s[c] = [f, u])
              : (s[c] = u);
          }),
          s
        );
      },
      (l) => {
        const s = new FormData();
        return (
          Object.entries(l).forEach(([u, c]) => {
            Array.isArray(c)
              ? c.forEach((f) => s.append(u, f))
              : s.append(u, c);
          }),
          s
        );
      },
    ),
    Bi(
      "bigint",
      (l) => typeof l == "bigint",
      (l) => l.toString(),
      (l) => BigInt(l),
    ),
  ];
async function Fp(l) {
  var s, u, c;
  on((s = window.__TSR_SSR__) == null ? void 0 : s.dehydrated);
  const {
    manifest: f,
    dehydratedData: h,
    lastMatchId: v,
  } = Rl.parse(window.__TSR_SSR__.dehydrated);
  (l.ssr = { manifest: f, serializer: Rl }),
    (l.clientSsr = {
      getStreamedValue: (d) => {
        var p;
        if (l.isServer) return;
        const m =
          (p = window.__TSR_SSR__) == null ? void 0 : p.streamedValues[d];
        if (m)
          return (
            m.parsed || (m.parsed = l.ssr.serializer.parse(m.value)), m.parsed
          );
      },
    });
  const g = l.matchRoutes(l.state.location),
    S = Promise.all(
      g.map((d) => {
        const p = l.looseRoutesById[d.routeId];
        return l.loadRouteChunk(p);
      }),
    );
  return (
    g.forEach((d) => {
      var p;
      const m = window.__TSR_SSR__.matches.find((b) => b.id === d.id);
      if (m)
        return (
          Object.assign(d, m),
          m.__beforeLoadContext &&
            (d.__beforeLoadContext = l.ssr.serializer.parse(
              m.__beforeLoadContext,
            )),
          m.loaderData && (d.loaderData = l.ssr.serializer.parse(m.loaderData)),
          m.error && (d.error = l.ssr.serializer.parse(m.error)),
          (p = d.extracted) == null ||
            p.forEach((b) => {
              yo(d, ["loaderData", ...b.path], b.value);
            }),
          d
        );
    }),
    l.__store.setState((d) => ({ ...d, matches: g })),
    await ((c = (u = l.options).hydrate) == null ? void 0 : c.call(u, h)),
    await Promise.all(
      l.state.matches.map(async (d) => {
        var p, m, b, x, M, U;
        const L = l.looseRoutesById[d.routeId],
          q = l.state.matches[d.index - 1],
          K = (q == null ? void 0 : q.context) ?? l.options.context ?? {},
          V = {
            deps: d.loaderDeps,
            params: d.params,
            context: K,
            location: l.state.location,
            navigate: (F) =>
              l.navigate({ ...F, _fromLocation: l.state.location }),
            buildLocation: l.buildLocation,
            cause: d.cause,
            abortController: d.abortController,
            preload: !1,
            matches: g,
          };
        (d.__routeContext =
          ((m = (p = L.options).context) == null ? void 0 : m.call(p, V)) ??
          {}),
          (d.context = { ...K, ...d.__routeContext, ...d.__beforeLoadContext });
        const I = {
            matches: l.state.matches,
            match: d,
            params: d.params,
            loaderData: d.loaderData,
          },
          P = await ((x = (b = L.options).head) == null
            ? void 0
            : x.call(b, I)),
          Y = await ((U = (M = L.options).scripts) == null
            ? void 0
            : U.call(M, I));
        (d.meta = P == null ? void 0 : P.meta),
          (d.links = P == null ? void 0 : P.links),
          (d.headScripts = P == null ? void 0 : P.scripts),
          (d.scripts = Y);
      }),
    ),
    g[g.length - 1].id !== v ? await Promise.all([S, l.load()]) : S
  );
}
function yo(l, s, u) {
  s.length === 1 && (l[s[0]] = u);
  const [c, ...f] = s;
  Array.isArray(l) ? yo(l[Number(c)], f, u) : ua(l) && yo(l[c], f, u);
}
const Pp = "modulepreload",
  $p = function (l) {
    return "/" + l;
  },
  qy = {},
  Wp = function (s, u, c) {
    let f = Promise.resolve();
    if (u && u.length > 0) {
      let v = function (d) {
        return Promise.all(
          d.map((p) =>
            Promise.resolve(p).then(
              (m) => ({ status: "fulfilled", value: m }),
              (m) => ({ status: "rejected", reason: m }),
            ),
          ),
        );
      };
      document.getElementsByTagName("link");
      const g = document.querySelector("meta[property=csp-nonce]"),
        S =
          (g == null ? void 0 : g.nonce) ||
          (g == null ? void 0 : g.getAttribute("nonce"));
      f = v(
        u.map((d) => {
          if (((d = $p(d)), d in qy)) return;
          qy[d] = !0;
          const p = d.endsWith(".css"),
            m = p ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${d}"]${m}`)) return;
          const b = document.createElement("link");
          if (
            ((b.rel = p ? "stylesheet" : Pp),
            p || (b.as = "script"),
            (b.crossOrigin = ""),
            (b.href = d),
            S && b.setAttribute("nonce", S),
            document.head.appendChild(b),
            p)
          )
            return new Promise((x, M) => {
              b.addEventListener("load", x),
                b.addEventListener("error", () =>
                  M(new Error(`Unable to preload CSS for ${d}`)),
                );
            });
        }),
      );
    }
    function h(v) {
      const g = new Event("vite:preloadError", { cancelable: !0 });
      if (((g.payload = v), window.dispatchEvent(g), !g.defaultPrevented))
        throw v;
    }
    return f.then((v) => {
      for (const g of v || []) g.status === "rejected" && h(g.reason);
      return s().catch(h);
    });
  };
function Ip({ promise: l }) {
  const s = Zp(l);
  if (s[rn].status === "pending") throw s;
  if (s[rn].status === "error") throw s[rn].error;
  return [s[rn].data, s];
}
function tg(l) {
  const s = Z.jsx(eg, { ...l });
  return l.fallback
    ? Z.jsx(st.Suspense, { fallback: l.fallback, children: s })
    : s;
}
function eg(l) {
  const [s] = Ip(l);
  return l.children(s);
}
function _o(l) {
  const s = l.errorComponent ?? Ts;
  return Z.jsx(ng, {
    getResetKey: l.getResetKey,
    onCatch: l.onCatch,
    children: ({ error: u, reset: c }) =>
      u ? st.createElement(s, { error: u, reset: c }) : l.children,
  });
}
class ng extends st.Component {
  constructor() {
    super(...arguments), (this.state = { error: null });
  }
  static getDerivedStateFromProps(s) {
    return { resetKey: s.getResetKey() };
  }
  static getDerivedStateFromError(s) {
    return { error: s };
  }
  reset() {
    this.setState({ error: null });
  }
  componentDidUpdate(s, u) {
    u.error && u.resetKey !== this.state.resetKey && this.reset();
  }
  componentDidCatch(s, u) {
    this.props.onCatch && this.props.onCatch(s, u);
  }
  render() {
    return this.props.children({
      error:
        this.state.resetKey !== this.props.getResetKey()
          ? null
          : this.state.error,
      reset: () => {
        this.reset();
      },
    });
  }
}
function Ts({ error: l }) {
  const [s, u] = st.useState(!1);
  return Z.jsxs("div", {
    style: { padding: ".5rem", maxWidth: "100%" },
    children: [
      Z.jsxs("div", {
        style: { display: "flex", alignItems: "center", gap: ".5rem" },
        children: [
          Z.jsx("strong", {
            style: { fontSize: "1rem" },
            children: "Something went wrong!",
          }),
          Z.jsx("button", {
            style: {
              appearance: "none",
              fontSize: ".6em",
              border: "1px solid currentColor",
              padding: ".1rem .2rem",
              fontWeight: "bold",
              borderRadius: ".25rem",
            },
            onClick: () => u((c) => !c),
            children: s ? "Hide Error" : "Show Error",
          }),
        ],
      }),
      Z.jsx("div", { style: { height: ".25rem" } }),
      s
        ? Z.jsx("div", {
            children: Z.jsx("pre", {
              style: {
                fontSize: ".7em",
                border: "1px solid red",
                borderRadius: ".25rem",
                padding: ".3rem",
                color: "red",
                overflow: "auto",
              },
              children: l.message
                ? Z.jsx("code", { children: l.message })
                : null,
            }),
          })
        : null,
    ],
  });
}
function ag({ children: l, fallback: s = null }) {
  return lg()
    ? Z.jsx(Yi.Fragment, { children: l })
    : Z.jsx(Yi.Fragment, { children: s });
}
function lg() {
  return Yi.useSyncExternalStore(
    ig,
    () => !0,
    () => !1,
  );
}
function ig() {
  return () => {};
}
var Wc = { exports: {} },
  Ic = {},
  to = { exports: {} },
  eo = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Qy;
function ug() {
  if (Qy) return eo;
  Qy = 1;
  var l = Ji();
  function s(m, b) {
    return (m === b && (m !== 0 || 1 / m === 1 / b)) || (m !== m && b !== b);
  }
  var u = typeof Object.is == "function" ? Object.is : s,
    c = l.useState,
    f = l.useEffect,
    h = l.useLayoutEffect,
    v = l.useDebugValue;
  function g(m, b) {
    var x = b(),
      M = c({ inst: { value: x, getSnapshot: b } }),
      U = M[0].inst,
      L = M[1];
    return (
      h(
        function () {
          (U.value = x), (U.getSnapshot = b), S(U) && L({ inst: U });
        },
        [m, x, b],
      ),
      f(
        function () {
          return (
            S(U) && L({ inst: U }),
            m(function () {
              S(U) && L({ inst: U });
            })
          );
        },
        [m],
      ),
      v(x),
      x
    );
  }
  function S(m) {
    var b = m.getSnapshot;
    m = m.value;
    try {
      var x = b();
      return !u(m, x);
    } catch {
      return !0;
    }
  }
  function d(m, b) {
    return b();
  }
  var p =
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
      ? d
      : g;
  return (
    (eo.useSyncExternalStore =
      l.useSyncExternalStore !== void 0 ? l.useSyncExternalStore : p),
    eo
  );
}
var Gy;
function sg() {
  return Gy || ((Gy = 1), (to.exports = ug())), to.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Yy;
function rg() {
  if (Yy) return Ic;
  Yy = 1;
  var l = Ji(),
    s = sg();
  function u(d, p) {
    return (d === p && (d !== 0 || 1 / d === 1 / p)) || (d !== d && p !== p);
  }
  var c = typeof Object.is == "function" ? Object.is : u,
    f = s.useSyncExternalStore,
    h = l.useRef,
    v = l.useEffect,
    g = l.useMemo,
    S = l.useDebugValue;
  return (
    (Ic.useSyncExternalStoreWithSelector = function (d, p, m, b, x) {
      var M = h(null);
      if (M.current === null) {
        var U = { hasValue: !1, value: null };
        M.current = U;
      } else U = M.current;
      M = g(
        function () {
          function q(Y) {
            if (!K) {
              if (((K = !0), (V = Y), (Y = b(Y)), x !== void 0 && U.hasValue)) {
                var F = U.value;
                if (x(F, Y)) return (I = F);
              }
              return (I = Y);
            }
            if (((F = I), c(V, Y))) return F;
            var G = b(Y);
            return x !== void 0 && x(F, G) ? ((V = Y), F) : ((V = Y), (I = G));
          }
          var K = !1,
            V,
            I,
            P = m === void 0 ? null : m;
          return [
            function () {
              return q(p());
            },
            P === null
              ? void 0
              : function () {
                  return q(P());
                },
          ];
        },
        [p, m, b, x],
      );
      var L = f(d, M[0], M[1]);
      return (
        v(
          function () {
            (U.hasValue = !0), (U.value = L);
          },
          [L],
        ),
        S(L),
        L
      );
    }),
    Ic
  );
}
var Vy;
function cg() {
  return Vy || ((Vy = 1), (Wc.exports = rg())), Wc.exports;
}
var og = cg();
function fg(l, s = (u) => u) {
  return og.useSyncExternalStoreWithSelector(
    l.subscribe,
    () => l.state,
    () => l.state,
    s,
    dg,
  );
}
function dg(l, s) {
  if (Object.is(l, s)) return !0;
  if (typeof l != "object" || l === null || typeof s != "object" || s === null)
    return !1;
  if (l instanceof Map && s instanceof Map) {
    if (l.size !== s.size) return !1;
    for (const [c, f] of l) if (!s.has(c) || !Object.is(f, s.get(c))) return !1;
    return !0;
  }
  if (l instanceof Set && s instanceof Set) {
    if (l.size !== s.size) return !1;
    for (const c of l) if (!s.has(c)) return !1;
    return !0;
  }
  const u = Object.keys(l);
  if (u.length !== Object.keys(s).length) return !1;
  for (let c = 0; c < u.length; c++)
    if (
      !Object.prototype.hasOwnProperty.call(s, u[c]) ||
      !Object.is(l[u[c]], s[u[c]])
    )
      return !1;
  return !0;
}
const no = st.createContext(null);
function pv() {
  return typeof document > "u"
    ? no
    : window.__TSR_ROUTER_CONTEXT__
      ? window.__TSR_ROUTER_CONTEXT__
      : ((window.__TSR_ROUTER_CONTEXT__ = no), no);
}
function Ce(l) {
  const s = st.useContext(pv());
  return l == null || l.warn, s;
}
function Zt(l) {
  const s = Ce({ warn: (l == null ? void 0 : l.router) === void 0 }),
    u = (l == null ? void 0 : l.router) || s,
    c = st.useRef(void 0);
  return fg(u.__store, (f) => {
    if (l != null && l.select) {
      if (l.structuralSharing ?? u.options.defaultStructuralSharing) {
        const h = Ge(c.current, l.select(f));
        return (c.current = h), h;
      }
      return l.select(f);
    }
    return f;
  });
}
const Ms = st.createContext(void 0),
  hg = st.createContext(void 0);
function Ke(l) {
  const s = st.useContext(l.from ? hg : Ms);
  return Zt({
    select: (c) => {
      const f = c.matches.find((h) =>
        l.from ? l.from === h.routeId : h.id === s,
      );
      if (
        (on(
          !((l.shouldThrow ?? !0) && !f),
          `Could not find ${l.from ? `an active match from "${l.from}"` : "a nearest match!"}`,
        ),
        f !== void 0)
      )
        return l.select ? l.select(f) : f;
    },
    structuralSharing: l.structuralSharing,
  });
}
function Eo(l) {
  return Ke({
    from: l.from,
    strict: l.strict,
    structuralSharing: l.structuralSharing,
    select: (s) => (l.select ? l.select(s.loaderData) : s.loaderData),
  });
}
function Ro(l) {
  const { select: s, ...u } = l;
  return Ke({ ...u, select: (c) => (s ? s(c.loaderDeps) : c.loaderDeps) });
}
function To(l) {
  return Ke({
    from: l.from,
    strict: l.strict,
    shouldThrow: l.shouldThrow,
    structuralSharing: l.structuralSharing,
    select: (s) => (l.select ? l.select(s.params) : s.params),
  });
}
function Mo(l) {
  return Ke({
    from: l.from,
    strict: l.strict,
    shouldThrow: l.shouldThrow,
    structuralSharing: l.structuralSharing,
    select: (s) => (l.select ? l.select(s.search) : s.search),
  });
}
function Oo(l) {
  const { navigate: s, state: u } = Ce(),
    c = Ke({ strict: !1, select: (f) => f.index });
  return st.useCallback(
    (f) => {
      const h =
        f.from ?? (l == null ? void 0 : l.from) ?? u.matches[c].fullPath;
      return s({ ...f, from: h });
    },
    [l == null ? void 0 : l.from, s],
  );
}
var yg = ov();
const Qi = typeof window < "u" ? st.useLayoutEffect : st.useEffect;
function ao(l) {
  const s = st.useRef({ value: l, prev: null }),
    u = s.current.value;
  return l !== u && (s.current = { value: l, prev: u }), s.current.prev;
}
function vg(l, s, u = {}, c = {}) {
  const f = st.useRef(typeof IntersectionObserver == "function"),
    h = st.useRef(null);
  return (
    st.useEffect(() => {
      if (!(!l.current || !f.current || c.disabled))
        return (
          (h.current = new IntersectionObserver(([v]) => {
            s(v);
          }, u)),
          h.current.observe(l.current),
          () => {
            var v;
            (v = h.current) == null || v.disconnect();
          }
        );
    }, [s, u, c.disabled, l]),
    h.current
  );
}
function mg(l) {
  const s = st.useRef(null);
  return st.useImperativeHandle(l, () => s.current, []), s;
}
function pg(l, s) {
  const u = Ce(),
    [c, f] = st.useState(!1),
    h = st.useRef(!1),
    v = mg(s),
    {
      activeProps: g = () => ({ className: "active" }),
      inactiveProps: S = () => ({}),
      activeOptions: d,
      to: p,
      preload: m,
      preloadDelay: b,
      hashScrollIntoView: x,
      replace: M,
      startTransition: U,
      resetScroll: L,
      viewTransition: q,
      children: K,
      target: V,
      disabled: I,
      style: P,
      className: Y,
      onClick: F,
      onFocus: G,
      onMouseEnter: w,
      onMouseLeave: W,
      onTouchStart: rt,
      ignoreBlocker: et,
      ...dt
    } = l,
    {
      params: pt,
      search: ht,
      hash: C,
      state: X,
      mask: at,
      reloadDocument: gt,
      ...E
    } = dt,
    N = st.useMemo(() => {
      try {
        return new URL(`${p}`), "external";
      } catch {}
      return "internal";
    }, [p]),
    k = Zt({ select: (xt) => xt.location.search, structuralSharing: !0 }),
    J = Ke({ strict: !1, select: (xt) => xt.fullPath }),
    $ = l.from ?? J;
  l = { ...l, from: $ };
  const lt = st.useMemo(() => u.buildLocation(l), [u, l, k]),
    tt = st.useMemo(
      () => (l.reloadDocument ? !1 : (m ?? u.options.defaultPreload)),
      [u.options.defaultPreload, m, l.reloadDocument],
    ),
    St = b ?? u.options.defaultPreloadDelay ?? 0,
    it = Zt({
      select: (xt) => {
        if (d != null && d.exact) {
          if (!gp(xt.location.pathname, lt.pathname, u.basepath)) return !1;
        } else {
          const Jt = ps(xt.location.pathname, u.basepath).split("/");
          if (
            !ps(lt.pathname, u.basepath)
              .split("/")
              .every((xs, ra) => xs === Jt[ra])
          )
            return !1;
        }
        return ((d == null ? void 0 : d.includeSearch) ?? !0) &&
          !Ol(xt.location.search, lt.search, {
            partial: !(d != null && d.exact),
            ignoreUndefined: !(d != null && d.explicitUndefined),
          })
          ? !1
          : d != null && d.includeHash
            ? xt.location.hash === lt.hash
            : !0;
      },
    }),
    bt = st.useCallback(() => {
      u.preloadRoute(l).catch((xt) => {
        console.warn(xt), console.warn(Jp);
      });
    }, [l, u]),
    Nt = st.useCallback(
      (xt) => {
        xt != null && xt.isIntersecting && bt();
      },
      [bt],
    );
  if (
    (vg(v, Nt, { rootMargin: "100px" }, { disabled: !!I || tt !== "viewport" }),
    Qi(() => {
      h.current || (!I && tt === "render" && (bt(), (h.current = !0)));
    }, [I, bt, tt]),
    N === "external")
  )
    return {
      ...E,
      ref: v,
      type: N,
      href: p,
      ...(K && { children: K }),
      ...(V && { target: V }),
      ...(I && { disabled: I }),
      ...(P && { style: P }),
      ...(Y && { className: Y }),
      ...(F && { onClick: F }),
      ...(G && { onFocus: G }),
      ...(w && { onMouseEnter: w }),
      ...(W && { onMouseLeave: W }),
      ...(rt && { onTouchStart: rt }),
    };
  const Qt = (xt) => {
      if (
        !I &&
        !gg(xt) &&
        !xt.defaultPrevented &&
        (!V || V === "_self") &&
        xt.button === 0
      ) {
        xt.preventDefault(),
          yg.flushSync(() => {
            f(!0);
          });
        const Jt = u.subscribe("onResolved", () => {
          Jt(), f(!1);
        });
        return u.navigate({
          ...l,
          replace: M,
          resetScroll: L,
          hashScrollIntoView: x,
          startTransition: U,
          viewTransition: q,
          ignoreBlocker: et,
        });
      }
    },
    Bt = (xt) => {
      I || (tt && bt());
    },
    ye = Bt,
    Ze = (xt) => {
      if (I) return;
      const Jt = xt.target || {};
      if (tt) {
        if (Jt.preloadTimeout) return;
        St
          ? (Jt.preloadTimeout = setTimeout(() => {
              (Jt.preloadTimeout = null), bt();
            }, St))
          : bt();
      }
    },
    xn = (xt) => {
      if (I) return;
      const Jt = xt.target || {};
      Jt.preloadTimeout &&
        (clearTimeout(Jt.preloadTimeout), (Jt.preloadTimeout = null));
    },
    ze = (xt) => (Jt) => {
      var Ha;
      (Ha = Jt.persist) == null || Ha.call(Jt),
        xt.filter(Boolean).forEach((ki) => {
          Jt.defaultPrevented || ki(Jt);
        });
    },
    Wt = it ? (Ua(g, {}) ?? {}) : {},
    La = it ? {} : Ua(S, {}),
    Bl = [Y, Wt.className, La.className].filter(Boolean).join(" "),
    ql = { ...P, ...Wt.style, ...La.style };
  return {
    ...E,
    ...Wt,
    ...La,
    href: I
      ? void 0
      : lt.maskedLocation
        ? u.history.createHref(lt.maskedLocation.href)
        : u.history.createHref(lt.href),
    ref: v,
    onClick: ze([F, Qt]),
    onFocus: ze([G, Bt]),
    onMouseEnter: ze([w, Ze]),
    onMouseLeave: ze([W, xn]),
    onTouchStart: ze([rt, ye]),
    disabled: !!I,
    target: V,
    ...(Object.keys(ql).length && { style: ql }),
    ...(Bl && { className: Bl }),
    ...(I && { role: "link", "aria-disabled": !0 }),
    ...(it && { "data-status": "active", "aria-current": "page" }),
    ...(c && { "data-transitioning": "transitioning" }),
  };
}
const gv = st.forwardRef((l, s) => {
  const { _asChild: u, ...c } = l,
    { type: f, ref: h, ...v } = pg(c, s),
    g =
      typeof c.children == "function"
        ? c.children({ isActive: v["data-status"] === "active" })
        : c.children;
  return (
    typeof u > "u" && delete v.disabled,
    st.createElement(u || "a", { ...v, ref: h }, g)
  );
});
function gg(l) {
  return !!(l.metaKey || l.altKey || l.ctrlKey || l.shiftKey);
}
let Sg = class extends mv {
  constructor(s) {
    super(s),
      (this.useMatch = (u) =>
        Ke({
          select: u == null ? void 0 : u.select,
          from: this.id,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
        })),
      (this.useRouteContext = (u) =>
        Ke({
          ...u,
          from: this.id,
          select: (c) =>
            u != null && u.select ? u.select(c.context) : c.context,
        })),
      (this.useSearch = (u) =>
        Mo({
          select: u == null ? void 0 : u.select,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
          from: this.id,
        })),
      (this.useParams = (u) =>
        To({
          select: u == null ? void 0 : u.select,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
          from: this.id,
        })),
      (this.useLoaderDeps = (u) => Ro({ ...u, from: this.id })),
      (this.useLoaderData = (u) => Eo({ ...u, from: this.id })),
      (this.useNavigate = () => Oo({ from: this.fullPath })),
      (this.Link = Yi.forwardRef((u, c) =>
        Z.jsx(gv, { ref: c, from: this.fullPath, ...u }),
      )),
      (this.$$typeof = Symbol.for("react.memo"));
  }
};
function bg(l) {
  return new Sg(l);
}
function _g() {
  return (l) => Rg(l);
}
class Eg extends kp {
  constructor(s) {
    super(s),
      (this.useMatch = (u) =>
        Ke({
          select: u == null ? void 0 : u.select,
          from: this.id,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
        })),
      (this.useRouteContext = (u) =>
        Ke({
          ...u,
          from: this.id,
          select: (c) =>
            u != null && u.select ? u.select(c.context) : c.context,
        })),
      (this.useSearch = (u) =>
        Mo({
          select: u == null ? void 0 : u.select,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
          from: this.id,
        })),
      (this.useParams = (u) =>
        To({
          select: u == null ? void 0 : u.select,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
          from: this.id,
        })),
      (this.useLoaderDeps = (u) => Ro({ ...u, from: this.id })),
      (this.useLoaderData = (u) => Eo({ ...u, from: this.id })),
      (this.useNavigate = () => Oo({ from: this.fullPath })),
      (this.Link = Yi.forwardRef((u, c) =>
        Z.jsx(gv, { ref: c, from: this.fullPath, ...u }),
      )),
      (this.$$typeof = Symbol.for("react.memo"));
  }
}
function Rg(l) {
  return new Eg(l);
}
function vo(l) {
  return typeof l == "object"
    ? new Xy(l, { silent: !0 }).createRoute(l)
    : new Xy(l, { silent: !0 }).createRoute;
}
class Xy {
  constructor(s, u) {
    (this.path = s),
      (this.createRoute = (c) => {
        this.silent;
        const f = bg(c);
        return (f.isRoot = !1), f;
      }),
      (this.silent = u == null ? void 0 : u.silent);
  }
}
class Ky {
  constructor(s) {
    (this.useMatch = (u) =>
      Ke({
        select: u == null ? void 0 : u.select,
        from: this.options.id,
        structuralSharing: u == null ? void 0 : u.structuralSharing,
      })),
      (this.useRouteContext = (u) =>
        Ke({
          from: this.options.id,
          select: (c) =>
            u != null && u.select ? u.select(c.context) : c.context,
        })),
      (this.useSearch = (u) =>
        Mo({
          select: u == null ? void 0 : u.select,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
          from: this.options.id,
        })),
      (this.useParams = (u) =>
        To({
          select: u == null ? void 0 : u.select,
          structuralSharing: u == null ? void 0 : u.structuralSharing,
          from: this.options.id,
        })),
      (this.useLoaderDeps = (u) => Ro({ ...u, from: this.options.id })),
      (this.useLoaderData = (u) => Eo({ ...u, from: this.options.id })),
      (this.useNavigate = () => {
        const u = Ce();
        return Oo({ from: u.routesById[this.options.id].fullPath });
      }),
      (this.options = s),
      (this.$$typeof = Symbol.for("react.memo"));
  }
}
function Zy(l) {
  return typeof l == "object" ? new Ky(l) : (s) => new Ky({ id: l, ...s });
}
function Tg(l) {
  const s = Zt({
    select: (u) => `not-found-${u.location.pathname}-${u.status}`,
  });
  return Z.jsx(_o, {
    getResetKey: () => s,
    onCatch: (u, c) => {
      var f;
      if (Xe(u)) (f = l.onCatch) == null || f.call(l, u, c);
      else throw u;
    },
    errorComponent: ({ error: u }) => {
      var c;
      if (Xe(u)) return (c = l.fallback) == null ? void 0 : c.call(l, u);
      throw u;
    },
    children: l.children,
  });
}
function Mg() {
  return Z.jsx("p", { children: "Not Found" });
}
function vs(l) {
  return Z.jsx(Z.Fragment, { children: l.children });
}
function Sv(l, s, u) {
  return s.options.notFoundComponent
    ? Z.jsx(s.options.notFoundComponent, { data: u })
    : l.options.defaultNotFoundComponent
      ? Z.jsx(l.options.defaultNotFoundComponent, { data: u })
      : Z.jsx(Mg, {});
}
var lo, Jy;
function Og() {
  if (Jy) return lo;
  Jy = 1;
  const l = {},
    s = l.hasOwnProperty,
    u = (G, w) => {
      for (const W in G) s.call(G, W) && w(W, G[W]);
    },
    c = (G, w) => (
      w &&
        u(w, (W, rt) => {
          G[W] = rt;
        }),
      G
    ),
    f = (G, w) => {
      const W = G.length;
      let rt = -1;
      for (; ++rt < W; ) w(G[rt]);
    },
    h = (G) => "\\u" + ("0000" + G).slice(-4),
    v = (G, w) => {
      let W = G.toString(16);
      return w ? W : W.toUpperCase();
    },
    g = l.toString,
    S = Array.isArray,
    d = (G) => typeof Buffer == "function" && Buffer.isBuffer(G),
    p = (G) => g.call(G) == "[object Object]",
    m = (G) => typeof G == "string" || g.call(G) == "[object String]",
    b = (G) => typeof G == "number" || g.call(G) == "[object Number]",
    x = (G) => typeof G == "bigint",
    M = (G) => typeof G == "function",
    U = (G) => g.call(G) == "[object Map]",
    L = (G) => g.call(G) == "[object Set]",
    q = {
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
    },
    K = /[\\\b\f\n\r\t]/,
    V = /[0-9]/,
    I = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/,
    P = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g,
    Y =
      /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g,
    F = (G, w) => {
      const W = () => {
          (X = C), ++w.indentLevel, (C = w.indent.repeat(w.indentLevel));
        },
        rt = {
          escapeEverything: !1,
          minimal: !1,
          isScriptContext: !1,
          quotes: "single",
          wrap: !1,
          es6: !1,
          json: !1,
          compact: !0,
          lowercaseHex: !1,
          numbers: "decimal",
          indent: "	",
          indentLevel: 0,
          __inline1__: !1,
          __inline2__: !1,
        },
        et = w && w.json;
      et && ((rt.quotes = "double"), (rt.wrap = !0)),
        (w = c(rt, w)),
        w.quotes != "single" &&
          w.quotes != "double" &&
          w.quotes != "backtick" &&
          (w.quotes = "single");
      const dt =
          w.quotes == "double" ? '"' : w.quotes == "backtick" ? "`" : "'",
        pt = w.compact,
        ht = w.lowercaseHex;
      let C = w.indent.repeat(w.indentLevel),
        X = "";
      const at = w.__inline1__,
        gt = w.__inline2__,
        E = pt
          ? ""
          : `
`;
      let N,
        k = !0;
      const J = w.numbers == "binary",
        $ = w.numbers == "octal",
        lt = w.numbers == "decimal",
        tt = w.numbers == "hexadecimal";
      if ((et && G && M(G.toJSON) && (G = G.toJSON()), !m(G))) {
        if (U(G))
          return G.size == 0
            ? "new Map()"
            : (pt || ((w.__inline1__ = !0), (w.__inline2__ = !1)),
              "new Map(" + F(Array.from(G), w) + ")");
        if (L(G))
          return G.size == 0
            ? "new Set()"
            : "new Set(" + F(Array.from(G), w) + ")";
        if (d(G))
          return G.length == 0
            ? "Buffer.from([])"
            : "Buffer.from(" + F(Array.from(G), w) + ")";
        if (S(G))
          return (
            (N = []),
            (w.wrap = !0),
            at && ((w.__inline1__ = !1), (w.__inline2__ = !0)),
            gt || W(),
            f(G, (it) => {
              (k = !1),
                gt && (w.__inline2__ = !1),
                N.push((pt || gt ? "" : C) + F(it, w));
            }),
            k
              ? "[]"
              : gt
                ? "[" + N.join(", ") + "]"
                : "[" + E + N.join("," + E) + E + (pt ? "" : X) + "]"
          );
        if (b(G) || x(G)) {
          if (et) return JSON.stringify(Number(G));
          let it;
          if (lt) it = String(G);
          else if (tt) {
            let bt = G.toString(16);
            ht || (bt = bt.toUpperCase()), (it = "0x" + bt);
          } else
            J ? (it = "0b" + G.toString(2)) : $ && (it = "0o" + G.toString(8));
          return x(G) ? it + "n" : it;
        } else
          return x(G)
            ? et
              ? JSON.stringify(Number(G))
              : G + "n"
            : p(G)
              ? ((N = []),
                (w.wrap = !0),
                W(),
                u(G, (it, bt) => {
                  (k = !1),
                    N.push(
                      (pt ? "" : C) +
                        F(it, w) +
                        ":" +
                        (pt ? "" : " ") +
                        F(bt, w),
                    );
                }),
                k ? "{}" : "{" + E + N.join("," + E) + E + (pt ? "" : X) + "}")
              : et
                ? JSON.stringify(G) || "null"
                : String(G);
      }
      const St = w.escapeEverything ? P : Y;
      return (
        (N = G.replace(St, (it, bt, Nt, Qt, Bt, ye) => {
          if (bt) {
            if (w.minimal) return bt;
            const xn = bt.charCodeAt(0),
              ze = bt.charCodeAt(1);
            if (w.es6) {
              const Wt = (xn - 55296) * 1024 + ze - 56320 + 65536;
              return "\\u{" + v(Wt, ht) + "}";
            }
            return h(v(xn, ht)) + h(v(ze, ht));
          }
          if (Nt) return h(v(Nt.charCodeAt(0), ht));
          if (it == "\0" && !et && !V.test(ye.charAt(Bt + 1))) return "\\0";
          if (Qt) return Qt == dt || w.escapeEverything ? "\\" + Qt : Qt;
          if (K.test(it)) return q[it];
          if (w.minimal && !I.test(it)) return it;
          const Ze = v(it.charCodeAt(0), ht);
          return et || Ze.length > 2 ? h(Ze) : "\\x" + ("00" + Ze).slice(-2);
        })),
        dt == "`" && (N = N.replace(/\$\{/g, "\\${")),
        w.isScriptContext &&
          (N = N.replace(/<\/(script|style)/gi, "<\\/$1").replace(
            /<!--/g,
            et ? "\\u003C!--" : "\\x3C!--",
          )),
        w.wrap && (N = dt + N + dt),
        N
      );
    };
  return (F.version = "3.0.2"), (lo = F), lo;
}
Og();
function Ag({ children: l, log: s }) {
  return typeof document < "u"
    ? null
    : Z.jsx("script", {
        className: "tsr-once",
        dangerouslySetInnerHTML: {
          __html: [
            l,
            "",
            'if (typeof __TSR_SSR__ !== "undefined") __TSR_SSR__.cleanScripts()',
          ].filter(Boolean).join(`
`),
        },
      });
}
function xg() {
  const l = Ce(),
    u = (l.options.getScrollRestorationKey || fo)(l.latestLocation),
    c = u !== fo(l.latestLocation) ? u : null;
  return !l.isScrollRestoring || !l.isServer
    ? null
    : Z.jsx(Ag, {
        children: `(${yv.toString()})(${JSON.stringify(Ss)},${JSON.stringify(c)}, undefined, true)`,
        log: !1,
      });
}
const bv = st.memo(function ({ matchId: s }) {
  var u, c;
  const f = Ce(),
    h = Zt({
      select: (q) => {
        var K;
        return (K = q.matches.find((V) => V.id === s)) == null
          ? void 0
          : K.routeId;
      },
    });
  on(h);
  const v = f.routesById[h],
    g = v.options.pendingComponent ?? f.options.defaultPendingComponent,
    S = g ? Z.jsx(g, {}) : null,
    d = v.options.errorComponent ?? f.options.defaultErrorComponent,
    p = v.options.onCatch ?? f.options.defaultOnCatch,
    m = v.isRoot
      ? (v.options.notFoundComponent ??
        ((u = f.options.notFoundRoute) == null ? void 0 : u.options.component))
      : v.options.notFoundComponent,
    b =
      (!v.isRoot || v.options.wrapInSuspense) &&
      (v.options.wrapInSuspense ??
        g ??
        ((c = v.options.errorComponent) == null ? void 0 : c.preload))
        ? st.Suspense
        : vs,
    x = d ? _o : vs,
    M = m ? Tg : vs,
    U = Zt({ select: (q) => q.loadedAt }),
    L = Zt({
      select: (q) => {
        var K;
        const V = q.matches.findIndex((I) => I.id === s);
        return (K = q.matches[V - 1]) == null ? void 0 : K.routeId;
      },
    });
  return Z.jsxs(Z.Fragment, {
    children: [
      Z.jsx(Ms.Provider, {
        value: s,
        children: Z.jsx(b, {
          fallback: S,
          children: Z.jsx(x, {
            getResetKey: () => U,
            errorComponent: d || Ts,
            onCatch: (q, K) => {
              if (Xe(q)) throw q;
              p == null || p(q, K);
            },
            children: Z.jsx(M, {
              fallback: (q) => {
                if (
                  !m ||
                  (q.routeId && q.routeId !== h) ||
                  (!q.routeId && !v.isRoot)
                )
                  throw q;
                return st.createElement(m, q);
              },
              children: Z.jsx(Cg, { matchId: s }),
            }),
          }),
        }),
      }),
      L === We && f.options.scrollRestoration
        ? Z.jsxs(Z.Fragment, { children: [Z.jsx(Dg, {}), Z.jsx(xg, {})] })
        : null,
    ],
  });
});
function Dg() {
  const l = Ce(),
    s = st.useRef(void 0);
  return Z.jsx(
    "script",
    {
      suppressHydrationWarning: !0,
      ref: (u) => {
        u &&
          (s.current === void 0 || s.current.href !== l.latestLocation.href) &&
          (l.emit({ type: "onRendered", ...wa(l.state) }),
          (s.current = l.latestLocation));
      },
    },
    l.latestLocation.state.key,
  );
}
const Cg = st.memo(function ({ matchId: s }) {
    var u, c, f;
    const h = Ce(),
      {
        match: v,
        key: g,
        routeId: S,
      } = Zt({
        select: (b) => {
          const x = b.matches.findIndex((V) => V.id === s),
            M = b.matches[x],
            U = M.routeId,
            L =
              h.routesById[U].options.remountDeps ??
              h.options.defaultRemountDeps,
            q =
              L == null
                ? void 0
                : L({
                    routeId: U,
                    loaderDeps: M.loaderDeps,
                    params: M._strictParams,
                    search: M._strictSearch,
                  });
          return {
            key: q ? JSON.stringify(q) : void 0,
            routeId: U,
            match: co(M, ["id", "status", "error"]),
          };
        },
        structuralSharing: !0,
      }),
      d = h.routesById[S],
      p = st.useMemo(() => {
        const b = d.options.component ?? h.options.defaultComponent;
        return b ? Z.jsx(b, {}, g) : Z.jsx(Ao, {});
      }, [g, d.options.component, h.options.defaultComponent]),
      m = (d.options.errorComponent ?? h.options.defaultErrorComponent) || Ts;
    if (v.status === "notFound") return on(Xe(v.error)), Sv(h, d, v.error);
    if (v.status === "redirected")
      throw (
        (on(Ye(v.error)),
        (u = h.getMatch(v.id)) == null ? void 0 : u.loadPromise)
      );
    if (v.status === "error") {
      if (h.isServer)
        return Z.jsx(m, {
          error: v.error,
          reset: void 0,
          info: { componentStack: "" },
        });
      throw v.error;
    }
    if (v.status === "pending") {
      const b = d.options.pendingMinMs ?? h.options.defaultPendingMinMs;
      if (
        b &&
        !((c = h.getMatch(v.id)) != null && c.minPendingPromise) &&
        !h.isServer
      ) {
        const x = El();
        Promise.resolve().then(() => {
          h.updateMatch(v.id, (M) => ({ ...M, minPendingPromise: x }));
        }),
          setTimeout(() => {
            x.resolve(),
              h.updateMatch(v.id, (M) => ({ ...M, minPendingPromise: void 0 }));
          }, b);
      }
      throw (f = h.getMatch(v.id)) == null ? void 0 : f.loadPromise;
    }
    return p;
  }),
  Ao = st.memo(function () {
    const s = Ce(),
      u = st.useContext(Ms),
      c = Zt({
        select: (d) => {
          var p;
          return (p = d.matches.find((m) => m.id === u)) == null
            ? void 0
            : p.routeId;
        },
      }),
      f = s.routesById[c],
      h = Zt({
        select: (d) => {
          const m = d.matches.find((b) => b.id === u);
          return on(m), m.globalNotFound;
        },
      }),
      v = Zt({
        select: (d) => {
          var p;
          const m = d.matches,
            b = m.findIndex((x) => x.id === u);
          return (p = m[b + 1]) == null ? void 0 : p.id;
        },
      }),
      g = s.options.defaultPendingComponent
        ? Z.jsx(s.options.defaultPendingComponent, {})
        : null;
    if (s.isShell)
      return Z.jsx(st.Suspense, { fallback: g, children: Z.jsx(zg, {}) });
    if (h) return Sv(s, f, void 0);
    if (!v) return null;
    const S = Z.jsx(bv, { matchId: v });
    return u === We ? Z.jsx(st.Suspense, { fallback: g, children: S }) : S;
  });
function zg() {
  throw new Error("ShellBoundaryError");
}
function Ug(l) {
  return typeof (l == null ? void 0 : l.message) != "string"
    ? !1
    : l.message.startsWith("Failed to fetch dynamically imported module") ||
        l.message.startsWith("error loading dynamically imported module") ||
        l.message.startsWith("Importing a module script failed");
}
function wg(l, s, u) {
  let c, f, h, v;
  const g = () =>
      typeof document > "u" && (u == null ? void 0 : u()) === !1
        ? ((f = () => null), Promise.resolve())
        : (c ||
            (c = l()
              .then((d) => {
                (c = void 0), (f = d[s]);
              })
              .catch((d) => {
                if (
                  ((h = d),
                  Ug(h) &&
                    h instanceof Error &&
                    typeof window < "u" &&
                    typeof sessionStorage < "u")
                ) {
                  const p = `tanstack_router_reload:${h.message}`;
                  sessionStorage.getItem(p) ||
                    (sessionStorage.setItem(p, "1"), (v = !0));
                }
              })),
          c),
    S = function (p) {
      if (v) throw (window.location.reload(), new Promise(() => {}));
      if (h) throw h;
      if (!f) throw g();
      return (u == null ? void 0 : u()) === !1
        ? Z.jsx(ag, {
            fallback: Z.jsx(Ao, {}),
            children: st.createElement(f, p),
          })
        : st.createElement(f, p);
    };
  return (S.preload = g), S;
}
function Ng() {
  const l = Ce(),
    s = st.useRef({ router: l, mounted: !1 }),
    u = Zt({ select: ({ isLoading: m }) => m }),
    [c, f] = st.useState(!1),
    h = Zt({
      select: (m) => m.matches.some((b) => b.status === "pending"),
      structuralSharing: !0,
    }),
    v = ao(u),
    g = u || c || h,
    S = ao(g),
    d = u || h,
    p = ao(d);
  return (
    l.isServer ||
      (l.startTransition = (m) => {
        f(!0),
          st.startTransition(() => {
            m(), f(!1);
          });
      }),
    st.useEffect(() => {
      const m = l.history.subscribe(l.load),
        b = l.buildLocation({
          to: l.latestLocation.pathname,
          search: !0,
          params: !0,
          hash: !0,
          state: !0,
          _includeValidateSearch: !0,
        });
      return (
        Hl(l.latestLocation.href) !== Hl(b.href) &&
          l.commitLocation({ ...b, replace: !0 }),
        () => {
          m();
        }
      );
    }, [l, l.history]),
    Qi(() => {
      if (
        (typeof window < "u" && l.clientSsr) ||
        (s.current.router === l && s.current.mounted)
      )
        return;
      (s.current = { router: l, mounted: !0 }),
        (async () => {
          try {
            await l.load();
          } catch (b) {
            console.error(b);
          }
        })();
    }, [l]),
    Qi(() => {
      v && !u && l.emit({ type: "onLoad", ...wa(l.state) });
    }, [v, l, u]),
    Qi(() => {
      p && !d && l.emit({ type: "onBeforeRouteMount", ...wa(l.state) });
    }, [d, p, l]),
    Qi(() => {
      S &&
        !g &&
        (l.emit({ type: "onResolved", ...wa(l.state) }),
        l.__store.setState((m) => ({
          ...m,
          status: "idle",
          resolvedLocation: m.location,
        })),
        zp(l));
    }, [g, S, l]),
    null
  );
}
function Lg() {
  const l = Ce(),
    s = l.options.defaultPendingComponent
      ? Z.jsx(l.options.defaultPendingComponent, {})
      : null,
    u = l.isServer || (typeof document < "u" && l.clientSsr) ? vs : st.Suspense,
    c = Z.jsxs(u, { fallback: s, children: [Z.jsx(Ng, {}), Z.jsx(Hg, {})] });
  return l.options.InnerWrap ? Z.jsx(l.options.InnerWrap, { children: c }) : c;
}
function Hg() {
  const l = Zt({
      select: (u) => {
        var c;
        return (c = u.matches[0]) == null ? void 0 : c.id;
      },
    }),
    s = Zt({ select: (u) => u.loadedAt });
  return Z.jsx(Ms.Provider, {
    value: l,
    children: Z.jsx(_o, {
      getResetKey: () => s,
      errorComponent: Ts,
      onCatch: (u) => {
        u.message || u.toString();
      },
      children: l ? Z.jsx(bv, { matchId: l }) : null,
    }),
  });
}
const jg = (l) => new Bg(l);
class Bg extends Qp {
  constructor(s) {
    super(s);
  }
}
typeof globalThis < "u"
  ? ((globalThis.createFileRoute = vo), (globalThis.createLazyFileRoute = Zy))
  : typeof window < "u" &&
    ((window.createFileRoute = vo), (window.createFileRoute = Zy));
function qg({ router: l, children: s, ...u }) {
  Object.keys(u).length > 0 &&
    l.update({
      ...l.options,
      ...u,
      context: { ...l.options.context, ...u.context },
    });
  const c = pv(),
    f = Z.jsx(c.Provider, { value: l, children: s });
  return l.options.Wrap ? Z.jsx(l.options.Wrap, { children: f }) : f;
}
function Qg({ router: l, ...s }) {
  return Z.jsx(qg, { router: l, ...s, children: Z.jsx(Lg, {}) });
}
function _v({ tag: l, attrs: s, children: u }) {
  switch (l) {
    case "title":
      return Z.jsx("title", {
        ...s,
        suppressHydrationWarning: !0,
        children: u,
      });
    case "meta":
      return Z.jsx("meta", { ...s, suppressHydrationWarning: !0 });
    case "link":
      return Z.jsx("link", { ...s, suppressHydrationWarning: !0 });
    case "style":
      return Z.jsx("style", { ...s, dangerouslySetInnerHTML: { __html: u } });
    case "script":
      return s && s.src
        ? Z.jsx("script", { ...s, suppressHydrationWarning: !0 })
        : typeof u == "string"
          ? Z.jsx("script", {
              ...s,
              dangerouslySetInnerHTML: { __html: u },
              suppressHydrationWarning: !0,
            })
          : null;
    default:
      return null;
  }
}
const Gg = () => {
  const l = Ce(),
    s = Zt({ select: (v) => v.matches.map((g) => g.meta).filter(Boolean) }),
    u = st.useMemo(() => {
      const v = [],
        g = {};
      let S;
      return (
        [...s].reverse().forEach((d) => {
          [...d].reverse().forEach((p) => {
            if (p)
              if (p.title) S || (S = { tag: "title", children: p.title });
              else {
                const m = p.name ?? p.property;
                if (m) {
                  if (g[m]) return;
                  g[m] = !0;
                }
                v.push({ tag: "meta", attrs: { ...p } });
              }
          });
        }),
        S && v.push(S),
        v.reverse(),
        v
      );
    }, [s]),
    c = Zt({
      select: (v) => {
        var g;
        const S = v.matches
            .map((m) => m.links)
            .filter(Boolean)
            .flat(1)
            .map((m) => ({ tag: "link", attrs: { ...m } })),
          d = (g = l.ssr) == null ? void 0 : g.manifest,
          p = v.matches
            .map((m) => {
              var b;
              return (
                ((b = d == null ? void 0 : d.routes[m.routeId]) == null
                  ? void 0
                  : b.assets) ?? []
              );
            })
            .filter(Boolean)
            .flat(1)
            .filter((m) => m.tag === "link")
            .map((m) => ({
              tag: "link",
              attrs: { ...m.attrs, suppressHydrationWarning: !0 },
            }));
        return [...S, ...p];
      },
      structuralSharing: !0,
    }),
    f = Zt({
      select: (v) => {
        const g = [];
        return (
          v.matches
            .map((S) => l.looseRoutesById[S.routeId])
            .forEach((S) => {
              var d, p, m, b;
              return (b =
                (m =
                  (p = (d = l.ssr) == null ? void 0 : d.manifest) == null
                    ? void 0
                    : p.routes[S.id]) == null
                  ? void 0
                  : m.preloads) == null
                ? void 0
                : b.filter(Boolean).forEach((x) => {
                    g.push({
                      tag: "link",
                      attrs: { rel: "modulepreload", href: x },
                    });
                  });
            }),
          g
        );
      },
      structuralSharing: !0,
    }),
    h = Zt({
      select: (v) =>
        v.matches
          .map((g) => g.headScripts)
          .flat(1)
          .filter(Boolean)
          .map(({ children: g, ...S }) => ({
            tag: "script",
            attrs: { ...S },
            children: g,
          })),
      structuralSharing: !0,
    });
  return Vg([...u, ...f, ...c, ...h], (v) => JSON.stringify(v));
};
function Yg() {
  return Gg().map((s) =>
    st.createElement(_v, { ...s, key: `tsr-meta-${JSON.stringify(s)}` }),
  );
}
function Vg(l, s) {
  const u = new Set();
  return l.filter((c) => {
    const f = s(c);
    return u.has(f) ? !1 : (u.add(f), !0);
  });
}
const Xg = () => {
  const l = Ce(),
    s = Zt({
      select: (f) => {
        var h;
        const v = [],
          g = (h = l.ssr) == null ? void 0 : h.manifest;
        return g
          ? (f.matches
              .map((S) => l.looseRoutesById[S.routeId])
              .forEach((S) => {
                var d, p;
                return (p = (d = g.routes[S.id]) == null ? void 0 : d.assets) ==
                  null
                  ? void 0
                  : p
                      .filter((m) => m.tag === "script")
                      .forEach((m) => {
                        v.push({
                          tag: "script",
                          attrs: m.attrs,
                          children: m.children,
                        });
                      });
              }),
            v)
          : [];
      },
      structuralSharing: !0,
    }),
    { scripts: u } = Zt({
      select: (f) => ({
        scripts: f.matches
          .map((h) => h.scripts)
          .flat(1)
          .filter(Boolean)
          .map(({ children: h, ...v }) => ({
            tag: "script",
            attrs: { ...v, suppressHydrationWarning: !0 },
            children: h,
          })),
      }),
      structuralSharing: !0,
    }),
    c = [...u, ...s];
  return Z.jsx(Z.Fragment, {
    children: c.map((f, h) =>
      st.createElement(_v, { ...f, key: `tsr-scripts-${f.tag}-${h}` }),
    ),
  });
};
let fs;
function Kg(l) {
  return (
    fs ||
      (l.router.state.matches.length
        ? (fs = Promise.resolve())
        : (fs = Fp(l.router))),
    Z.jsx(tg, { promise: fs, children: () => Z.jsx(Qg, { router: l.router }) })
  );
}
var Os = class {
    constructor() {
      (this.listeners = new Set()),
        (this.subscribe = this.subscribe.bind(this));
    }
    subscribe(l) {
      return (
        this.listeners.add(l),
        this.onSubscribe(),
        () => {
          this.listeners.delete(l), this.onUnsubscribe();
        }
      );
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  As = typeof window > "u" || "Deno" in globalThis;
function De() {}
function Zg(l, s) {
  return typeof l == "function" ? l(s) : l;
}
function Jg(l) {
  return typeof l == "number" && l >= 0 && l !== 1 / 0;
}
function kg(l, s) {
  return Math.max(l + (s || 0) - Date.now(), 0);
}
function mo(l, s) {
  return typeof l == "function" ? l(s) : l;
}
function Fg(l, s) {
  return typeof l == "function" ? l(s) : l;
}
function ky(l, s) {
  const {
    type: u = "all",
    exact: c,
    fetchStatus: f,
    predicate: h,
    queryKey: v,
    stale: g,
  } = l;
  if (v) {
    if (c) {
      if (s.queryHash !== xo(v, s.options)) return !1;
    } else if (!Xi(s.queryKey, v)) return !1;
  }
  if (u !== "all") {
    const S = s.isActive();
    if ((u === "active" && !S) || (u === "inactive" && S)) return !1;
  }
  return !(
    (typeof g == "boolean" && s.isStale() !== g) ||
    (f && f !== s.state.fetchStatus) ||
    (h && !h(s))
  );
}
function Fy(l, s) {
  const { exact: u, status: c, predicate: f, mutationKey: h } = l;
  if (h) {
    if (!s.options.mutationKey) return !1;
    if (u) {
      if (Na(s.options.mutationKey) !== Na(h)) return !1;
    } else if (!Xi(s.options.mutationKey, h)) return !1;
  }
  return !((c && s.state.status !== c) || (f && !f(s)));
}
function xo(l, s) {
  return ((s == null ? void 0 : s.queryKeyHashFn) || Na)(l);
}
function Na(l) {
  return JSON.stringify(l, (s, u) =>
    po(u)
      ? Object.keys(u)
          .sort()
          .reduce((c, f) => ((c[f] = u[f]), c), {})
      : u,
  );
}
function Xi(l, s) {
  return l === s
    ? !0
    : typeof l != typeof s
      ? !1
      : l && s && typeof l == "object" && typeof s == "object"
        ? Object.keys(s).every((u) => Xi(l[u], s[u]))
        : !1;
}
function Ev(l, s) {
  if (l === s) return l;
  const u = Py(l) && Py(s);
  if (u || (po(l) && po(s))) {
    const c = u ? l : Object.keys(l),
      f = c.length,
      h = u ? s : Object.keys(s),
      v = h.length,
      g = u ? [] : {},
      S = new Set(c);
    let d = 0;
    for (let p = 0; p < v; p++) {
      const m = u ? p : h[p];
      ((!u && S.has(m)) || u) && l[m] === void 0 && s[m] === void 0
        ? ((g[m] = void 0), d++)
        : ((g[m] = Ev(l[m], s[m])), g[m] === l[m] && l[m] !== void 0 && d++);
    }
    return f === v && d === f ? l : g;
  }
  return s;
}
function KS(l, s) {
  if (!s || Object.keys(l).length !== Object.keys(s).length) return !1;
  for (const u in l) if (l[u] !== s[u]) return !1;
  return !0;
}
function Py(l) {
  return Array.isArray(l) && l.length === Object.keys(l).length;
}
function po(l) {
  if (!$y(l)) return !1;
  const s = l.constructor;
  if (s === void 0) return !0;
  const u = s.prototype;
  return !(
    !$y(u) ||
    !u.hasOwnProperty("isPrototypeOf") ||
    Object.getPrototypeOf(l) !== Object.prototype
  );
}
function $y(l) {
  return Object.prototype.toString.call(l) === "[object Object]";
}
function Pg(l) {
  return new Promise((s) => {
    setTimeout(s, l);
  });
}
function $g(l, s, u) {
  return typeof u.structuralSharing == "function"
    ? u.structuralSharing(l, s)
    : u.structuralSharing !== !1
      ? Ev(l, s)
      : s;
}
function Wg(l, s, u = 0) {
  const c = [...l, s];
  return u && c.length > u ? c.slice(1) : c;
}
function Ig(l, s, u = 0) {
  const c = [s, ...l];
  return u && c.length > u ? c.slice(0, -1) : c;
}
var Do = Symbol();
function Rv(l, s) {
  return !l.queryFn && s != null && s.initialPromise
    ? () => s.initialPromise
    : !l.queryFn || l.queryFn === Do
      ? () => Promise.reject(new Error(`Missing queryFn: '${l.queryHash}'`))
      : l.queryFn;
}
function ZS(l, s) {
  return typeof l == "function" ? l(...s) : !!l;
}
var Aa,
  ea,
  Al,
  nv,
  tS =
    ((nv = class extends Os {
      constructor() {
        super();
        Ot(this, Aa);
        Ot(this, ea);
        Ot(this, Al);
        yt(this, Al, (s) => {
          if (!As && window.addEventListener) {
            const u = () => s();
            return (
              window.addEventListener("visibilitychange", u, !1),
              () => {
                window.removeEventListener("visibilitychange", u);
              }
            );
          }
        });
      }
      onSubscribe() {
        B(this, ea) || this.setEventListener(B(this, Al));
      }
      onUnsubscribe() {
        var s;
        this.hasListeners() ||
          ((s = B(this, ea)) == null || s.call(this), yt(this, ea, void 0));
      }
      setEventListener(s) {
        var u;
        yt(this, Al, s),
          (u = B(this, ea)) == null || u.call(this),
          yt(
            this,
            ea,
            s((c) => {
              typeof c == "boolean" ? this.setFocused(c) : this.onFocus();
            }),
          );
      }
      setFocused(s) {
        B(this, Aa) !== s && (yt(this, Aa, s), this.onFocus());
      }
      onFocus() {
        const s = this.isFocused();
        this.listeners.forEach((u) => {
          u(s);
        });
      }
      isFocused() {
        var s;
        return typeof B(this, Aa) == "boolean"
          ? B(this, Aa)
          : ((s = globalThis.document) == null ? void 0 : s.visibilityState) !==
              "hidden";
      }
    }),
    (Aa = new WeakMap()),
    (ea = new WeakMap()),
    (Al = new WeakMap()),
    nv),
  Tv = new tS(),
  xl,
  na,
  Dl,
  av,
  eS =
    ((av = class extends Os {
      constructor() {
        super();
        Ot(this, xl, !0);
        Ot(this, na);
        Ot(this, Dl);
        yt(this, Dl, (s) => {
          if (!As && window.addEventListener) {
            const u = () => s(!0),
              c = () => s(!1);
            return (
              window.addEventListener("online", u, !1),
              window.addEventListener("offline", c, !1),
              () => {
                window.removeEventListener("online", u),
                  window.removeEventListener("offline", c);
              }
            );
          }
        });
      }
      onSubscribe() {
        B(this, na) || this.setEventListener(B(this, Dl));
      }
      onUnsubscribe() {
        var s;
        this.hasListeners() ||
          ((s = B(this, na)) == null || s.call(this), yt(this, na, void 0));
      }
      setEventListener(s) {
        var u;
        yt(this, Dl, s),
          (u = B(this, na)) == null || u.call(this),
          yt(this, na, s(this.setOnline.bind(this)));
      }
      setOnline(s) {
        B(this, xl) !== s &&
          (yt(this, xl, s),
          this.listeners.forEach((c) => {
            c(s);
          }));
      }
      isOnline() {
        return B(this, xl);
      }
    }),
    (xl = new WeakMap()),
    (na = new WeakMap()),
    (Dl = new WeakMap()),
    av),
  Es = new eS();
function nS() {
  let l, s;
  const u = new Promise((f, h) => {
    (l = f), (s = h);
  });
  (u.status = "pending"), u.catch(() => {});
  function c(f) {
    Object.assign(u, f), delete u.resolve, delete u.reject;
  }
  return (
    (u.resolve = (f) => {
      c({ status: "fulfilled", value: f }), l(f);
    }),
    (u.reject = (f) => {
      c({ status: "rejected", reason: f }), s(f);
    }),
    u
  );
}
function aS(l) {
  var u;
  let s;
  if (
    ((u = l.then((c) => ((s = c), c), De)) == null || u.catch(De), s !== void 0)
  )
    return { data: s };
}
function lS(l) {
  return Math.min(1e3 * 2 ** l, 3e4);
}
function Mv(l) {
  return (l ?? "online") === "online" ? Es.isOnline() : !0;
}
var Ov = class extends Error {
  constructor(l) {
    super("CancelledError"),
      (this.revert = l == null ? void 0 : l.revert),
      (this.silent = l == null ? void 0 : l.silent);
  }
};
function io(l) {
  return l instanceof Ov;
}
function Av(l) {
  let s = !1,
    u = 0,
    c = !1,
    f;
  const h = nS(),
    v = (U) => {
      var L;
      c || (b(new Ov(U)), (L = l.abort) == null || L.call(l));
    },
    g = () => {
      s = !0;
    },
    S = () => {
      s = !1;
    },
    d = () =>
      Tv.isFocused() &&
      (l.networkMode === "always" || Es.isOnline()) &&
      l.canRun(),
    p = () => Mv(l.networkMode) && l.canRun(),
    m = (U) => {
      var L;
      c ||
        ((c = !0),
        (L = l.onSuccess) == null || L.call(l, U),
        f == null || f(),
        h.resolve(U));
    },
    b = (U) => {
      var L;
      c ||
        ((c = !0),
        (L = l.onError) == null || L.call(l, U),
        f == null || f(),
        h.reject(U));
    },
    x = () =>
      new Promise((U) => {
        var L;
        (f = (q) => {
          (c || d()) && U(q);
        }),
          (L = l.onPause) == null || L.call(l);
      }).then(() => {
        var U;
        (f = void 0), c || (U = l.onContinue) == null || U.call(l);
      }),
    M = () => {
      if (c) return;
      let U;
      const L = u === 0 ? l.initialPromise : void 0;
      try {
        U = L ?? l.fn();
      } catch (q) {
        U = Promise.reject(q);
      }
      Promise.resolve(U)
        .then(m)
        .catch((q) => {
          var Y;
          if (c) return;
          const K = l.retry ?? (As ? 0 : 3),
            V = l.retryDelay ?? lS,
            I = typeof V == "function" ? V(u, q) : V,
            P =
              K === !0 ||
              (typeof K == "number" && u < K) ||
              (typeof K == "function" && K(u, q));
          if (s || !P) {
            b(q);
            return;
          }
          u++,
            (Y = l.onFail) == null || Y.call(l, u, q),
            Pg(I)
              .then(() => (d() ? void 0 : x()))
              .then(() => {
                s ? b(q) : M();
              });
        });
    };
  return {
    promise: h,
    cancel: v,
    continue: () => (f == null || f(), h),
    cancelRetry: g,
    continueRetry: S,
    canStart: p,
    start: () => (p() ? M() : x().then(M), h),
  };
}
var iS = (l) => setTimeout(l, 0);
function uS() {
  let l = [],
    s = 0,
    u = (g) => {
      g();
    },
    c = (g) => {
      g();
    },
    f = iS;
  const h = (g) => {
      s
        ? l.push(g)
        : f(() => {
            u(g);
          });
    },
    v = () => {
      const g = l;
      (l = []),
        g.length &&
          f(() => {
            c(() => {
              g.forEach((S) => {
                u(S);
              });
            });
          });
    };
  return {
    batch: (g) => {
      let S;
      s++;
      try {
        S = g();
      } finally {
        s--, s || v();
      }
      return S;
    },
    batchCalls:
      (g) =>
      (...S) => {
        h(() => {
          g(...S);
        });
      },
    schedule: h,
    setNotifyFunction: (g) => {
      u = g;
    },
    setBatchNotifyFunction: (g) => {
      c = g;
    },
    setScheduler: (g) => {
      f = g;
    },
  };
}
var he = uS(),
  xa,
  lv,
  xv =
    ((lv = class {
      constructor() {
        Ot(this, xa);
      }
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        this.clearGcTimeout(),
          Jg(this.gcTime) &&
            yt(
              this,
              xa,
              setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime),
            );
      }
      updateGcTime(l) {
        this.gcTime = Math.max(
          this.gcTime || 0,
          l ?? (As ? 1 / 0 : 5 * 60 * 1e3),
        );
      }
      clearGcTimeout() {
        B(this, xa) && (clearTimeout(B(this, xa)), yt(this, xa, void 0));
      }
    }),
    (xa = new WeakMap()),
    lv),
  Cl,
  zl,
  Ve,
  Da,
  oe,
  Ki,
  Ca,
  Pe,
  On,
  iv,
  sS =
    ((iv = class extends xv {
      constructor(s) {
        super();
        Ot(this, Pe);
        Ot(this, Cl);
        Ot(this, zl);
        Ot(this, Ve);
        Ot(this, Da);
        Ot(this, oe);
        Ot(this, Ki);
        Ot(this, Ca);
        yt(this, Ca, !1),
          yt(this, Ki, s.defaultOptions),
          this.setOptions(s.options),
          (this.observers = []),
          yt(this, Da, s.client),
          yt(this, Ve, B(this, Da).getQueryCache()),
          (this.queryKey = s.queryKey),
          (this.queryHash = s.queryHash),
          yt(this, Cl, cS(this.options)),
          (this.state = s.state ?? B(this, Cl)),
          this.scheduleGc();
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        var s;
        return (s = B(this, oe)) == null ? void 0 : s.promise;
      }
      setOptions(s) {
        (this.options = { ...B(this, Ki), ...s }),
          this.updateGcTime(this.options.gcTime);
      }
      optionalRemove() {
        !this.observers.length &&
          this.state.fetchStatus === "idle" &&
          B(this, Ve).remove(this);
      }
      setData(s, u) {
        const c = $g(this.state.data, s, this.options);
        return (
          re(this, Pe, On).call(this, {
            data: c,
            type: "success",
            dataUpdatedAt: u == null ? void 0 : u.updatedAt,
            manual: u == null ? void 0 : u.manual,
          }),
          c
        );
      }
      setState(s, u) {
        re(this, Pe, On).call(this, {
          type: "setState",
          state: s,
          setStateOptions: u,
        });
      }
      cancel(s) {
        var c, f;
        const u = (c = B(this, oe)) == null ? void 0 : c.promise;
        return (
          (f = B(this, oe)) == null || f.cancel(s),
          u ? u.then(De).catch(De) : Promise.resolve()
        );
      }
      destroy() {
        super.destroy(), this.cancel({ silent: !0 });
      }
      reset() {
        this.destroy(), this.setState(B(this, Cl));
      }
      isActive() {
        return this.observers.some((s) => Fg(s.options.enabled, this) !== !1);
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === Do ||
              this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
      }
      isStatic() {
        return this.getObserversCount() > 0
          ? this.observers.some(
              (s) => mo(s.options.staleTime, this) === "static",
            )
          : !1;
      }
      isStale() {
        return this.getObserversCount() > 0
          ? this.observers.some((s) => s.getCurrentResult().isStale)
          : this.state.data === void 0 || this.state.isInvalidated;
      }
      isStaleByTime(s = 0) {
        return this.state.data === void 0
          ? !0
          : s === "static"
            ? !1
            : this.state.isInvalidated
              ? !0
              : !kg(this.state.dataUpdatedAt, s);
      }
      onFocus() {
        var u;
        const s = this.observers.find((c) => c.shouldFetchOnWindowFocus());
        s == null || s.refetch({ cancelRefetch: !1 }),
          (u = B(this, oe)) == null || u.continue();
      }
      onOnline() {
        var u;
        const s = this.observers.find((c) => c.shouldFetchOnReconnect());
        s == null || s.refetch({ cancelRefetch: !1 }),
          (u = B(this, oe)) == null || u.continue();
      }
      addObserver(s) {
        this.observers.includes(s) ||
          (this.observers.push(s),
          this.clearGcTimeout(),
          B(this, Ve).notify({
            type: "observerAdded",
            query: this,
            observer: s,
          }));
      }
      removeObserver(s) {
        this.observers.includes(s) &&
          ((this.observers = this.observers.filter((u) => u !== s)),
          this.observers.length ||
            (B(this, oe) &&
              (B(this, Ca)
                ? B(this, oe).cancel({ revert: !0 })
                : B(this, oe).cancelRetry()),
            this.scheduleGc()),
          B(this, Ve).notify({
            type: "observerRemoved",
            query: this,
            observer: s,
          }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated ||
          re(this, Pe, On).call(this, { type: "invalidate" });
      }
      fetch(s, u) {
        var d, p, m;
        if (this.state.fetchStatus !== "idle") {
          if (this.state.data !== void 0 && u != null && u.cancelRefetch)
            this.cancel({ silent: !0 });
          else if (B(this, oe))
            return B(this, oe).continueRetry(), B(this, oe).promise;
        }
        if ((s && this.setOptions(s), !this.options.queryFn)) {
          const b = this.observers.find((x) => x.options.queryFn);
          b && this.setOptions(b.options);
        }
        const c = new AbortController(),
          f = (b) => {
            Object.defineProperty(b, "signal", {
              enumerable: !0,
              get: () => (yt(this, Ca, !0), c.signal),
            });
          },
          h = () => {
            const b = Rv(this.options, u),
              M = (() => {
                const U = {
                  client: B(this, Da),
                  queryKey: this.queryKey,
                  meta: this.meta,
                };
                return f(U), U;
              })();
            return (
              yt(this, Ca, !1),
              this.options.persister ? this.options.persister(b, M, this) : b(M)
            );
          },
          g = (() => {
            const b = {
              fetchOptions: u,
              options: this.options,
              queryKey: this.queryKey,
              client: B(this, Da),
              state: this.state,
              fetchFn: h,
            };
            return f(b), b;
          })();
        (d = this.options.behavior) == null || d.onFetch(g, this),
          yt(this, zl, this.state),
          (this.state.fetchStatus === "idle" ||
            this.state.fetchMeta !==
              ((p = g.fetchOptions) == null ? void 0 : p.meta)) &&
            re(this, Pe, On).call(this, {
              type: "fetch",
              meta: (m = g.fetchOptions) == null ? void 0 : m.meta,
            });
        const S = (b) => {
          var x, M, U, L;
          (io(b) && b.silent) ||
            re(this, Pe, On).call(this, { type: "error", error: b }),
            io(b) ||
              ((M = (x = B(this, Ve).config).onError) == null ||
                M.call(x, b, this),
              (L = (U = B(this, Ve).config).onSettled) == null ||
                L.call(U, this.state.data, b, this)),
            this.scheduleGc();
        };
        return (
          yt(
            this,
            oe,
            Av({
              initialPromise: u == null ? void 0 : u.initialPromise,
              fn: g.fetchFn,
              abort: c.abort.bind(c),
              onSuccess: (b) => {
                var x, M, U, L;
                if (b === void 0) {
                  S(new Error(`${this.queryHash} data is undefined`));
                  return;
                }
                try {
                  this.setData(b);
                } catch (q) {
                  S(q);
                  return;
                }
                (M = (x = B(this, Ve).config).onSuccess) == null ||
                  M.call(x, b, this),
                  (L = (U = B(this, Ve).config).onSettled) == null ||
                    L.call(U, b, this.state.error, this),
                  this.scheduleGc();
              },
              onError: S,
              onFail: (b, x) => {
                re(this, Pe, On).call(this, {
                  type: "failed",
                  failureCount: b,
                  error: x,
                });
              },
              onPause: () => {
                re(this, Pe, On).call(this, { type: "pause" });
              },
              onContinue: () => {
                re(this, Pe, On).call(this, { type: "continue" });
              },
              retry: g.options.retry,
              retryDelay: g.options.retryDelay,
              networkMode: g.options.networkMode,
              canRun: () => !0,
            }),
          ),
          B(this, oe).start()
        );
      }
    }),
    (Cl = new WeakMap()),
    (zl = new WeakMap()),
    (Ve = new WeakMap()),
    (Da = new WeakMap()),
    (oe = new WeakMap()),
    (Ki = new WeakMap()),
    (Ca = new WeakMap()),
    (Pe = new WeakSet()),
    (On = function (s) {
      const u = (c) => {
        switch (s.type) {
          case "failed":
            return {
              ...c,
              fetchFailureCount: s.failureCount,
              fetchFailureReason: s.error,
            };
          case "pause":
            return { ...c, fetchStatus: "paused" };
          case "continue":
            return { ...c, fetchStatus: "fetching" };
          case "fetch":
            return {
              ...c,
              ...rS(c.data, this.options),
              fetchMeta: s.meta ?? null,
            };
          case "success":
            return {
              ...c,
              data: s.data,
              dataUpdateCount: c.dataUpdateCount + 1,
              dataUpdatedAt: s.dataUpdatedAt ?? Date.now(),
              error: null,
              isInvalidated: !1,
              status: "success",
              ...(!s.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            };
          case "error":
            const f = s.error;
            return io(f) && f.revert && B(this, zl)
              ? { ...B(this, zl), fetchStatus: "idle" }
              : {
                  ...c,
                  error: f,
                  errorUpdateCount: c.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: c.fetchFailureCount + 1,
                  fetchFailureReason: f,
                  fetchStatus: "idle",
                  status: "error",
                };
          case "invalidate":
            return { ...c, isInvalidated: !0 };
          case "setState":
            return { ...c, ...s.state };
        }
      };
      (this.state = u(this.state)),
        he.batch(() => {
          this.observers.forEach((c) => {
            c.onQueryUpdate();
          }),
            B(this, Ve).notify({ query: this, type: "updated", action: s });
        });
    }),
    iv);
function rS(l, s) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: Mv(s.networkMode) ? "fetching" : "paused",
    ...(l === void 0 && { error: null, status: "pending" }),
  };
}
function cS(l) {
  const s =
      typeof l.initialData == "function" ? l.initialData() : l.initialData,
    u = s !== void 0,
    c = u
      ? typeof l.initialDataUpdatedAt == "function"
        ? l.initialDataUpdatedAt()
        : l.initialDataUpdatedAt
      : 0;
  return {
    data: s,
    dataUpdateCount: 0,
    dataUpdatedAt: u ? (c ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: u ? "success" : "pending",
    fetchStatus: "idle",
  };
}
var ln,
  uv,
  oS =
    ((uv = class extends Os {
      constructor(s = {}) {
        super();
        Ot(this, ln);
        (this.config = s), yt(this, ln, new Map());
      }
      build(s, u, c) {
        const f = u.queryKey,
          h = u.queryHash ?? xo(f, u);
        let v = this.get(h);
        return (
          v ||
            ((v = new sS({
              client: s,
              queryKey: f,
              queryHash: h,
              options: s.defaultQueryOptions(u),
              state: c,
              defaultOptions: s.getQueryDefaults(f),
            })),
            this.add(v)),
          v
        );
      }
      add(s) {
        B(this, ln).has(s.queryHash) ||
          (B(this, ln).set(s.queryHash, s),
          this.notify({ type: "added", query: s }));
      }
      remove(s) {
        const u = B(this, ln).get(s.queryHash);
        u &&
          (s.destroy(),
          u === s && B(this, ln).delete(s.queryHash),
          this.notify({ type: "removed", query: s }));
      }
      clear() {
        he.batch(() => {
          this.getAll().forEach((s) => {
            this.remove(s);
          });
        });
      }
      get(s) {
        return B(this, ln).get(s);
      }
      getAll() {
        return [...B(this, ln).values()];
      }
      find(s) {
        const u = { exact: !0, ...s };
        return this.getAll().find((c) => ky(u, c));
      }
      findAll(s = {}) {
        const u = this.getAll();
        return Object.keys(s).length > 0 ? u.filter((c) => ky(s, c)) : u;
      }
      notify(s) {
        he.batch(() => {
          this.listeners.forEach((u) => {
            u(s);
          });
        });
      }
      onFocus() {
        he.batch(() => {
          this.getAll().forEach((s) => {
            s.onFocus();
          });
        });
      }
      onOnline() {
        he.batch(() => {
          this.getAll().forEach((s) => {
            s.onOnline();
          });
        });
      }
    }),
    (ln = new WeakMap()),
    uv),
  un,
  de,
  za,
  sn,
  ta,
  sv,
  fS =
    ((sv = class extends xv {
      constructor(s) {
        super();
        Ot(this, sn);
        Ot(this, un);
        Ot(this, de);
        Ot(this, za);
        (this.mutationId = s.mutationId),
          yt(this, de, s.mutationCache),
          yt(this, un, []),
          (this.state = s.state || dS()),
          this.setOptions(s.options),
          this.scheduleGc();
      }
      setOptions(s) {
        (this.options = s), this.updateGcTime(this.options.gcTime);
      }
      get meta() {
        return this.options.meta;
      }
      addObserver(s) {
        B(this, un).includes(s) ||
          (B(this, un).push(s),
          this.clearGcTimeout(),
          B(this, de).notify({
            type: "observerAdded",
            mutation: this,
            observer: s,
          }));
      }
      removeObserver(s) {
        yt(
          this,
          un,
          B(this, un).filter((u) => u !== s),
        ),
          this.scheduleGc(),
          B(this, de).notify({
            type: "observerRemoved",
            mutation: this,
            observer: s,
          });
      }
      optionalRemove() {
        B(this, un).length ||
          (this.state.status === "pending"
            ? this.scheduleGc()
            : B(this, de).remove(this));
      }
      continue() {
        var s;
        return (
          ((s = B(this, za)) == null ? void 0 : s.continue()) ??
          this.execute(this.state.variables)
        );
      }
      async execute(s) {
        var h, v, g, S, d, p, m, b, x, M, U, L, q, K, V, I, P, Y, F, G;
        const u = () => {
          re(this, sn, ta).call(this, { type: "continue" });
        };
        yt(
          this,
          za,
          Av({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(s)
                : Promise.reject(new Error("No mutationFn found")),
            onFail: (w, W) => {
              re(this, sn, ta).call(this, {
                type: "failed",
                failureCount: w,
                error: W,
              });
            },
            onPause: () => {
              re(this, sn, ta).call(this, { type: "pause" });
            },
            onContinue: u,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => B(this, de).canRun(this),
          }),
        );
        const c = this.state.status === "pending",
          f = !B(this, za).canStart();
        try {
          if (c) u();
          else {
            re(this, sn, ta).call(this, {
              type: "pending",
              variables: s,
              isPaused: f,
            }),
              await ((v = (h = B(this, de).config).onMutate) == null
                ? void 0
                : v.call(h, s, this));
            const W = await ((S = (g = this.options).onMutate) == null
              ? void 0
              : S.call(g, s));
            W !== this.state.context &&
              re(this, sn, ta).call(this, {
                type: "pending",
                context: W,
                variables: s,
                isPaused: f,
              });
          }
          const w = await B(this, za).start();
          return (
            await ((p = (d = B(this, de).config).onSuccess) == null
              ? void 0
              : p.call(d, w, s, this.state.context, this)),
            await ((b = (m = this.options).onSuccess) == null
              ? void 0
              : b.call(m, w, s, this.state.context)),
            await ((M = (x = B(this, de).config).onSettled) == null
              ? void 0
              : M.call(
                  x,
                  w,
                  null,
                  this.state.variables,
                  this.state.context,
                  this,
                )),
            await ((L = (U = this.options).onSettled) == null
              ? void 0
              : L.call(U, w, null, s, this.state.context)),
            re(this, sn, ta).call(this, { type: "success", data: w }),
            w
          );
        } catch (w) {
          try {
            throw (
              (await ((K = (q = B(this, de).config).onError) == null
                ? void 0
                : K.call(q, w, s, this.state.context, this)),
              await ((I = (V = this.options).onError) == null
                ? void 0
                : I.call(V, w, s, this.state.context)),
              await ((Y = (P = B(this, de).config).onSettled) == null
                ? void 0
                : Y.call(
                    P,
                    void 0,
                    w,
                    this.state.variables,
                    this.state.context,
                    this,
                  )),
              await ((G = (F = this.options).onSettled) == null
                ? void 0
                : G.call(F, void 0, w, s, this.state.context)),
              w)
            );
          } finally {
            re(this, sn, ta).call(this, { type: "error", error: w });
          }
        } finally {
          B(this, de).runNext(this);
        }
      }
    }),
    (un = new WeakMap()),
    (de = new WeakMap()),
    (za = new WeakMap()),
    (sn = new WeakSet()),
    (ta = function (s) {
      const u = (c) => {
        switch (s.type) {
          case "failed":
            return {
              ...c,
              failureCount: s.failureCount,
              failureReason: s.error,
            };
          case "pause":
            return { ...c, isPaused: !0 };
          case "continue":
            return { ...c, isPaused: !1 };
          case "pending":
            return {
              ...c,
              context: s.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: s.isPaused,
              status: "pending",
              variables: s.variables,
              submittedAt: Date.now(),
            };
          case "success":
            return {
              ...c,
              data: s.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: !1,
            };
          case "error":
            return {
              ...c,
              data: void 0,
              error: s.error,
              failureCount: c.failureCount + 1,
              failureReason: s.error,
              isPaused: !1,
              status: "error",
            };
        }
      };
      (this.state = u(this.state)),
        he.batch(() => {
          B(this, un).forEach((c) => {
            c.onMutationUpdate(s);
          }),
            B(this, de).notify({ mutation: this, type: "updated", action: s });
        });
    }),
    sv);
function dS() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0,
  };
}
var An,
  $e,
  Zi,
  rv,
  hS =
    ((rv = class extends Os {
      constructor(s = {}) {
        super();
        Ot(this, An);
        Ot(this, $e);
        Ot(this, Zi);
        (this.config = s),
          yt(this, An, new Set()),
          yt(this, $e, new Map()),
          yt(this, Zi, 0);
      }
      build(s, u, c) {
        const f = new fS({
          mutationCache: this,
          mutationId: ++rs(this, Zi)._,
          options: s.defaultMutationOptions(u),
          state: c,
        });
        return this.add(f), f;
      }
      add(s) {
        B(this, An).add(s);
        const u = ds(s);
        if (typeof u == "string") {
          const c = B(this, $e).get(u);
          c ? c.push(s) : B(this, $e).set(u, [s]);
        }
        this.notify({ type: "added", mutation: s });
      }
      remove(s) {
        if (B(this, An).delete(s)) {
          const u = ds(s);
          if (typeof u == "string") {
            const c = B(this, $e).get(u);
            if (c)
              if (c.length > 1) {
                const f = c.indexOf(s);
                f !== -1 && c.splice(f, 1);
              } else c[0] === s && B(this, $e).delete(u);
          }
        }
        this.notify({ type: "removed", mutation: s });
      }
      canRun(s) {
        const u = ds(s);
        if (typeof u == "string") {
          const c = B(this, $e).get(u),
            f =
              c == null ? void 0 : c.find((h) => h.state.status === "pending");
          return !f || f === s;
        } else return !0;
      }
      runNext(s) {
        var c;
        const u = ds(s);
        if (typeof u == "string") {
          const f =
            (c = B(this, $e).get(u)) == null
              ? void 0
              : c.find((h) => h !== s && h.state.isPaused);
          return (f == null ? void 0 : f.continue()) ?? Promise.resolve();
        } else return Promise.resolve();
      }
      clear() {
        he.batch(() => {
          B(this, An).forEach((s) => {
            this.notify({ type: "removed", mutation: s });
          }),
            B(this, An).clear(),
            B(this, $e).clear();
        });
      }
      getAll() {
        return Array.from(B(this, An));
      }
      find(s) {
        const u = { exact: !0, ...s };
        return this.getAll().find((c) => Fy(u, c));
      }
      findAll(s = {}) {
        return this.getAll().filter((u) => Fy(s, u));
      }
      notify(s) {
        he.batch(() => {
          this.listeners.forEach((u) => {
            u(s);
          });
        });
      }
      resumePausedMutations() {
        const s = this.getAll().filter((u) => u.state.isPaused);
        return he.batch(() =>
          Promise.all(s.map((u) => u.continue().catch(De))),
        );
      }
    }),
    (An = new WeakMap()),
    ($e = new WeakMap()),
    (Zi = new WeakMap()),
    rv);
function ds(l) {
  var s;
  return (s = l.options.scope) == null ? void 0 : s.id;
}
function Wy(l) {
  return {
    onFetch: (s, u) => {
      var p, m, b, x, M;
      const c = s.options,
        f =
          (b =
            (m = (p = s.fetchOptions) == null ? void 0 : p.meta) == null
              ? void 0
              : m.fetchMore) == null
            ? void 0
            : b.direction,
        h = ((x = s.state.data) == null ? void 0 : x.pages) || [],
        v = ((M = s.state.data) == null ? void 0 : M.pageParams) || [];
      let g = { pages: [], pageParams: [] },
        S = 0;
      const d = async () => {
        let U = !1;
        const L = (V) => {
            Object.defineProperty(V, "signal", {
              enumerable: !0,
              get: () => (
                s.signal.aborted
                  ? (U = !0)
                  : s.signal.addEventListener("abort", () => {
                      U = !0;
                    }),
                s.signal
              ),
            });
          },
          q = Rv(s.options, s.fetchOptions),
          K = async (V, I, P) => {
            if (U) return Promise.reject();
            if (I == null && V.pages.length) return Promise.resolve(V);
            const F = (() => {
                const rt = {
                  client: s.client,
                  queryKey: s.queryKey,
                  pageParam: I,
                  direction: P ? "backward" : "forward",
                  meta: s.options.meta,
                };
                return L(rt), rt;
              })(),
              G = await q(F),
              { maxPages: w } = s.options,
              W = P ? Ig : Wg;
            return {
              pages: W(V.pages, G, w),
              pageParams: W(V.pageParams, I, w),
            };
          };
        if (f && h.length) {
          const V = f === "backward",
            I = V ? yS : Iy,
            P = { pages: h, pageParams: v },
            Y = I(c, P);
          g = await K(P, Y, V);
        } else {
          const V = l ?? h.length;
          do {
            const I = S === 0 ? (v[0] ?? c.initialPageParam) : Iy(c, g);
            if (S > 0 && I == null) break;
            (g = await K(g, I)), S++;
          } while (S < V);
        }
        return g;
      };
      s.options.persister
        ? (s.fetchFn = () => {
            var U, L;
            return (L = (U = s.options).persister) == null
              ? void 0
              : L.call(
                  U,
                  d,
                  {
                    client: s.client,
                    queryKey: s.queryKey,
                    meta: s.options.meta,
                    signal: s.signal,
                  },
                  u,
                );
          })
        : (s.fetchFn = d);
    },
  };
}
function Iy(l, { pages: s, pageParams: u }) {
  const c = s.length - 1;
  return s.length > 0 ? l.getNextPageParam(s[c], s, u[c], u) : void 0;
}
function yS(l, { pages: s, pageParams: u }) {
  var c;
  return s.length > 0
    ? (c = l.getPreviousPageParam) == null
      ? void 0
      : c.call(l, s[0], s, u[0], u)
    : void 0;
}
var Vt,
  aa,
  la,
  Ul,
  wl,
  ia,
  Nl,
  Ll,
  cv,
  vS =
    ((cv = class {
      constructor(l = {}) {
        Ot(this, Vt);
        Ot(this, aa);
        Ot(this, la);
        Ot(this, Ul);
        Ot(this, wl);
        Ot(this, ia);
        Ot(this, Nl);
        Ot(this, Ll);
        yt(this, Vt, l.queryCache || new oS()),
          yt(this, aa, l.mutationCache || new hS()),
          yt(this, la, l.defaultOptions || {}),
          yt(this, Ul, new Map()),
          yt(this, wl, new Map()),
          yt(this, ia, 0);
      }
      mount() {
        rs(this, ia)._++,
          B(this, ia) === 1 &&
            (yt(
              this,
              Nl,
              Tv.subscribe(async (l) => {
                l &&
                  (await this.resumePausedMutations(), B(this, Vt).onFocus());
              }),
            ),
            yt(
              this,
              Ll,
              Es.subscribe(async (l) => {
                l &&
                  (await this.resumePausedMutations(), B(this, Vt).onOnline());
              }),
            ));
      }
      unmount() {
        var l, s;
        rs(this, ia)._--,
          B(this, ia) === 0 &&
            ((l = B(this, Nl)) == null || l.call(this),
            yt(this, Nl, void 0),
            (s = B(this, Ll)) == null || s.call(this),
            yt(this, Ll, void 0));
      }
      isFetching(l) {
        return B(this, Vt).findAll({ ...l, fetchStatus: "fetching" }).length;
      }
      isMutating(l) {
        return B(this, aa).findAll({ ...l, status: "pending" }).length;
      }
      getQueryData(l) {
        var u;
        const s = this.defaultQueryOptions({ queryKey: l });
        return (u = B(this, Vt).get(s.queryHash)) == null
          ? void 0
          : u.state.data;
      }
      ensureQueryData(l) {
        const s = this.defaultQueryOptions(l),
          u = B(this, Vt).build(this, s),
          c = u.state.data;
        return c === void 0
          ? this.fetchQuery(l)
          : (l.revalidateIfStale &&
              u.isStaleByTime(mo(s.staleTime, u)) &&
              this.prefetchQuery(s),
            Promise.resolve(c));
      }
      getQueriesData(l) {
        return B(this, Vt)
          .findAll(l)
          .map(({ queryKey: s, state: u }) => {
            const c = u.data;
            return [s, c];
          });
      }
      setQueryData(l, s, u) {
        const c = this.defaultQueryOptions({ queryKey: l }),
          f = B(this, Vt).get(c.queryHash),
          h = f == null ? void 0 : f.state.data,
          v = Zg(s, h);
        if (v !== void 0)
          return B(this, Vt)
            .build(this, c)
            .setData(v, { ...u, manual: !0 });
      }
      setQueriesData(l, s, u) {
        return he.batch(() =>
          B(this, Vt)
            .findAll(l)
            .map(({ queryKey: c }) => [c, this.setQueryData(c, s, u)]),
        );
      }
      getQueryState(l) {
        var u;
        const s = this.defaultQueryOptions({ queryKey: l });
        return (u = B(this, Vt).get(s.queryHash)) == null ? void 0 : u.state;
      }
      removeQueries(l) {
        const s = B(this, Vt);
        he.batch(() => {
          s.findAll(l).forEach((u) => {
            s.remove(u);
          });
        });
      }
      resetQueries(l, s) {
        const u = B(this, Vt);
        return he.batch(
          () => (
            u.findAll(l).forEach((c) => {
              c.reset();
            }),
            this.refetchQueries({ type: "active", ...l }, s)
          ),
        );
      }
      cancelQueries(l, s = {}) {
        const u = { revert: !0, ...s },
          c = he.batch(() =>
            B(this, Vt)
              .findAll(l)
              .map((f) => f.cancel(u)),
          );
        return Promise.all(c).then(De).catch(De);
      }
      invalidateQueries(l, s = {}) {
        return he.batch(
          () => (
            B(this, Vt)
              .findAll(l)
              .forEach((u) => {
                u.invalidate();
              }),
            (l == null ? void 0 : l.refetchType) === "none"
              ? Promise.resolve()
              : this.refetchQueries(
                  {
                    ...l,
                    type:
                      (l == null ? void 0 : l.refetchType) ??
                      (l == null ? void 0 : l.type) ??
                      "active",
                  },
                  s,
                )
          ),
        );
      }
      refetchQueries(l, s = {}) {
        const u = { ...s, cancelRefetch: s.cancelRefetch ?? !0 },
          c = he.batch(() =>
            B(this, Vt)
              .findAll(l)
              .filter((f) => !f.isDisabled() && !f.isStatic())
              .map((f) => {
                let h = f.fetch(void 0, u);
                return (
                  u.throwOnError || (h = h.catch(De)),
                  f.state.fetchStatus === "paused" ? Promise.resolve() : h
                );
              }),
          );
        return Promise.all(c).then(De);
      }
      fetchQuery(l) {
        const s = this.defaultQueryOptions(l);
        s.retry === void 0 && (s.retry = !1);
        const u = B(this, Vt).build(this, s);
        return u.isStaleByTime(mo(s.staleTime, u))
          ? u.fetch(s)
          : Promise.resolve(u.state.data);
      }
      prefetchQuery(l) {
        return this.fetchQuery(l).then(De).catch(De);
      }
      fetchInfiniteQuery(l) {
        return (l.behavior = Wy(l.pages)), this.fetchQuery(l);
      }
      prefetchInfiniteQuery(l) {
        return this.fetchInfiniteQuery(l).then(De).catch(De);
      }
      ensureInfiniteQueryData(l) {
        return (l.behavior = Wy(l.pages)), this.ensureQueryData(l);
      }
      resumePausedMutations() {
        return Es.isOnline()
          ? B(this, aa).resumePausedMutations()
          : Promise.resolve();
      }
      getQueryCache() {
        return B(this, Vt);
      }
      getMutationCache() {
        return B(this, aa);
      }
      getDefaultOptions() {
        return B(this, la);
      }
      setDefaultOptions(l) {
        yt(this, la, l);
      }
      setQueryDefaults(l, s) {
        B(this, Ul).set(Na(l), { queryKey: l, defaultOptions: s });
      }
      getQueryDefaults(l) {
        const s = [...B(this, Ul).values()],
          u = {};
        return (
          s.forEach((c) => {
            Xi(l, c.queryKey) && Object.assign(u, c.defaultOptions);
          }),
          u
        );
      }
      setMutationDefaults(l, s) {
        B(this, wl).set(Na(l), { mutationKey: l, defaultOptions: s });
      }
      getMutationDefaults(l) {
        const s = [...B(this, wl).values()],
          u = {};
        return (
          s.forEach((c) => {
            Xi(l, c.mutationKey) && Object.assign(u, c.defaultOptions);
          }),
          u
        );
      }
      defaultQueryOptions(l) {
        if (l._defaulted) return l;
        const s = {
          ...B(this, la).queries,
          ...this.getQueryDefaults(l.queryKey),
          ...l,
          _defaulted: !0,
        };
        return (
          s.queryHash || (s.queryHash = xo(s.queryKey, s)),
          s.refetchOnReconnect === void 0 &&
            (s.refetchOnReconnect = s.networkMode !== "always"),
          s.throwOnError === void 0 && (s.throwOnError = !!s.suspense),
          !s.networkMode && s.persister && (s.networkMode = "offlineFirst"),
          s.queryFn === Do && (s.enabled = !1),
          s
        );
      }
      defaultMutationOptions(l) {
        return l != null && l._defaulted
          ? l
          : {
              ...B(this, la).mutations,
              ...((l == null ? void 0 : l.mutationKey) &&
                this.getMutationDefaults(l.mutationKey)),
              ...l,
              _defaulted: !0,
            };
      }
      clear() {
        B(this, Vt).clear(), B(this, aa).clear();
      }
    }),
    (Vt = new WeakMap()),
    (aa = new WeakMap()),
    (la = new WeakMap()),
    (Ul = new WeakMap()),
    (wl = new WeakMap()),
    (ia = new WeakMap()),
    (Nl = new WeakMap()),
    (Ll = new WeakMap()),
    cv);
function Dv(l) {
  return l;
}
function mS(l) {
  return {
    mutationKey: l.options.mutationKey,
    state: l.state,
    ...(l.options.scope && { scope: l.options.scope }),
    ...(l.meta && { meta: l.meta }),
  };
}
function pS(l, s, u) {
  var c;
  return {
    dehydratedAt: Date.now(),
    state: {
      ...l.state,
      ...(l.state.data !== void 0 && { data: s(l.state.data) }),
    },
    queryKey: l.queryKey,
    queryHash: l.queryHash,
    ...(l.state.status === "pending" && {
      promise:
        (c = l.promise) == null
          ? void 0
          : c
              .then(s)
              .catch((f) =>
                u(f)
                  ? Promise.reject(new Error("redacted"))
                  : Promise.reject(f),
              ),
    }),
    ...(l.meta && { meta: l.meta }),
  };
}
function gS(l) {
  return l.state.isPaused;
}
function SS(l) {
  return l.state.status === "success";
}
function bS(l) {
  return !0;
}
function tv(l, s = {}) {
  var S, d, p, m;
  const u =
      s.shouldDehydrateMutation ??
      ((S = l.getDefaultOptions().dehydrate) == null
        ? void 0
        : S.shouldDehydrateMutation) ??
      gS,
    c = l
      .getMutationCache()
      .getAll()
      .flatMap((b) => (u(b) ? [mS(b)] : [])),
    f =
      s.shouldDehydrateQuery ??
      ((d = l.getDefaultOptions().dehydrate) == null
        ? void 0
        : d.shouldDehydrateQuery) ??
      SS,
    h =
      s.shouldRedactErrors ??
      ((p = l.getDefaultOptions().dehydrate) == null
        ? void 0
        : p.shouldRedactErrors) ??
      bS,
    v =
      s.serializeData ??
      ((m = l.getDefaultOptions().dehydrate) == null
        ? void 0
        : m.serializeData) ??
      Dv,
    g = l
      .getQueryCache()
      .getAll()
      .flatMap((b) => (f(b) ? [pS(b, v, h)] : []));
  return { mutations: c, queries: g };
}
function ev(l, s, u) {
  var S;
  if (typeof s != "object" || s === null) return;
  const c = l.getMutationCache(),
    f = l.getQueryCache(),
    h =
      ((S = l.getDefaultOptions().hydrate) == null
        ? void 0
        : S.deserializeData) ?? Dv,
    v = s.mutations || [],
    g = s.queries || [];
  v.forEach(({ state: d, ...p }) => {
    var m, b;
    c.build(
      l,
      {
        ...((m = l.getDefaultOptions().hydrate) == null ? void 0 : m.mutations),
        ...((b = u == null ? void 0 : u.defaultOptions) == null
          ? void 0
          : b.mutations),
        ...p,
      },
      d,
    );
  }),
    g.forEach(
      ({
        queryKey: d,
        state: p,
        queryHash: m,
        meta: b,
        promise: x,
        dehydratedAt: M,
      }) => {
        var P, Y;
        const U = x ? aS(x) : void 0,
          L = p.data === void 0 ? (U == null ? void 0 : U.data) : p.data,
          q = L === void 0 ? L : h(L);
        let K = f.get(m);
        const V = (K == null ? void 0 : K.state.status) === "pending",
          I = (K == null ? void 0 : K.state.fetchStatus) === "fetching";
        if (K) {
          const F = U && M !== void 0 && M > K.state.dataUpdatedAt;
          if (p.dataUpdatedAt > K.state.dataUpdatedAt || F) {
            const { fetchStatus: G, ...w } = p;
            K.setState({ ...w, data: q });
          }
        } else
          K = f.build(
            l,
            {
              ...((P = l.getDefaultOptions().hydrate) == null
                ? void 0
                : P.queries),
              ...((Y = u == null ? void 0 : u.defaultOptions) == null
                ? void 0
                : Y.queries),
              queryKey: d,
              queryHash: m,
              meta: b,
            },
            {
              ...p,
              data: q,
              fetchStatus: "idle",
              status: q !== void 0 ? "success" : p.status,
            },
          );
        x &&
          !V &&
          !I &&
          (M === void 0 || M > K.state.dataUpdatedAt) &&
          K.fetch(void 0, { initialPromise: Promise.resolve(x).then(h) });
      },
    );
}
var Cv = st.createContext(void 0),
  JS = (l) => {
    const s = st.useContext(Cv);
    if (!s)
      throw new Error("No QueryClient set, use QueryClientProvider to set one");
    return s;
  },
  _S = ({ client: l, children: s }) => (
    st.useEffect(
      () => (
        l.mount(),
        () => {
          l.unmount();
        }
      ),
      [l],
    ),
    Z.jsx(Cv.Provider, { value: l, children: s })
  );
function ES(l, s, u) {
  const c = new Set(),
    f = new Set(),
    h = s.getDefaultOptions();
  s.setDefaultOptions({
    ...h,
    queries: {
      ...h.queries,
      _experimental_beforeQuery: (g) => {
        var S, d;
        (d = (S = h.queries) == null ? void 0 : S._experimental_beforeQuery) ==
          null || d.call(S, g);
        const p = g.queryKeyHashFn || Na;
        if (l.isServer) {
          if (c.has(p(g.queryKey))) return;
          if ((c.add(p(g.queryKey)), s.getQueryData(g.queryKey) !== void 0)) {
            g.__skipInjection = !0;
            return;
          }
        } else {
          const m = l.clientSsr.getStreamedValue(
            "__QueryClient__" + p(g.queryKey),
          );
          m && !m.hydrated && ((m.hydrated = !0), ev(s, m));
        }
      },
      _experimental_afterQuery: (g, S) => {
        var d, p;
        const m = g.queryKeyHashFn || Na;
        l.isServer &&
          !g.__skipInjection &&
          s.getQueryData(g.queryKey) !== void 0 &&
          !f.has(m(g.queryKey)) &&
          (f.add(m(g.queryKey)),
          l.serverSsr.streamValue(
            "__QueryClient__" + m(g.queryKey),
            tv(s, {
              shouldDehydrateMutation: () => !1,
              shouldDehydrateQuery: (b) => m(b.queryKey) === m(g.queryKey),
            }),
          )),
          (p = (d = h.queries) == null ? void 0 : d._experimental_afterQuery) ==
            null || p.call(d, g, S);
      },
    },
  });
  {
    const g = s.getMutationCache().config;
    s.getMutationCache().config = {
      ...g,
      onError: (d, p, m, b) => {
        var x;
        return Ye(d)
          ? ((d.options._fromLocation = l.state.location),
            l.navigate(l.resolveRedirect(d).options))
          : (x = g.onError) == null
            ? void 0
            : x.call(g, d, p, m, b);
      },
    };
    const S = s.getQueryCache().config;
    s.getQueryCache().config = {
      ...S,
      onError: (d, p) => {
        var m;
        return Ye(d)
          ? ((d.options._fromLocation = l.state.location),
            l.navigate(l.resolveRedirect(d).options))
          : (m = S.onError) == null
            ? void 0
            : m.call(S, d, p);
      },
    };
  }
  const v = l.options;
  return (
    (l.options = {
      ...l.options,
      dehydrate: () => {
        var g;
        return {
          ...((g = v.dehydrate) == null ? void 0 : g.call(v)),
          dehydratedQueryClient: tv(s),
        };
      },
      hydrate: (g) => {
        var S;
        (S = v.hydrate) == null || S.call(v, g), ev(s, g.dehydratedQueryClient);
      },
      context: { ...v.context, queryClient: s },
      Wrap: ({ children: g }) => {
        const S = st.Fragment,
          d = v.Wrap || st.Fragment;
        return Z.jsx(S, {
          children: Z.jsx(_S, {
            client: s,
            children: Z.jsx(d, { children: g }),
          }),
        });
      },
    }),
    l
  );
}
var RS = function () {
  return null;
};
const TS = function () {
    return null;
  },
  zv = _g()({
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "TanStack Start Starter" },
      ],
    }),
    component: MS,
  });
function MS() {
  return Z.jsx(OS, { children: Z.jsx(Ao, {}) });
}
function OS({ children: l }) {
  return Z.jsxs("html", {
    children: [
      Z.jsx("head", { children: Z.jsx(Yg, {}) }),
      Z.jsxs("body", {
        children: [
          l,
          Z.jsx(TS, { position: "bottom-right" }),
          Z.jsx(RS, { buttonPosition: "bottom-left" }),
          Z.jsx(Xg, {}),
        ],
      }),
    ],
  });
}
var AS = (l, s, u = {}) => {
    let c = `${l}=${s}`;
    if (l.startsWith("__Secure-") && !u.secure)
      throw new Error("__Secure- Cookie must have Secure attributes");
    if (l.startsWith("__Host-")) {
      if (!u.secure)
        throw new Error("__Host- Cookie must have Secure attributes");
      if (u.path !== "/")
        throw new Error('__Host- Cookie must have Path attributes with "/"');
      if (u.domain)
        throw new Error("__Host- Cookie must not have Domain attributes");
    }
    if (u && typeof u.maxAge == "number" && u.maxAge >= 0) {
      if (u.maxAge > 3456e4)
        throw new Error(
          "Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.",
        );
      c += `; Max-Age=${u.maxAge | 0}`;
    }
    if (
      (u.domain && u.prefix !== "host" && (c += `; Domain=${u.domain}`),
      u.path && (c += `; Path=${u.path}`),
      u.expires)
    ) {
      if (u.expires.getTime() - Date.now() > 3456e7)
        throw new Error(
          "Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.",
        );
      c += `; Expires=${u.expires.toUTCString()}`;
    }
    if (
      (u.httpOnly && (c += "; HttpOnly"),
      u.secure && (c += "; Secure"),
      u.sameSite &&
        (c += `; SameSite=${u.sameSite.charAt(0).toUpperCase() + u.sameSite.slice(1)}`),
      u.priority && (c += `; Priority=${u.priority}`),
      u.partitioned)
    ) {
      if (!u.secure)
        throw new Error("Partitioned Cookie must have Secure attributes");
      c += "; Partitioned";
    }
    return c;
  },
  xS = (l, s, u) => ((s = encodeURIComponent(s)), AS(l, s, u)),
  DS = (l, s) => (
    (l = l.replace(/\/+$/, "")),
    (l = l + "/"),
    (s = s.replace(/^\/+/, "")),
    l + s
  ),
  go = (l, s) => {
    for (const [u, c] of Object.entries(s)) {
      const f = new RegExp("/:" + u + "(?:{[^/]+})?\\??");
      l = l.replace(f, c ? `/${c}` : "");
    }
    return l;
  },
  Uv = (l) => {
    const s = new URLSearchParams();
    for (const [u, c] of Object.entries(l))
      if (c !== void 0)
        if (Array.isArray(c)) for (const f of c) s.append(u, f);
        else s.set(u, c);
    return s;
  },
  CS = (l, s) => {
    switch (s) {
      case "ws":
        return l.replace(/^http/, "ws");
      case "http":
        return l.replace(/^ws/, "http");
    }
  },
  zS = (l) =>
    /^https?:\/\/[^\/]+?\/index$/.test(l)
      ? l.replace(/\/index$/, "/")
      : l.replace(/\/index$/, "");
function hs(l) {
  return typeof l == "object" && l !== null && !Array.isArray(l);
}
function wv(l, s) {
  if (!hs(l) && !hs(s)) return s;
  const u = { ...l };
  for (const c in s) {
    const f = s[c];
    hs(u[c]) && hs(f) ? (u[c] = wv(u[c], f)) : (u[c] = f);
  }
  return u;
}
var Nv = (l, s) =>
    new Proxy(() => {}, {
      get(c, f) {
        if (!(typeof f != "string" || f === "then")) return Nv(l, [...s, f]);
      },
      apply(c, f, h) {
        return l({ path: s, args: h });
      },
    }),
  US = class {
    constructor(l, s) {
      In(this, "url");
      In(this, "method");
      In(this, "queryParams");
      In(this, "pathParams", {});
      In(this, "rBody");
      In(this, "cType");
      In(this, "fetch", async (l, s) => {
        if (l) {
          if ((l.query && (this.queryParams = Uv(l.query)), l.form)) {
            const g = new FormData();
            for (const [S, d] of Object.entries(l.form))
              if (Array.isArray(d)) for (const p of d) g.append(S, p);
              else g.append(S, d);
            this.rBody = g;
          }
          l.json &&
            ((this.rBody = JSON.stringify(l.json)),
            (this.cType = "application/json")),
            l.param && (this.pathParams = l.param);
        }
        let u = this.method.toUpperCase();
        const c = {
          ...(l == null ? void 0 : l.header),
          ...(typeof (s == null ? void 0 : s.headers) == "function"
            ? await s.headers()
            : s == null
              ? void 0
              : s.headers),
        };
        if (l != null && l.cookie) {
          const g = [];
          for (const [S, d] of Object.entries(l.cookie))
            g.push(xS(S, d, { path: "/" }));
          c.Cookie = g.join(",");
        }
        this.cType && (c["Content-Type"] = this.cType);
        const f = new Headers(c ?? void 0);
        let h = this.url;
        (h = zS(h)),
          (h = go(h, this.pathParams)),
          this.queryParams && (h = h + "?" + this.queryParams.toString()),
          (u = this.method.toUpperCase());
        const v = !(u === "GET" || u === "HEAD");
        return ((s == null ? void 0 : s.fetch) || fetch)(h, {
          body: v ? this.rBody : void 0,
          method: u,
          headers: f,
          ...(s == null ? void 0 : s.init),
        });
      });
      (this.url = l), (this.method = s);
    }
  },
  Lv = (l, s) =>
    Nv(function u(c) {
      var p;
      const f = [...c.path],
        h = f.slice(-3).reverse();
      if (h[0] === "toString")
        return h[1] === "name" ? h[2] || "" : u.toString();
      if (h[0] === "valueOf") return h[1] === "name" ? h[2] || "" : u;
      let v = "";
      if (/^\$/.test(h[0])) {
        const m = f.pop();
        m && (v = m.replace(/^\$/, ""));
      }
      const g = f.join("/"),
        S = DS(l, g);
      if (v === "url") {
        let m = S;
        return (
          c.args[0] &&
            (c.args[0].param && (m = go(S, c.args[0].param)),
            c.args[0].query && (m = m + "?" + Uv(c.args[0].query).toString())),
          new URL(m)
        );
      }
      if (v === "ws") {
        const m = CS(
            c.args[0] && c.args[0].param ? go(S, c.args[0].param) : S,
            "ws",
          ),
          b = new URL(m),
          x = (p = c.args[0]) == null ? void 0 : p.query;
        return (
          x &&
            Object.entries(x).forEach(([U, L]) => {
              Array.isArray(L)
                ? L.forEach((q) => b.searchParams.append(U, q))
                : b.searchParams.set(U, L);
            }),
          ((...U) =>
            (s == null ? void 0 : s.webSocket) !== void 0 &&
            typeof s.webSocket == "function"
              ? s.webSocket(...U)
              : new WebSocket(...U))(b.toString())
        );
      }
      const d = new US(S, v);
      if (v) {
        s ?? (s = {});
        const m = wv(s, { ...c.args[1] });
        return d.fetch(c.args[0], m);
      }
      return d;
    }, []);
(function () {
  try {
    var l =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      s = new l.Error().stack;
    s &&
      ((l._sentryDebugIds = l._sentryDebugIds || {}),
      (l._sentryDebugIds[s] = "27019755-2e0b-5d99-98ee-b03b00706956"));
  } catch {}
})();
Lv("");
function wS(...l) {
  return Lv(...l);
}
const NS = wS("http://localhost:3001"),
  LS = async () => await (await NS.healthcheck.$get()).json(),
  HS = { queryKey: ["healthcheck"], queryFn: LS },
  jS = () => Wp(() => import("./index-Diczsq7v.js"), []),
  Hv = vo("/")({
    component: wg(jS, "component", () => Hv.ssr),
    loader: ({ context: l }) => {
      l.queryClient.ensureQueryData(HS);
    },
  }),
  BS = Hv.update({ id: "/", path: "/", getParentRoute: () => zv }),
  qS = { IndexRoute: BS },
  QS = zv._addFileChildren(qS)._addFileTypes();
function GS() {
  const l = new vS();
  return ES(
    jg({
      routeTree: QS,
      context: { queryClient: l },
      defaultPreload: "intent",
    }),
    l,
  );
}
const YS = GS();
st.startTransition(() => {
  op.hydrateRoot(
    document,
    Z.jsx(st.StrictMode, { children: Z.jsx(Kg, { router: YS }) }),
  );
});
export {
  Os as S,
  mo as a,
  Jg as b,
  rS as c,
  $g as d,
  he as e,
  Tv as f,
  st as g,
  ZS as h,
  As as i,
  Z as j,
  HS as k,
  De as n,
  nS as p,
  Fg as r,
  KS as s,
  kg as t,
  JS as u,
};
