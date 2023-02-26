import { PrismaClient } from '@prisma/client';
import MeiliSearch from 'meilisearch';
import { appConfiguration } from '../config/config';

interface JSONRoleType {
  id: number;
  title: string;
}

interface JSONUserType {
  id: number;
  name: string;
  email: string;
  roleId: number;
  password: string;
}

interface JSONStatuseType {
  title: string;
  data: [{ id: number; title: string }];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rolesJSON = require('./seed_data/roles.json') as JSONRoleType[];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const usersJSON = require('./seed_data/users.json') as JSONUserType[];

const statusesTypesJSON =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./seed_data/types&statuses.json') as JSONStatuseType[];

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    rolesJSON.map(({ id, title }) =>
      prisma.role.create({ data: { id, title } }),
    ),
  );

  await Promise.all(
    usersJSON.map(({ name, email, roleId, password }) =>
      prisma.user.create({
        data: {
          name,
          contact: {
            create: {
              email,
            },
          },
          role: { connect: { id: roleId } },
          password,
        },
      }),
    ),
  );

  for (let i = 0; i < statusesTypesJSON.length; i++) {
    const statusOrType = statusesTypesJSON[i];

    await Promise.all(
      statusOrType.data.map(({ id, title }) =>
        prisma[statusOrType.title].create({
          data: {
            id,
            title,
          },
        }),
      ),
    );
  }

  const client = new MeiliSearch({
    host: appConfiguration().meili.host,
    apiKey: appConfiguration().meili.key,
  });

  const tagsIndex = client.index('tags');
  const categoriesIndex = client.index('categories');
  const lessonsIndex = client.index('lessons');
  const usersIndex = client.index('users');

  await tagsIndex.deleteAllDocuments();
  await categoriesIndex.deleteAllDocuments();
  await lessonsIndex.deleteAllDocuments();
  await usersIndex.deleteAllDocuments();

  try {
    await tagsIndex.updateSettings({
      searchableAttributes: ['title'],
      filterableAttributes: ['id'],
    });

    console.log('tagsIndex', await tagsIndex.getSettings());
  } catch (error) {
    console.log('tagsIndex', error);
  }

  try {
    await categoriesIndex.updateSettings({
      searchableAttributes: ['title'],
      filterableAttributes: ['id'],
    });

    console.log('categoriesIndex', await categoriesIndex.getSettings());
  } catch (error) {
    console.log('categoriesIndex', error);
  }

  try {
    await usersIndex.updateSettings({
      searchableAttributes: ['name', 'email'],
      filterableAttributes: ['id'],
    });

    console.log('usersIndex', await usersIndex.getSettings());
  } catch (error) {
    console.log('usersIndex', error);
  }

  try {
    await lessonsIndex.updateSettings({
      searchableAttributes: ['title'],
      filterableAttributes: ['id', 'price', 'poster', 'categories', 'tags'],
      sortableAttributes: ['id'],
    });

    console.log('lessonsIndex', await lessonsIndex.getSettings());
  } catch (error) {
    console.log('lessonsIndex', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
