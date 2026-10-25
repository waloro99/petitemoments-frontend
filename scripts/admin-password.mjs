// Genera el hash para ADMIN_PASSWORD_HASH.
// Uso: npm run admin:password -- "MiNuevaContraseñaSegura"
import { randomBytes, scryptSync } from "node:crypto";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Uso: npm run admin:password -- "contraseña de al menos 10 caracteres"');
  process.exit(1);
}
const N = 32768, r = 8, p = 1;
const salt = randomBytes(16);
const hash = scryptSync(pw, salt, 32, { N, r, p, maxmem: 64 * 1024 * 1024 });
console.log(`ADMIN_PASSWORD_HASH=scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`);
