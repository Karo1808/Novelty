var dt = (e) => {
  throw TypeError(e);
};
var Y = (e, t, s) => t.has(e) || dt("Cannot " + s);
var i = (e, t, s) => (
    Y(e, t, "read from private field"), s ? s.call(e) : t.get(e)
  ),
  b = (e, t, s) =>
    t.has(e)
      ? dt("Cannot add the same private member more than once")
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, s),
  c = (e, t, s, r) => (
    Y(e, t, "write to private field"), r ? r.call(e, s) : t.set(e, s), s
  ),
  d = (e, t, s) => (Y(e, t, "access private method"), s);
import {
  S as Ot,
  p as ft,
  r as S,
  s as Z,
  a as A,
  n as $,
  i as q,
  b as pt,
  t as Et,
  f as xt,
  c as wt,
  d as bt,
  e as Rt,
  g as O,
  h as Qt,
  u as It,
  j as Tt,
  k as Ft,
} from "./main-D3RT35Xj.js";
var y,
  n,
  z,
  g,
  I,
  U,
  E,
  x,
  N,
  _,
  M,
  T,
  F,
  w,
  P,
  a,
  H,
  tt,
  et,
  st,
  it,
  rt,
  nt,
  at,
  Ct,
  vt,
  Dt =
    ((vt = class extends Ot {
      constructor(t, s) {
        super();
        b(this, a);
        b(this, y);
        b(this, n);
        b(this, z);
        b(this, g);
        b(this, I);
        b(this, U);
        b(this, E);
        b(this, x);
        b(this, N);
        b(this, _);
        b(this, M);
        b(this, T);
        b(this, F);
        b(this, w);
        b(this, P, new Set());
        (this.options = s),
          c(this, y, t),
          c(this, x, null),
          c(this, E, ft()),
          this.options.experimental_prefetchInRender ||
            i(this, E).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled",
              ),
            ),
          this.bindMethods(),
          this.setOptions(s);
      }
      bindMethods() {
        this.refetch = this.refetch.bind(this);
      }
      onSubscribe() {
        this.listeners.size === 1 &&
          (i(this, n).addObserver(this),
          gt(i(this, n), this.options)
            ? d(this, a, H).call(this)
            : this.updateResult(),
          d(this, a, it).call(this));
      }
      onUnsubscribe() {
        this.hasListeners() || this.destroy();
      }
      shouldFetchOnReconnect() {
        return ht(i(this, n), this.options, this.options.refetchOnReconnect);
      }
      shouldFetchOnWindowFocus() {
        return ht(i(this, n), this.options, this.options.refetchOnWindowFocus);
      }
      destroy() {
        (this.listeners = new Set()),
          d(this, a, rt).call(this),
          d(this, a, nt).call(this),
          i(this, n).removeObserver(this);
      }
      setOptions(t) {
        const s = this.options,
          r = i(this, n);
        if (
          ((this.options = i(this, y).defaultQueryOptions(t)),
          this.options.enabled !== void 0 &&
            typeof this.options.enabled != "boolean" &&
            typeof this.options.enabled != "function" &&
            typeof S(this.options.enabled, i(this, n)) != "boolean")
        )
          throw new Error(
            "Expected enabled to be a boolean or a callback that returns a boolean",
          );
        d(this, a, at).call(this),
          i(this, n).setOptions(this.options),
          s._defaulted &&
            !Z(this.options, s) &&
            i(this, y)
              .getQueryCache()
              .notify({
                type: "observerOptionsUpdated",
                query: i(this, n),
                observer: this,
              });
        const u = this.hasListeners();
        u && yt(i(this, n), r, this.options, s) && d(this, a, H).call(this),
          this.updateResult(),
          u &&
            (i(this, n) !== r ||
              S(this.options.enabled, i(this, n)) !==
                S(s.enabled, i(this, n)) ||
              A(this.options.staleTime, i(this, n)) !==
                A(s.staleTime, i(this, n))) &&
            d(this, a, tt).call(this);
        const h = d(this, a, et).call(this);
        u &&
          (i(this, n) !== r ||
            S(this.options.enabled, i(this, n)) !== S(s.enabled, i(this, n)) ||
            h !== i(this, w)) &&
          d(this, a, st).call(this, h);
      }
      getOptimisticResult(t) {
        const s = i(this, y).getQueryCache().build(i(this, y), t),
          r = this.createResult(s, t);
        return (
          _t(this, r) &&
            (c(this, g, r),
            c(this, U, this.options),
            c(this, I, i(this, n).state)),
          r
        );
      }
      getCurrentResult() {
        return i(this, g);
      }
      trackResult(t, s) {
        return new Proxy(t, {
          get: (r, u) => (
            this.trackProp(u), s == null || s(u), Reflect.get(r, u)
          ),
        });
      }
      trackProp(t) {
        i(this, P).add(t);
      }
      getCurrentQuery() {
        return i(this, n);
      }
      refetch({ ...t } = {}) {
        return this.fetch({ ...t });
      }
      fetchOptimistic(t) {
        const s = i(this, y).defaultQueryOptions(t),
          r = i(this, y).getQueryCache().build(i(this, y), s);
        return r.fetch().then(() => this.createResult(r, s));
      }
      fetch(t) {
        return d(this, a, H)
          .call(this, { ...t, cancelRefetch: t.cancelRefetch ?? !0 })
          .then(() => (this.updateResult(), i(this, g)));
      }
      createResult(t, s) {
        var lt;
        const r = i(this, n),
          u = this.options,
          h = i(this, g),
          o = i(this, I),
          Q = i(this, U),
          R = t !== r ? t.state : i(this, z),
          { state: L } = t;
        let l = { ...L },
          k = !1,
          f;
        if (s._optimisticResults) {
          const v = this.hasListeners(),
            W = !v && gt(t, s),
            D = v && yt(t, r, s, u);
          (W || D) && (l = { ...l, ...wt(L.data, t.options) }),
            s._optimisticResults === "isRestoring" && (l.fetchStatus = "idle");
        }
        let { error: j, errorUpdatedAt: B, status: m } = l;
        f = l.data;
        let V = !1;
        if (s.placeholderData !== void 0 && f === void 0 && m === "pending") {
          let v;
          h != null &&
          h.isPlaceholderData &&
          s.placeholderData === (Q == null ? void 0 : Q.placeholderData)
            ? ((v = h.data), (V = !0))
            : (v =
                typeof s.placeholderData == "function"
                  ? s.placeholderData(
                      (lt = i(this, M)) == null ? void 0 : lt.state.data,
                      i(this, M),
                    )
                  : s.placeholderData),
            v !== void 0 &&
              ((m = "success"),
              (f = bt(h == null ? void 0 : h.data, v, s)),
              (k = !0));
        }
        if (s.select && f !== void 0 && !V)
          if (
            h &&
            f === (o == null ? void 0 : o.data) &&
            s.select === i(this, N)
          )
            f = i(this, _);
          else
            try {
              c(this, N, s.select),
                (f = s.select(f)),
                (f = bt(h == null ? void 0 : h.data, f, s)),
                c(this, _, f),
                c(this, x, null);
            } catch (v) {
              c(this, x, v);
            }
        i(this, x) &&
          ((j = i(this, x)), (f = i(this, _)), (B = Date.now()), (m = "error"));
        const K = l.fetchStatus === "fetching",
          G = m === "pending",
          X = m === "error",
          ct = G && K,
          ut = f !== void 0,
          C = {
            status: m,
            fetchStatus: l.fetchStatus,
            isPending: G,
            isSuccess: m === "success",
            isError: X,
            isInitialLoading: ct,
            isLoading: ct,
            data: f,
            dataUpdatedAt: l.dataUpdatedAt,
            error: j,
            errorUpdatedAt: B,
            failureCount: l.fetchFailureCount,
            failureReason: l.fetchFailureReason,
            errorUpdateCount: l.errorUpdateCount,
            isFetched: l.dataUpdateCount > 0 || l.errorUpdateCount > 0,
            isFetchedAfterMount:
              l.dataUpdateCount > R.dataUpdateCount ||
              l.errorUpdateCount > R.errorUpdateCount,
            isFetching: K,
            isRefetching: K && !G,
            isLoadingError: X && !ut,
            isPaused: l.fetchStatus === "paused",
            isPlaceholderData: k,
            isRefetchError: X && ut,
            isStale: ot(t, s),
            refetch: this.refetch,
            promise: i(this, E),
          };
        if (this.options.experimental_prefetchInRender) {
          const v = (J) => {
              C.status === "error"
                ? J.reject(C.error)
                : C.data !== void 0 && J.resolve(C.data);
            },
            W = () => {
              const J = c(this, E, (C.promise = ft()));
              v(J);
            },
            D = i(this, E);
          switch (D.status) {
            case "pending":
              t.queryHash === r.queryHash && v(D);
              break;
            case "fulfilled":
              (C.status === "error" || C.data !== D.value) && W();
              break;
            case "rejected":
              (C.status !== "error" || C.error !== D.reason) && W();
              break;
          }
        }
        return C;
      }
      updateResult() {
        const t = i(this, g),
          s = this.createResult(i(this, n), this.options);
        if (
          (c(this, I, i(this, n).state),
          c(this, U, this.options),
          i(this, I).data !== void 0 && c(this, M, i(this, n)),
          Z(s, t))
        )
          return;
        c(this, g, s);
        const r = () => {
          if (!t) return !0;
          const { notifyOnChangeProps: u } = this.options,
            h = typeof u == "function" ? u() : u;
          if (h === "all" || (!h && !i(this, P).size)) return !0;
          const o = new Set(h ?? i(this, P));
          return (
            this.options.throwOnError && o.add("error"),
            Object.keys(i(this, g)).some((Q) => {
              const p = Q;
              return i(this, g)[p] !== t[p] && o.has(p);
            })
          );
        };
        d(this, a, Ct).call(this, { listeners: r() });
      }
      onQueryUpdate() {
        this.updateResult(), this.hasListeners() && d(this, a, it).call(this);
      }
    }),
    (y = new WeakMap()),
    (n = new WeakMap()),
    (z = new WeakMap()),
    (g = new WeakMap()),
    (I = new WeakMap()),
    (U = new WeakMap()),
    (E = new WeakMap()),
    (x = new WeakMap()),
    (N = new WeakMap()),
    (_ = new WeakMap()),
    (M = new WeakMap()),
    (T = new WeakMap()),
    (F = new WeakMap()),
    (w = new WeakMap()),
    (P = new WeakMap()),
    (a = new WeakSet()),
    (H = function (t) {
      d(this, a, at).call(this);
      let s = i(this, n).fetch(this.options, t);
      return (t != null && t.throwOnError) || (s = s.catch($)), s;
    }),
    (tt = function () {
      d(this, a, rt).call(this);
      const t = A(this.options.staleTime, i(this, n));
      if (q || i(this, g).isStale || !pt(t)) return;
      const r = Et(i(this, g).dataUpdatedAt, t) + 1;
      c(
        this,
        T,
        setTimeout(() => {
          i(this, g).isStale || this.updateResult();
        }, r),
      );
    }),
    (et = function () {
      return (
        (typeof this.options.refetchInterval == "function"
          ? this.options.refetchInterval(i(this, n))
          : this.options.refetchInterval) ?? !1
      );
    }),
    (st = function (t) {
      d(this, a, nt).call(this),
        c(this, w, t),
        !(
          q ||
          S(this.options.enabled, i(this, n)) === !1 ||
          !pt(i(this, w)) ||
          i(this, w) === 0
        ) &&
          c(
            this,
            F,
            setInterval(
              () => {
                (this.options.refetchIntervalInBackground || xt.isFocused()) &&
                  d(this, a, H).call(this);
              },
              i(this, w),
            ),
          );
    }),
    (it = function () {
      d(this, a, tt).call(this),
        d(this, a, st).call(this, d(this, a, et).call(this));
    }),
    (rt = function () {
      i(this, T) && (clearTimeout(i(this, T)), c(this, T, void 0));
    }),
    (nt = function () {
      i(this, F) && (clearInterval(i(this, F)), c(this, F, void 0));
    }),
    (at = function () {
      const t = i(this, y).getQueryCache().build(i(this, y), this.options);
      if (t === i(this, n)) return;
      const s = i(this, n);
      c(this, n, t),
        c(this, z, t.state),
        this.hasListeners() &&
          (s == null || s.removeObserver(this), t.addObserver(this));
    }),
    (Ct = function (t) {
      Rt.batch(() => {
        t.listeners &&
          this.listeners.forEach((s) => {
            s(i(this, g));
          }),
          i(this, y)
            .getQueryCache()
            .notify({ query: i(this, n), type: "observerResultsUpdated" });
      });
    }),
    vt);
