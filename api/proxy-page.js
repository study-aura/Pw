export default async function handler(req, res) {
    try {
        const url = new URL(req.url, `https://${req.headers.host}`);
        const targetPath = url.searchParams.get('path') || '';
        url.searchParams.delete('path');
        
        const cleanPath = targetPath.replace(/^\/+/, '');
        const search = url.searchParams.toString() ? `?${url.searchParams.toString()}` : '';
        const targetUrl = `https://stream.testuk.org/${cleanPath}${search}`;
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        
        let html = await response.text();
        
        const authScript = `<script>(function(){var e=localStorage.getItem('asm_access_expiry');if(!e||Date.now()>parseInt(e)){localStorage.removeItem('asm_access_expiry');window.location.href='/get-access';return;}})();</script>`;
        
        if (html.includes('<head>')) {
            html = html.replace('<head>', `<head>\n${authScript}`);
        } else {
            html = authScript + html;
        }
        
        // Remove PW/Vedstudy specific titles if needed
        html = html.replace(/<title>(.*?)vedstudy<\/title>/gi, '<title>$1AURA MAX</title>');
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.status(response.status).send(html);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error proxying page: ' + e.message);
    }
}
