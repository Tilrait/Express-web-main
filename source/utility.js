import { dirname } from "path";
import { fileURLToPath } from "url";
import { pbkdf2 } from "crypto";
import { promisify } from "util";

const currentDir = dirname(dirname(fileURLToPath(import.meta.url)))

const pbkdf2Promisified = promisify(pbkdf2);

export { currentDir, pbkdf2Promisified }