function Ut(e, t) {
  return (
    S(t.enabled, e) !== !1 &&
    e.state.data === void 0 &&
    !(e.state.status === "error" && t.retryOnMount === !1)
  );
}
function gt(e, t) {
  return Ut(e, t) || (e.state.data !== void 0 && ht(e, t, t.refetchOnMount));
}
function ht(e, t, s) {
  if (S(t.enabled, e) !== !1 && A(t.staleTime, e) !== "static") {
    const r = typeof s == "function" ? s(e) : s;
    return r === "always" || (r !== !1 && ot(e, t));
  }
  return !1;
}
function yt(e, t, s, r) {
  return (
    (e !== t || S(r.enabled, e) === !1) &&
    (!s.suspense || e.state.status !== "error") &&
    ot(e, s)
  );
}
function ot(e, t) {
  return S(t.enabled, e) !== !1 && e.isStaleByTime(A(t.staleTime, e));
}
function _t(e, t) {
  return !Z(e.getCurrentResult(), t);
}
var St = O.createContext(!1),
  Mt = () => O.useContext(St);
St.Provider;
function Pt() {
  let e = !1;
  return {
    clearReset: () => {
      e = !1;
    },
    reset: () => {
      e = !0;
    },
    isReset: () => e,
  };
}
var Lt = O.createContext(Pt()),
  kt = () => O.useContext(Lt),
  jt = (e, t) => {
    (e.suspense || e.throwOnError || e.experimental_prefetchInRender) &&
      (t.isReset() || (e.retryOnMount = !1));
  },
  Bt = (e) => {
    O.useEffect(() => {
      e.clearReset();
    }, [e]);
  },
  Ht = ({
    result: e,
    errorResetBoundary: t,
    throwOnError: s,
    query: r,
    suspense: u,
  }) =>
    e.isError &&
    !t.isReset() &&
    !e.isFetching &&
    r &&
    ((u && e.data === void 0) || Qt(s, [e.error, r])),
  At = (e, t) => t.state.data === void 0,
  zt = (e) => {
    if (e.suspense) {
      const t = (r) => (r === "static" ? r : Math.max(r ?? 1e3, 1e3)),
        s = e.staleTime;
      (e.staleTime = typeof s == "function" ? (...r) => t(s(...r)) : t(s)),
        typeof e.gcTime == "number" && (e.gcTime = Math.max(e.gcTime, 1e3));
    }
  },
  Nt = (e, t) => e.isLoading && e.isFetching && !t,
  Vt = (e, t) => (e == null ? void 0 : e.suspense) && t.isPending,
  mt = (e, t, s) =>
    t.fetchOptimistic(e).catch(() => {
      s.clearReset();
    });
