import fs from 'fs-extra';
import path from 'path';
import { npm, database } from '@auto-blog/libraries';
import { chat, AIModel } from '@auto-blog/openai';

(async () => {
  const list = await npm.getPackages();
  const models = Object.keys(AIModel);
  const pkgs = list.slice(0, 3);

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const fns = pkgs.map((pkg) => () => gen(pkg, model));

    for await (const fn of fns) {
      await fn();
    }

    console.log(`${model} 完成了\n`)
  }
  console.log('\n全部完成了')
})();

async function gen(pkg, model) {
  try {
    const res = await chat.genArticle(pkg);
    const { choices } = res as any;
    if (!choices) return;

    const [completion] = choices;

    const dir = path.join(__dirname, 'articles')
    fs.ensureDirSync(dir);
    fs.writeFileSync(path.join(dir, `${pkg.name}-${model}.md`), completion.message.content);

    console.log(`${pkg.name}-${model} 完成了`);
  } catch (error) {
    console.log('openai -> error: ', error.message);
  }
}


export async function main() {
  const pkg = await npm.getPackage();
  if (!pkg) return;

  // 文章发布完成后，将 isPublished 设置为 true
  await database.setPackagePublished(pkg.name);
}