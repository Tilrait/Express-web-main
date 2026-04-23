import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const currentDir = dirname(dirname(fileURLToPath(import.meta.url)));

const pbkdf2Promisified = promisify(pbkdf2);
const signPromisified = promisify(jwt.sign);
const verifyPromisified = promisify(jwt.verify);
export { currentDir, pbkdf2Promisified, verifyPromisified, signPromisified };
