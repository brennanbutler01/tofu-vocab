import getUser from 'user/crud/getOne';
import prisma from 'prisma/db/index';

//get the users timezone in a postgres friendly format for parsing datetime fields
export default async function getUserTimezone(userId: string) {
	const userTimezone = await getUser
		?.dbGetUser(userId)
		.then(res => res?.timeZone)
		.catch(console.error);

	return await prisma
		?.$queryRawUnsafe<{ abbrev: string }[]>(
			`SELECT abbrev FROM pg_timezone_names WHERE name = '${userTimezone}';`,
		)
		.then(res => res[0].abbrev)
		.catch(console.error);
}