function Wt(e, t, s) {
  var l, k, f, j, B;
  const r = Mt(),
    u = kt(),
    h = It(),
    o = h.defaultQueryOptions(e);
  (k =
    (l = h.getDefaultOptions().queries) == null
      ? void 0
      : l._experimental_beforeQuery) == null || k.call(l, o),
    (o._optimisticResults = r ? "isRestoring" : "optimistic"),
    zt(o),
    jt(o, u),
    Bt(u);
  const Q = !h.getQueryCache().get(o.queryHash),
    [p] = O.useState(() => new t(h, o)),
    R = p.getOptimisticResult(o),
    L = !r && e.subscribed !== !1;
  if (
    (O.useSyncExternalStore(
      O.useCallback(
        (m) => {
          const V = L ? p.subscribe(Rt.batchCalls(m)) : $;
          return p.updateResult(), V;
        },
        [p, L],
      ),
      () => p.getCurrentResult(),
      () => p.getCurrentResult(),
    ),
    O.useEffect(() => {
      p.setOptions(o);
    }, [o, p]),
    Vt(o, R))
  )
    throw mt(o, p, u);
  if (
    Ht({
      result: R,
      errorResetBoundary: u,
      throwOnError: o.throwOnError,
      query: h.getQueryCache().get(o.queryHash),
      suspense: o.suspense,
    })
  )
    throw R.error;
  if (
    ((j =
      (f = h.getDefaultOptions().queries) == null
        ? void 0
        : f._experimental_afterQuery) == null || j.call(f, o, R),
    o.experimental_prefetchInRender && !q && Nt(R, r))
  ) {
    const m = Q
      ? mt(o, p, u)
      : (B = h.getQueryCache().get(o.queryHash)) == null
        ? void 0
        : B.promise;
    m == null ||
      m.catch($).finally(() => {
        p.updateResult();
      });
  }
  return o.notifyOnChangeProps ? R : p.trackResult(R);
}
function Jt(e, t) {
  return Wt(
    {
      ...e,
      enabled: !0,
      suspense: !0,
      throwOnError: At,
      placeholderData: void 0,
    },
    Dt,
  );
}
const Yt = function () {
  const { data: t } = Jt(Ft);
  return Tt.jsx("div", { children: JSON.stringify(t) });
};
export { Yt as component };
