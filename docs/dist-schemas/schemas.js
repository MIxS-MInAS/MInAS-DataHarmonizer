!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define([], t)
    : 'object' == typeof exports
    ? (exports.schemas = t())
    : (e.schemas = t());
})(this, () =>
  (() => {
    var e,
      t,
      n,
      i,
      a = {
        69: (e, t, n) => {
          var i = {
            './mixs-minas/export.js': [884, 884],
            './mpox/export.js': [960, 960],
            './new/export.js': [4, 4],
            './schema_editor/export.js': [73, 73],
            './test/export.js': [902, 902],
          };
          function a(e) {
            if (!n.o(i, e))
              return Promise.resolve().then(() => {
                var t = new Error("Cannot find module '" + e + "'");
                throw ((t.code = 'MODULE_NOT_FOUND'), t);
              });
            var t = i[e],
              a = t[0];
            return n.e(t[1]).then(() => n(a));
          }
          (a.keys = () => Object.keys(i)), (a.id = 69), (e.exports = a);
        },
        973: (e, t, n) => {
          var i = {
            './mixs-minas/schema.json': [414, 414],
            './mpox/schema.json': [922, 922],
            './new/schema.json': [894, 894],
            './schema_editor/schema.json': [451, 451],
            './test/locales/de/schema.json': [114, 114],
            './test/locales/fr/schema.json': [811, 811],
            './test/schema.json': [64, 64],
          };
          function a(e) {
            if (!n.o(i, e))
              return Promise.resolve().then(() => {
                var t = new Error("Cannot find module '" + e + "'");
                throw ((t.code = 'MODULE_NOT_FOUND'), t);
              });
            var t = i[e],
              a = t[0];
            return n.e(t[1]).then(() => n.t(a, 19));
          }
          (a.keys = () => Object.keys(i)), (a.id = 973), (e.exports = a);
        },
      },
      r = {};
    function s(e) {
      var t = r[e];
      if (void 0 !== t) return t.exports;
      var n = (r[e] = { exports: {} });
      return a[e](n, n.exports, s), n.exports;
    }
    (s.m = a),
      (t = Object.getPrototypeOf
        ? (e) => Object.getPrototypeOf(e)
        : (e) => e.__proto__),
      (s.t = function (n, i) {
        if ((1 & i && (n = this(n)), 8 & i)) return n;
        if ('object' == typeof n && n) {
          if (4 & i && n.__esModule) return n;
          if (16 & i && 'function' == typeof n.then) return n;
        }
        var a = Object.create(null);
        s.r(a);
        var r = {};
        e = e || [null, t({}), t([]), t(t)];
        for (
          var o = 2 & i && n;
          'object' == typeof o && !~e.indexOf(o);
          o = t(o)
        )
          Object.getOwnPropertyNames(o).forEach((e) => (r[e] = () => n[e]));
        return (r.default = () => n), s.d(a, r), a;
      }),
      (s.d = (e, t) => {
        for (var n in t)
          s.o(t, n) &&
            !s.o(e, n) &&
            Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
      }),
      (s.f = {}),
      (s.e = (e) =>
        Promise.all(Object.keys(s.f).reduce((t, n) => (s.f[n](e, t), t), []))),
      (s.u = (e) => e + '.js'),
      (s.g = (function () {
        if ('object' == typeof globalThis) return globalThis;
        try {
          return this || new Function('return this')();
        } catch (e) {
          if ('object' == typeof window) return window;
        }
      })()),
      (s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
      (n = {}),
      (i = 'schemas:'),
      (s.l = (e, t, a, r) => {
        if (n[e]) n[e].push(t);
        else {
          var o, c;
          if (void 0 !== a)
            for (
              var m = document.getElementsByTagName('script'), u = 0;
              u < m.length;
              u++
            ) {
              var d = m[u];
              if (
                d.getAttribute('src') == e ||
                d.getAttribute('data-webpack') == i + a
              ) {
                o = d;
                break;
              }
            }
          o ||
            ((c = !0),
            ((o = document.createElement('script')).charset = 'utf-8'),
            (o.timeout = 120),
            s.nc && o.setAttribute('nonce', s.nc),
            o.setAttribute('data-webpack', i + a),
            (o.src = e)),
            (n[e] = [t]);
          var l = (t, i) => {
              (o.onerror = o.onload = null), clearTimeout(p);
              var a = n[e];
              if (
                (delete n[e],
                o.parentNode && o.parentNode.removeChild(o),
                a && a.forEach((e) => e(i)),
                t)
              )
                return t(i);
            },
            p = setTimeout(
              l.bind(null, void 0, { type: 'timeout', target: o }),
              12e4
            );
          (o.onerror = l.bind(null, o.onerror)),
            (o.onload = l.bind(null, o.onload)),
            c && document.head.appendChild(o);
        }
      }),
      (s.r = (e) => {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (() => {
        var e;
        s.g.importScripts && (e = s.g.location + '');
        var t = s.g.document;
        if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
          var n = t.getElementsByTagName('script');
          if (n.length)
            for (
              var i = n.length - 1;
              i > -1 && (!e || !/^http(s?):/.test(e));

            )
              e = n[i--].src;
        }
        if (!e)
          throw new Error(
            'Automatic publicPath is not supported in this browser'
          );
        (e = e
          .replace(/#.*$/, '')
          .replace(/\?.*$/, '')
          .replace(/\/[^\/]+$/, '/')),
          (s.p = e);
      })(),
      (() => {
        var e = { 213: 0 };
        s.f.j = (t, n) => {
          var i = s.o(e, t) ? e[t] : void 0;
          if (0 !== i)
            if (i) n.push(i[2]);
            else {
              var a = new Promise((n, a) => (i = e[t] = [n, a]));
              n.push((i[2] = a));
              var r = s.p + s.u(t),
                o = new Error();
              s.l(
                r,
                (n) => {
                  if (s.o(e, t) && (0 !== (i = e[t]) && (e[t] = void 0), i)) {
                    var a = n && ('load' === n.type ? 'missing' : n.type),
                      r = n && n.target && n.target.src;
                    (o.message =
                      'Loading chunk ' +
                      t +
                      ' failed.\n(' +
                      a +
                      ': ' +
                      r +
                      ')'),
                      (o.name = 'ChunkLoadError'),
                      (o.type = a),
                      (o.request = r),
                      i[1](o);
                  }
                },
                'chunk-' + t,
                t
              );
            }
        };
        var t = (t, n) => {
            var i,
              a,
              [r, o, c] = n,
              m = 0;
            if (r.some((t) => 0 !== e[t])) {
              for (i in o) s.o(o, i) && (s.m[i] = o[i]);
              c && c(s);
            }
            for (t && t(n); m < r.length; m++)
              (a = r[m]), s.o(e, a) && e[a] && e[a][0](), (e[a] = 0);
          },
          n = (this.webpackChunkschemas = this.webpackChunkschemas || []);
        n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
      })();
    var o = {};
    return (
      (() => {
        'use strict';
        s.r(o),
          s.d(o, {
            getExportFormats: () => n,
            getSchema: () => t,
            menu: () => e,
          });
        const e = JSON.parse(
            '{"mixs":{"folder":"mixs-minas","id":"https://w3id.org/mixs","version":"v6.2.0","templates":{"Ancient":{"name":"Ancient","display":true},"RadiocarbonDating":{"name":"RadiocarbonDating","display":true},"MigsOrgHostAssociatedAncient":{"name":"MigsOrgHostAssociatedAncient","display":true},"MigsOrgHumanAssociatedAncient":{"name":"MigsOrgHumanAssociatedAncient","display":true},"MiuvigHostAssociatedAncient":{"name":"MiuvigHostAssociatedAncient","display":true},"MiuvigHumanAssociatedAncient":{"name":"MiuvigHumanAssociatedAncient","display":true},"MimagHostAssociatedAncient":{"name":"MimagHostAssociatedAncient","display":true},"MimagHumanAssociatedAncient":{"name":"MimagHumanAssociatedAncient","display":true},"MimagHumanOralAncient":{"name":"MimagHumanOralAncient","display":true},"MimagHumanGutAncient":{"name":"MimagHumanGutAncient","display":true},"MimagHumanSkinAncient":{"name":"MimagHumanSkinAncient","display":true},"MimagSedimentAncient":{"name":"MimagSedimentAncient","display":true},"MimagSoilAncient":{"name":"MimagSoilAncient","display":true},"MimsHostAssociatedAncient":{"name":"MimsHostAssociatedAncient","display":true},"MimsHumanAssociatedAncient":{"name":"MimsHumanAssociatedAncient","display":true},"MimsHumanOralAncient":{"name":"MimsHumanOralAncient","display":true},"MimsHumanGutAncient":{"name":"MimsHumanGutAncient","display":true},"MimsHumanSkinAncient":{"name":"MimsHumanSkinAncient","display":true},"MimsSedimentAncient":{"name":"MimsSedimentAncient","display":true},"MimsSoilAncient":{"name":"MimsSoilAncient","display":true},"MimsPlantAssociatedAncient":{"name":"MimsPlantAssociatedAncient","display":true},"MimsSymbiontAssociatedAncient":{"name":"MimsSymbiontAssociatedAncient","display":true}}}}'
          ),
          t = async (e) => (await s(973)(`./${e}/schema.json`)).default,
          n = async (e) => (await s(69)(`./${e}/export.js`)).default;
      })(),
      o
    );
  })()
);
