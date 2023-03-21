import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { IUserTag } from './IUserTag';
import { IUserTagRepository } from './IUserTagRepository';
import { UserTag } from './UserTag.kysely';

export class UserTagRepository implements IUserTagRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<EntityAsync<IUserTag>[]> {
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

	public async save(userTag: IUserTag | EntityAsync<IUserTag>): Promise<void> {
		const grantableBy = await userTag.grantableBy;
		const grantableByIDs = grantableBy.map(grantableByItem => grantableByItem.id);
		const userTagPartial = {
			id: userTag.id,
			name: userTag.name,
			displayName: userTag.displayName,
		};

		await db
			.deleteFrom('usertag_grantableby_usertaggrantabilities')
			.where('usertag_id', '==', userTag.id)
			.where('grantability_id', 'not in', grantableByIDs)
			.executeTakeFirst();
		grantableByIDs.forEach(async (grantabilityID) => {
			const userTagGrantableBUserTagGrantabilitiesItem = {
				usertag_id: userTag.id,
				grantability_id: grantabilityID,
			};
			await db
				.insertInto('usertag_grantableby_usertaggrantabilities')
				.values(userTagGrantableBUserTagGrantabilitiesItem)
				.onConflict(oc => oc
					.columns(['usertag_id', 'grantability_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.insertInto('usertags')
			.values(userTagPartial)
			.onConflict(oc => {
				return oc
					.column('id')
					.doUpdateSet(userTagPartial)
			})
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('usertag_grantableby_usertaggrantabilities')
			.where('usertag_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('usertags')
			.where('id', 'in', id)
			.executeTakeFirst();

		return;
	}

}
