/**
 * 🛠️ SCRIPT D'EXTRACTION DE SESSION
 * 
 * Copie TOUT ce contenu et colle-le dans la Console Chrome (F12 > Console)
 * lorsque tu es connecté sur le Dashboard Admin.
 */

async function exportAuth() {
    console.log("⏳ Extraction des données en cours...");

    // 1. Récupération des cookies (si supporté)
    let cookies = [];
    if (window.cookieStore) {
        try {
            cookies = await window.cookieStore.getAll();
        } catch (e) {
            console.warn("CookieStore non disponible, utilisation partielle de document.cookie");
        }
    }

    // Fallback simple si cookieStore vide
    if (cookies.length === 0) {
        cookies = document.cookie.split(';').map(c => {
            const [n, v] = c.trim().split('=');
            return { name: n, value: v, domain: window.location.hostname, path: '/' };
        }).filter(c => c.name);
    }

    // 2. Récupération du LocalStorage (souvent utilisé par Supabase/Firebase)
    const origins = [{
        origin: window.location.origin,
        localStorage: Object.entries(localStorage).map(([name, value]) => ({ name, value }))
    }];

    const jsonContent = JSON.stringify({ cookies, origins }, null, 2);

    // 3. Création de l'interface visuelle pour simplifier la copie
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;background:rgba(255,255,255,0.98);padding:40px;box-sizing:border-box;display:flex;flex-direction:column;font-family:sans-serif;';

    const h1 = document.createElement('h1');
    h1.innerText = '🔐 Données de Connexion Extraites';
    h1.style.color = '#333';
    div.appendChild(h1);

    const p = document.createElement('p');
    p.innerHTML = 'Copie tout le texte ci-dessous et colle-le dans le fichier <b>auth.json</b> à la racine du projet.<br>Une fois fait, tu peux fermer cette fenêtre.';
    p.style.fontSize = '1.2em';
    p.style.lineHeight = '1.5';
    p.style.color = '#555';
    div.appendChild(p);

    const textarea = document.createElement('textarea');
    textarea.style.cssText = 'flex-grow:1;width:100%;margin:20px 0;font-family:monospace;font-size:12px;border:2px solid #333;padding:15px;border-radius:8px;background:#f8f9fa;color:#d63384;';
    textarea.value = jsonContent;
    div.appendChild(textarea);

    const btnContainer = document.createElement('div');
    btnContainer.style.textAlign = 'right';

    const btn = document.createElement('button');
    btn.innerText = 'Fermer / Close';
    btn.style.cssText = 'padding:15px 30px;font-size:16px;cursor:pointer;background:#333;color:white;border:none;border-radius:5px;font-weight:bold;';
    btn.onclick = () => div.remove();

    btnContainer.appendChild(btn);
    div.appendChild(btnContainer);

    document.body.appendChild(div);
    textarea.select();
    console.log("✅ TERMINÉ : La fenêtre de copie est affichée.");
}

exportAuth();
