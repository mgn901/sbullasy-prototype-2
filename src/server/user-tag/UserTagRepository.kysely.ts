import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { IUserTag } from './IUserTag';
import { IUserTagRepository } from './IUserTagRepository';
import { UserTag } from './UserTag.kysely';

export class UserTagRepository implements IUserTagRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<IUserTag>[]> {
		const tagsPartial = await db
			.selectFrom('usertags')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const tags = tagsPartial.map((tagPartial) => {
			const tag = new UserTag(tagPartial, db);
			return tag;
		});
		return tags;
	}

	public async findByID(id: string): Promise<TEntityAsync<IUserTag> | undefined> {
		const tags = await this.findByIDs(id);
		const tag = tags[0];
		return tag;
	}

	public async save(userTag: IUserTag | TEntityAsync<IUserTag>): Promise<void> {
		const grantableBy = await userTag.grantableBy;
		const grantableByIDs = grantableBy.map(grantableByItem => grantableByItem.id);
		const userTagPartial = {
			id: userTag.id,
			name: userTag.name,
			displayName: userTag.displayName,
		};

		await db
			.insertInto('usertags')
			.values(userTagPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(userTagPartial))
			.executeTakeFirst();

		await db
			.deleteFrom('usertaggrantabilities')
			.where('tag', '==', userTag.id)
			.where('id', 'not in', grantableByIDs)
			.executeTakeFirst();
		grantableBy.forEach(async (grantability) => {
			const tag = await grantability.tag;
			const grantableByUserTag = await grantability.grantableByUserTag;
			const grantabilityPartial = {
				id: grantability.id,
				tag: tag.id,
				expires: grantability.expires,
				expiresAt: grantability.expiresAt,
				grantableByEmailRegex: grantability.grantableByEmailRegex,
				grantableByUserTag: grantableByUserTag?.id,
			};
			await db
				.insertInto('usertaggrantabilities')
				.values(grantabilityPartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(grantabilityPartial))
				.executeTakeFirst();
			return;
		});

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('usertags')
			.where('id', 'in', id)
			.executeTakeFirst();

		return;
	}

}
