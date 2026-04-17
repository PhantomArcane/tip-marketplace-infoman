export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    const headers = { 'Content-Type': 'application/json' };

    try {
      // ── Users ──
      if (path === '/api/users' && method === 'GET') {
        const { results } = await env.DB.prepare("SELECT * FROM users").all();
        return Response.json(results, { headers });
      }
      
      if (path === '/api/users' && method === 'POST') {
        const body = await request.json();
        const id = 'u_' + Date.now();
        const joinedAt = new Date().toISOString();
        await env.DB.prepare(
          "INSERT INTO users (id, name, email, password, course, bio, avatar, joinedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, body.name, body.email, body.password, body.course || '', body.bio || '', body.name.charAt(0).toUpperCase(), joinedAt).run();
        const user = { id, name: body.name, email: body.email, password: body.password, course: body.course||'', bio: body.bio||'', avatar: body.name.charAt(0).toUpperCase(), joinedAt };
        return Response.json({ user }, { headers });
      }

      if (path === '/api/users/update' && method === 'POST') {
        const body = await request.json();
        await env.DB.prepare(
          "UPDATE users SET name = ?, course = ?, bio = ?, avatar = ? WHERE id = ?"
        ).bind(body.name, body.course || '', body.bio || '', body.avatar || '', body.id).run();
        return Response.json({ success: true }, { headers });
      }

      // ── Products ──
      if (path === '/api/products' && method === 'GET') {
        const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();
        return Response.json(results, { headers });
      }

      if (path === '/api/products' && method === 'POST') {
        const body = await request.json();
        const id = 'p_' + Date.now();
        const createdAt = new Date().toISOString();
        await env.DB.prepare(
          "INSERT INTO products (id, title, description, price, category, image, condition, sellerId, sellerName, createdAt, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, body.title, body.description || '', Number(body.price), body.category, body.image || '', body.condition || 'Good', body.sellerId, body.sellerName, createdAt, 0).run();
        return Response.json({ id, ...body, createdAt, views: 0 }, { headers });
      }

      if (path.startsWith('/api/products/') && method === 'PUT') {
        const id = path.split('/')[3];
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

      if (path.startsWith('/api/products/') && method === 'DELETE') {
        const id = path.split('/')[3];
        await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
        return Response.json({ success: true }, { headers });
      }

      // ── Messages ──
      if (path === '/api/messages' && method === 'GET') {
        const { results } = await env.DB.prepare("SELECT * FROM messages").all();
        return Response.json(results, { headers });
      }

      if (path === '/api/messages' && method === 'POST') {
        const body = await request.json();
        const id = 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const createdAt = new Date().toISOString();
        await env.DB.prepare(
          "INSERT INTO messages (id, senderId, senderName, receiverId, receiverName, text, createdAt, read) VALUES (?, ?, ?, ?, ?, ?, ?, 0)"
        ).bind(id, body.senderId, body.senderName, body.receiverId, body.receiverName, body.text, createdAt).run();
        return Response.json({ id, ...body, createdAt, read: 0 }, { headers });
      }

      // ── Wishlist ──
      if (path === '/api/wishlist' && method === 'GET') {
        const { results } = await env.DB.prepare("SELECT * FROM wishlists").all();
        return Response.json(results, { headers });
      }

      if (path === '/api/wishlist' && method === 'POST') {
        const body = await request.json();
        const id = 'w_' + Date.now();
        await env.DB.prepare("INSERT INTO wishlists (id, userId, productId) VALUES (?, ?, ?)").bind(id, body.userId, body.productId).run();
        return Response.json({ success: true }, { headers });
      }

      if (path === '/api/wishlist/remove' && method === 'POST') {
        const body = await request.json();
        await env.DB.prepare("DELETE FROM wishlists WHERE userId = ? AND productId = ?").bind(body.userId, body.productId).run();
        return Response.json({ success: true }, { headers });
      }

      // ── Admin ──
      if (path.startsWith('/api/users/') && method === 'DELETE') {
        const id = path.split('/')[3];
        await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
        await env.DB.prepare("DELETE FROM products WHERE sellerId = ?").bind(id).run();
        await env.DB.prepare("DELETE FROM messages WHERE senderId = ? OR receiverId = ?").bind(id, id).run();
        return Response.json({ success: true }, { headers });
      }

      // Catch-all
      return new Response("API route not found", { status: 404 });

    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }
};
