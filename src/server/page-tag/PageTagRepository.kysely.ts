import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { IPageTag } from './IPageTag';
import { IPageTagRepository } from './IPageTagRepository';
import { PageTag } from './PageTag.kysely';

export class PageTagRepository implements IPageTagRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<EntityAsync<IPageTag>[]> {
		const tagsPartial = await db
			.selectFrom('pagetags')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const tags = tagsPartial.map((tagPartial) => {
			const tag = new PageTag(tagPartial, db);
			return tag;
		});
		return tags;
	}

	public async findByID(id: string): Promise<EntityAsync<IPageTag>> {
		const tags = await this.findByIDs(id);
		const tag = tags[0];
		return tag;
	}

	public async save(pageTag: IPageTag | EntityAsync<IPageTag>): Promise<void> {
		const { id, name, displayName } = pageTag;
		const grantableBy = await (pageTag.grantableBy)
		const grantableByIDs = grantableBy.map(grantableByItem => grantableByItem.id);
		const tagPartial = { id, name, displayName };

		await db
			.insertInto('pagetags')
			.values(tagPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(tagPartial))
			.executeTakeFirst();

		grantableByIDs.forEach(async (grantableByID) => {
			const pageTagGrantableByUserTagsItem = {
				usertag_id: grantableByID,
				pagetag_id: id,
			};
			await db
				.insertInto('pagetag_grantableby_usertags')
				.values(pageTagGrantableByUserTagsItem)
				.onConflict(oc => oc
					.columns(['usertag_id', 'pagetag_id'])
					.doNothing())
				.executeTakeFirst();
		});

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('pages_tags')
			.where('tag_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('pagetag_grantableby_usertags')
			.where('pagetag_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('pagetags')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
