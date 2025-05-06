#!/usr/bin/env zx

import chalk from "chalk";
import fs from "fs-extra";
import path from "node:path";

const name = process.argv[3];
const filename = path.resolve(
	__dirname,
	"migrations",
	`${Date.now()}-${process.argv[3]}.js`,
);

const template = `
import { DataTypes } from "sequelize";

async function up({ context: queryInterface }) {
  // code here
}

async function down({ context: queryInterface }) {
  // code here
}

export { up, down };
`;

await fs.mkdir(path.resolve(__dirname, "migrations"), { recursive: true });
await fs.writeFile(filename, template.trim());

console.log(chalk.green(`Created migration ${name} at ${filename}`));
