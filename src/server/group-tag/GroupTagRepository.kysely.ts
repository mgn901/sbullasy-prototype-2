import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { GroupTag } from './GroupTag.kysely';
import { IGroupTag } from './IGroupTag';
import { IGroupTagRepository } from './IGroupTagRepository';

export class GroupTagRepository implements IGroupTagRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<EntityAsync<IGroupTag>[]> {
		const tagsPartial = await db
			.selectFrom('grouptags')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const tags = tagsPartial.map((tagPartial) => {
			const tag = new GroupTag(tagPartial, db);
			return tag;
		});
		return tags;
	}

	public async save(groupTag: IGroupTag | EntityAsync<IGroupTag>): Promise<void> {
		const { id, name, displayName } = groupTag;
		const grantableBy = await (groupTag.grantableBy)
		const grantableByIDs = grantableBy.map(grantableByItem => grantableByItem.id);
		const tagPartial = { id, name, displayName };

		await db
			.insertInto('grouptags')
			.values(tagPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(tagPartial))
			.executeTakeFirst();

		grantableByIDs.forEach(async (grantableByID) => {
			const groupTagGrantableByUserTagsItem = {
				usertag_id: grantableByID,
				grouptag_id: id,
			};
			await db
				.insertInto('grouptag_grantableby_usertags')
				.values(groupTagGrantableByUserTagsItem)
				.onConflict(oc => oc
					.columns(['usertag_id', 'grouptag_id'])
					.doNothing())
				.executeTakeFirst();
		});

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('groups_tags')
			.where('tag_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('grouptag_grantableby_usertags')
			.where('grouptag_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('grouptags')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
