import pkg from './package.json';

export const external = [...Object.keys('dependencies' in pkg ? (pkg.dependencies as Record<string, unknown>) : {})];