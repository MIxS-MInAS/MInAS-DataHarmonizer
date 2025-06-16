!(function (s, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define([], e)
    : 'object' == typeof exports
    ? (exports.schemas = e())
    : (s.schemas = e());
})(this, () =>
  (() => {
    var s,
      e,
      t,
      a,
      i = {
        69: (s, e, t) => {
          var a = {
            './mixs-minas/export.js': [884, 884],
            './mpox/export.js': [960, 960],
            './new/export.js': [4, 4],
          };
          function i(s) {
            if (!t.o(a, s))
              return Promise.resolve().then(() => {
                var e = new Error("Cannot find module '" + s + "'");
                throw ((e.code = 'MODULE_NOT_FOUND'), e);
              });
            var e = a[s],
              i = e[0];
            return t.e(e[1]).then(() => t(i));
          }
          (i.keys = () => Object.keys(a)), (i.id = 69), (s.exports = i);
        },
        973: (s, e, t) => {
          var a = {
            './mixs-minas/schema.json': [414, 414],
            './mpox/schema.json': [922, 922],
            './new/schema.json': [894, 894],
          };
          function i(s) {
            if (!t.o(a, s))
              return Promise.resolve().then(() => {
                var e = new Error("Cannot find module '" + s + "'");
                throw ((e.code = 'MODULE_NOT_FOUND'), e);
              });
            var e = a[s],
              i = e[0];
            return t.e(e[1]).then(() => t.t(i, 19));
          }
          (i.keys = () => Object.keys(a)), (i.id = 973), (s.exports = i);
        },
      },
      n = {};
    function u(s) {
      var e = n[s];
      if (void 0 !== e) return e.exports;
      var t = (n[s] = { exports: {} });
      return i[s](t, t.exports, u), t.exports;
    }
    (u.m = i),
      (e = Object.getPrototypeOf
        ? (s) => Object.getPrototypeOf(s)
        : (s) => s.__proto__),
      (u.t = function (t, a) {
        if ((1 & a && (t = this(t)), 8 & a)) return t;
        if ('object' == typeof t && t) {
          if (4 & a && t.__esModule) return t;
          if (16 & a && 'function' == typeof t.then) return t;
        }
        var i = Object.create(null);
        u.r(i);
        var n = {};
        s = s || [null, e({}), e([]), e(e)];
        for (
          var l = 2 & a && t;
          'object' == typeof l && !~s.indexOf(l);
          l = e(l)
        )
          Object.getOwnPropertyNames(l).forEach((s) => (n[s] = () => t[s]));
        return (n.default = () => t), u.d(i, n), i;
      }),
      (u.d = (s, e) => {
        for (var t in e)
          u.o(e, t) &&
            !u.o(s, t) &&
            Object.defineProperty(s, t, { enumerable: !0, get: e[t] });
      }),
      (u.f = {}),
      (u.e = (s) =>
        Promise.all(Object.keys(u.f).reduce((e, t) => (u.f[t](s, e), e), []))),
      (u.u = (s) => s + '.js'),
      (u.g = (function () {
        if ('object' == typeof globalThis) return globalThis;
        try {
          return this || new Function('return this')();
        } catch (s) {
          if ('object' == typeof window) return window;
        }
      })()),
      (u.o = (s, e) => Object.prototype.hasOwnProperty.call(s, e)),
      (t = {}),
      (a = 'schemas:'),
      (u.l = (s, e, i, n) => {
        if (t[s]) t[s].push(e);
        else {
          var l, m;
          if (void 0 !== i)
            for (
              var o = document.getElementsByTagName('script'), d = 0;
              d < o.length;
              d++
            ) {
              var r = o[d];
              if (
                r.getAttribute('src') == s ||
                r.getAttribute('data-webpack') == a + i
              ) {
                l = r;
                break;
              }
            }
          l ||
            ((m = !0),
            ((l = document.createElement('script')).charset = 'utf-8'),
            (l.timeout = 120),
            u.nc && l.setAttribute('nonce', u.nc),
            l.setAttribute('data-webpack', a + i),
            (l.src = s)),
            (t[s] = [e]);
          var p = (e, a) => {
              (l.onerror = l.onload = null), clearTimeout(c);
              var i = t[s];
              if (
                (delete t[s],
                l.parentNode && l.parentNode.removeChild(l),
                i && i.forEach((s) => s(a)),
                e)
              )
                return e(a);
            },
            c = setTimeout(
              p.bind(null, void 0, { type: 'timeout', target: l }),
              12e4
            );
          (l.onerror = p.bind(null, l.onerror)),
            (l.onload = p.bind(null, l.onload)),
            m && document.head.appendChild(l);
        }
      }),
      (u.r = (s) => {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(s, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(s, '__esModule', { value: !0 });
      }),
      (() => {
        var s;
        u.g.importScripts && (s = u.g.location + '');
        var e = u.g.document;
        if (!s && e && (e.currentScript && (s = e.currentScript.src), !s)) {
          var t = e.getElementsByTagName('script');
          if (t.length)
            for (
              var a = t.length - 1;
              a > -1 && (!s || !/^http(s?):/.test(s));

            )
              s = t[a--].src;
        }
        if (!s)
          throw new Error(
            'Automatic publicPath is not supported in this browser'
          );
        (s = s
          .replace(/#.*$/, '')
          .replace(/\?.*$/, '')
          .replace(/\/[^\/]+$/, '/')),
          (u.p = s);
      })(),
      (() => {
        var s = { 213: 0 };
        u.f.j = (e, t) => {
          var a = u.o(s, e) ? s[e] : void 0;
          if (0 !== a)
            if (a) t.push(a[2]);
            else {
              var i = new Promise((t, i) => (a = s[e] = [t, i]));
              t.push((a[2] = i));
              var n = u.p + u.u(e),
                l = new Error();
              u.l(
                n,
                (t) => {
                  if (u.o(s, e) && (0 !== (a = s[e]) && (s[e] = void 0), a)) {
                    var i = t && ('load' === t.type ? 'missing' : t.type),
                      n = t && t.target && t.target.src;
                    (l.message =
                      'Loading chunk ' +
                      e +
                      ' failed.\n(' +
                      i +
                      ': ' +
                      n +
                      ')'),
                      (l.name = 'ChunkLoadError'),
                      (l.type = i),
                      (l.request = n),
                      a[1](l);
                  }
                },
                'chunk-' + e,
                e
              );
            }
        };
        var e = (e, t) => {
            var a,
              i,
              [n, l, m] = t,
              o = 0;
            if (n.some((e) => 0 !== s[e])) {
              for (a in l) u.o(l, a) && (u.m[a] = l[a]);
              m && m(u);
            }
            for (e && e(t); o < n.length; o++)
              (i = n[o]), u.o(s, i) && s[i] && s[i][0](), (s[i] = 0);
          },
          t = (this.webpackChunkschemas = this.webpackChunkschemas || []);
        t.forEach(e.bind(null, 0)), (t.push = e.bind(null, t.push.bind(t)));
      })();
    var l = {};
    return (
      (() => {
        'use strict';
        u.r(l),
          u.d(l, {
            getExportFormats: () => t,
            getSchema: () => e,
            menu: () => s,
          });
        const s = JSON.parse(
            '{"mpox":{"Mpox":{"name":"Mpox","status":"published","display":false},"MpoxInternational":{"name":"MpoxInternational","status":"published","display":false}},"mixs-minas":{"MigsOrg":{"name":"MigsOrg","status":"published","display":false},"Mimag":{"name":"Mimag","status":"published","display":false},"Mims":{"name":"Mims","status":"published","display":false},"Miuvig":{"name":"Miuvig","status":"published","display":false},"HostAssociated":{"name":"HostAssociated","status":"published","display":false},"HumanAssociated":{"name":"HumanAssociated","status":"published","display":false},"HumanGut":{"name":"HumanGut","status":"published","display":false},"HumanOral":{"name":"HumanOral","status":"published","display":false},"HumanSkin":{"name":"HumanSkin","status":"published","display":false},"PlantAssociated":{"name":"PlantAssociated","status":"published","display":false},"Sediment":{"name":"Sediment","status":"published","display":false},"Soil":{"name":"Soil","status":"published","display":false},"SymbiontAssociated":{"name":"SymbiontAssociated","status":"published","display":false},"MixsCompliantData":{"name":"MixsCompliantData","status":"published","display":false},"MigsOrgHostAssociated":{"name":"MigsOrgHostAssociated","status":"published","display":false},"MigsOrgHumanAssociated":{"name":"MigsOrgHumanAssociated","status":"published","display":false},"MimagHostAssociated":{"name":"MimagHostAssociated","status":"published","display":false},"MimagHumanAssociated":{"name":"MimagHumanAssociated","status":"published","display":false},"MimagHumanGut":{"name":"MimagHumanGut","status":"published","display":false},"MimagHumanOral":{"name":"MimagHumanOral","status":"published","display":false},"MimagHumanSkin":{"name":"MimagHumanSkin","status":"published","display":false},"MimagSediment":{"name":"MimagSediment","status":"published","display":false},"MimagSoil":{"name":"MimagSoil","status":"published","display":false},"MimsHostAssociated":{"name":"MimsHostAssociated","status":"published","display":false},"MimsHumanAssociated":{"name":"MimsHumanAssociated","status":"published","display":false},"MimsHumanGut":{"name":"MimsHumanGut","status":"published","display":false},"MimsHumanOral":{"name":"MimsHumanOral","status":"published","display":false},"MimsHumanSkin":{"name":"MimsHumanSkin","status":"published","display":false},"MimsPlantAssociated":{"name":"MimsPlantAssociated","status":"published","display":false},"MimsSediment":{"name":"MimsSediment","status":"published","display":false},"MimsSoil":{"name":"MimsSoil","status":"published","display":false},"MimsSymbiontAssociated":{"name":"MimsSymbiontAssociated","status":"published","display":false},"MiuvigHostAssociated":{"name":"MiuvigHostAssociated","status":"published","display":false},"MiuvigHumanAssociated":{"name":"MiuvigHumanAssociated","status":"published","display":false},"Ancient":{"name":"Ancient","status":"published","display":true},"RadiocarbonDating":{"name":"RadiocarbonDating","status":"published","display":true},"MigsOrgHostAssociatedAncient":{"name":"MigsOrgHostAssociatedAncient","status":"published","display":true},"MigsOrgHumanAssociatedAncient":{"name":"MigsOrgHumanAssociatedAncient","status":"published","display":true},"MiuvigHostAssociatedAncient":{"name":"MiuvigHostAssociatedAncient","status":"published","display":true},"MiuvigHumanAssociatedAncient":{"name":"MiuvigHumanAssociatedAncient","status":"published","display":true},"MimagHostAssociatedAncient":{"name":"MimagHostAssociatedAncient","status":"published","display":true},"MimagHumanAssociatedAncient":{"name":"MimagHumanAssociatedAncient","status":"published","display":true},"MimagHumanOralAncient":{"name":"MimagHumanOralAncient","status":"published","display":true},"MimagHumanGutAncient":{"name":"MimagHumanGutAncient","status":"published","display":true},"MimagHumanSkinAncient":{"name":"MimagHumanSkinAncient","status":"published","display":true},"MimagSedimentAncient":{"name":"MimagSedimentAncient","status":"published","display":true},"MimagSoilAncient":{"name":"MimagSoilAncient","status":"published","display":true},"MimsHostAssociatedAncient":{"name":"MimsHostAssociatedAncient","status":"published","display":true},"MimsHumanAssociatedAncient":{"name":"MimsHumanAssociatedAncient","status":"published","display":true},"MimsHumanOralAncient":{"name":"MimsHumanOralAncient","status":"published","display":true},"MimsHumanGutAncient":{"name":"MimsHumanGutAncient","status":"published","display":true},"MimsHumanSkinAncient":{"name":"MimsHumanSkinAncient","status":"published","display":true},"MimsSedimentAncient":{"name":"MimsSedimentAncient","status":"published","display":true},"MimsSoilAncient":{"name":"MimsSoilAncient","status":"published","display":true},"MimsPlantAssociatedAncient":{"name":"MimsPlantAssociatedAncient","status":"published","display":true},"MimsSymbiontAssociatedAncient":{"name":"MimsSymbiontAssociatedAncient","status":"published","display":true}}}'
          ),
          e = async (s) => (await u(973)(`./${s}/schema.json`)).default,
          t = async (s) => (await u(69)(`./${s}/export.js`)).default;
      })(),
      l
    );
  })()
);
