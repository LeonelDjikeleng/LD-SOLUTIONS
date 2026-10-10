// En-têtes de sécurité, limitation de débit, mots de passe et jetons.
import crypto from "node:crypto";

export function entetesSecurite(config) {
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
  ];
  if (config.https) csp.push("upgrade-insecure-requests");
  const h = {
    "Content-Security-Policy": csp.join("; "),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Frame-Options": "DENY",
  };
  if (config.https) h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  return h;
}

/** Limiteur à fenêtre glissante, en mémoire (suffisant pour une seule instance). */
export function creerLimiteur({ nombre, fenetreMs }) {
  const essais = new Map();
  const nettoyer = setInterval(() => {
    const limite = Date.now() - fenetreMs;
    for (const [cle, liste] of essais) {
      const restants = liste.filter((t) => t > limite);
      if (restants.length) essais.set(cle, restants); else essais.delete(cle);
    }
  }, Math.min(fenetreMs, 60_000));
  nettoyer.unref?.();
  return {
    autoriser(cle) {
      const maintenant = Date.now();
      const liste = (essais.get(cle) || []).filter((t) => t > maintenant - fenetreMs);
      if (liste.length >= nombre) { essais.set(cle, liste); return false; }
      liste.push(maintenant);
      essais.set(cle, liste);
      return true;
    },
    reinitialiser(cle) { essais.delete(cle); },
  };
}

// Format : scrypt$N$r$p$selBase64$hashBase64
const N = 16384, R = 8, P = 1, LONGUEUR = 64;

export function hacherMotDePasse(motDePasse) {
  const sel = crypto.randomBytes(16);
  const hash = crypto.scryptSync(motDePasse, sel, LONGUEUR, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${sel.toString("base64")}$${hash.toString("base64")}`;
}

export function verifierMotDePasse(motDePasse, stocke) {
  if (typeof motDePasse !== "string" || !stocke || typeof stocke !== "string") return false;
  const parties = stocke.split("$");
  if (parties.length !== 6 || parties[0] !== "scrypt") return false;
  const [, n, r, p, selB64, hashB64] = parties;
  try {
    const attendu = Buffer.from(hashB64, "base64");
    const calcule = crypto.scryptSync(motDePasse, Buffer.from(selB64, "base64"), attendu.length, {
      N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024,
    });
    return attendu.length === calcule.length && crypto.timingSafeEqual(attendu, calcule);
  } catch {
    return false;
  }
}

export function jetonAleatoire(octets = 32) {
  return crypto.randomBytes(octets).toString("base64url");
}

export function hacherJeton(jeton) {
  return crypto.createHash("sha256").update(jeton).digest("hex");
}

export function egaliteSure(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function ipClient(req, faireConfianceProxy) {
  if (faireConfianceProxy) {
    const xff = req.headers["x-forwarded-for"];
    if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "inconnue";
}

/** Refuse les requêtes d'écriture envoyées depuis un autre site (défense CSRF complémentaire). */
export function origineAutorisee(req, faireConfianceProxy = false) {
  const origine = req.headers.origin;
  if (!origine) return true; // formulaires sans Origin (anciens navigateurs) : protégés par SameSite et les jetons
  try {
    const hote = (faireConfianceProxy && req.headers["x-forwarded-host"]) || req.headers.host;
    return new URL(origine).host === hote;
  } catch {
    return false;
  }
}

export function echapperHtml(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
