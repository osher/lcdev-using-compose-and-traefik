const { ENV = 'local', REDIS_HOST = 'localhost', REDIS_PORT = 6379 } = process.env
const { assign } = Object
const ioc = {}

dbConnect()
.then(db => seed(assign(ioc, { db })))
.then(webBind)
.then(svr => console.log('svr up', svr.address()) || assign(ioc, { svr }))


function dbConnect() {
  return new Promise((a,r) => {
    const c = require('redis').createClient({ host: REDIS_HOST, port: REDIS_PORT })
    .once('connect', () => a(c))
    .once('error', r)
  })
}

function seed(ioc) {
  return new Promise((a,r) => {
    ioc.db.mset(
     '/foo', '<h1>FOO!</h1>',
     '/bar', '<h1>BAR!</h1>',
     e => e ? r(e) : a(ioc)
    )
  })
}

function webBind({ db }) {
  return new Promise((a,r) => {
    const s = require('http').createServer(webHandler(db))
    s.listen(3000, e => e ? r(e) : a(s))
  })

  function webHandler(db) {
    return ({ url }, r) => {
      r.setTimeout(300)
      db.get(url, (e, v) => {
        if (e) return webErr(url, e, r)
        if (v) return ok(url, `${v}<br>from ${ENV}`, r)
        notFound(url, r)
      })
    }
  }

  function notFound(url, r) {
    webErr(url, assign(new Error(`not found: ${url}`), { status: 404 }), r)
  }

  function webErr(url, e, r) {
    respond({ r, url, status: e.status || 500, body: `${e.stack}<br>from ${ENV}`})
  }

  function ok(url, v, r) {
    respond({ r, url, status: 200, body: v })
  }

  function respond({ r, url, status, body }) {
    console.log('GET %s : %s', url, status)
    r.statusCode = status
    r.end(body)
  }
}




