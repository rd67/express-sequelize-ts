import "module-alias/register";

import ModuleAlias from "module-alias";

ModuleAlias.addAliases({
  "@config": `${__dirname}/config`,
  "@constants": `${__dirname}/constants`,
  "@helpers": `${__dirname}/helpers`,
  "@utils": `${__dirname}/utils`,
  "@middlewares": `${__dirname}/middlewares`,
  "@models": `${__dirname}/models`,
  "@interfaces": `${__dirname}/interfaces`,
  "@modules": `${__dirname}/modules`,
  "@queues": `${__dirname}/queues`,
  "@views": `${__dirname}/views`,
});
