import { join } from "path";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";

import { currentDir } from "../utility.js";

const dataFileName = join(currentDir, "data", "todos.json");

const dataFile = readFileSync(dataFileName, "utf-8");
const dataBase = JSON.parse(dataFile);

export function saveDatabase() {
    const s = JSON.stringify(dataBase, null, 4);
    writeFile(dataFileName, s, "utf-8");
}

export function getObjectId() {
    return (new Date().getTime()).toString();
}

export { dataBase }