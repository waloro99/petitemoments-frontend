// Genera src/lib/generated/build-secret.ts con un secreto aleatorio para firmar la sesión del panel.
// El archivo está en .gitignore: el secreto nunca llega al repositorio (que es público).
// En Vercel se crea en cada build (las sesiones abiertas se cierran al redesplegar).
// Para sesiones estables entre deploys, define ADMIN_SESSION_SECRET en las variables de entorno.
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const file = join(dirname(fileURLToPath(import.meta.url)), "..", "src/lib/generated/build-secret.ts");
const force = process.argv.includes("--force");

if (force || !existsSync(file)) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(
    file,
    `// Archivo generado por scripts/ensure-build-secret.mjs. NO subir al repositorio.\nexport const BUILD_SESSION_SECRET = "${randomBytes(32).toString("base64url")}";\n`,
  );
  console.log("✓ Secreto de sesión generado");
}
