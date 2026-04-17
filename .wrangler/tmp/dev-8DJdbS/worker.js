var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-XpJO5L/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/worker.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    const headers = { "Content-Type": "application/json" };
    try {
      if (path === "/api/users" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM users").all();
        return Response.json(results, { headers });
      }
      if (path === "/api/users" && method === "POST") {
        const body = await request.json();
        const id = "u_" + Date.now();
        const joinedAt = (/* @__PURE__ */ new Date()).toISOString();
        await env.DB.prepare(
          "INSERT INTO users (id, name, email, password, course, bio, avatar, joinedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, body.name, body.email, body.password, body.course || "", body.bio || "", body.name.charAt(0).toUpperCase(), joinedAt).run();
        const user = { id, name: body.name, email: body.email, password: body.password, course: body.course || "", bio: body.bio || "", avatar: body.name.charAt(0).toUpperCase(), joinedAt };
        return Response.json({ user }, { headers });
      }
      if (path === "/api/users/update" && method === "POST") {
        const body = await request.json();
        await env.DB.prepare(
          "UPDATE users SET name = ?, course = ?, bio = ?, avatar = ? WHERE id = ?"
        ).bind(body.name, body.course || "", body.bio || "", body.avatar || "", body.id).run();
        return Response.json({ success: true }, { headers });
      }
      if (path === "/api/products" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();
        return Response.json(results, { headers });
      }
      if (path === "/api/products" && method === "POST") {
        const body = await request.json();
        const id = "p_" + Date.now();
        const createdAt = (/* @__PURE__ */ new Date()).toISOString();
        await env.DB.prepare(
          "INSERT INTO products (id, title, description, price, category, image, condition, sellerId, sellerName, createdAt, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, body.title, body.description || "", body.price, body.category, body.image || "", body.condition || "Good", body.sellerId, body.sellerName, createdAt, 0).run();
        return Response.json({ id, ...body, createdAt, views: 0 }, { headers });
      }
      if (path.startsWith("/api/products/") && method === "PUT") {
        const id = path.split("/")[3];
        const body = await request.json();
        if (body.views) {
          await env.DB.prepare("UPDATE products SET views = views + 1 WHERE id = ?").bind(id).run();
        } else {
          await env.DB.prepare(
            "UPDATE products SET title = ?, category = ?, condition = ?, description = ?, price = ? WHERE id = ?"
          ).bind(body.title, body.category, body.condition, body.description, body.price, id).run();
        }
        return Response.json({ success: true }, { headers });
      }
      if (path.startsWith("/api/products/") && method === "DELETE") {
        const id = path.split("/")[3];
        await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
        return Response.json({ success: true }, { headers });
      }
      if (path === "/api/messages" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM messages").all();
        return Response.json(results, { headers });
      }
      if (path === "/api/messages" && method === "POST") {
        const body = await request.json();
        const id = "m_" + Date.now() + "_" + Math.random().toString(36).slice(2);
        const createdAt = (/* @__PURE__ */ new Date()).toISOString();
        await env.DB.prepare(
          "INSERT INTO messages (id, senderId, senderName, receiverId, receiverName, text, createdAt, read) VALUES (?, ?, ?, ?, ?, ?, ?, 0)"
        ).bind(id, body.senderId, body.senderName, body.receiverId, body.receiverName, body.text, createdAt).run();
        return Response.json({ id, ...body, createdAt, read: 0 }, { headers });
      }
      if (path === "/api/wishlist" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM wishlists").all();
        return Response.json(results, { headers });
      }
      if (path === "/api/wishlist" && method === "POST") {
        const body = await request.json();
        const id = "w_" + Date.now();
        await env.DB.prepare("INSERT INTO wishlists (id, userId, productId) VALUES (?, ?, ?)").bind(id, body.userId, body.productId).run();
        return Response.json({ success: true }, { headers });
      }
      if (path === "/api/wishlist/remove" && method === "POST") {
        const body = await request.json();
        await env.DB.prepare("DELETE FROM wishlists WHERE userId = ? AND productId = ?").bind(body.userId, body.productId).run();
        return Response.json({ success: true }, { headers });
      }
      if (path.startsWith("/api/users/") && method === "DELETE") {
        const id = path.split("/")[3];
        await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
        await env.DB.prepare("DELETE FROM products WHERE sellerId = ?").bind(id).run();
        await env.DB.prepare("DELETE FROM messages WHERE senderId = ? OR receiverId = ?").bind(id, id).run();
        return Response.json({ success: true }, { headers });
      }
      return new Response("API route not found", { status: 404 });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }
};

// C:/Users/user/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/user/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-XpJO5L/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// C:/Users/user/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-XpJO5L/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
