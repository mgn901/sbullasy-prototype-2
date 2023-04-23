import { TDatabase } from './TDatabase';
import { TEntityTableDefinitions } from './TEntityTableDefinitions';

export const joinTableDefinitions: TEntityTableDefinitions<TDatabase> = {
	user_properties: {
		user_id: { type: 'text', references: 'users' },
		property_id: { type: 'text', references: 'properties' },
	},
	user_owns_groups: {
		user_id: { type: 'text', references: 'users' },
		group_id: { type: 'text', references: 'groups' },
	},
	users_belongs_groups: {
		user_id: { type: 'text', references: 'users' },
		group_id: { type: 'text', references: 'groups' },
	},
	users_watches_groups: {
		user_id: { type: 'text', references: 'users' },
		group_id: { type: 'text', references: 'groups' },
	},
	users_watches_pages: {
		user_id: { type: 'text', references: 'users' },
		page_id: { type: 'text', references: 'pages' },
	},
	user_pages: {
		user_id: { type: 'text', references: 'users' },
		page_id: { type: 'text', references: 'pages' },
	},
	groups_tags: {
		group_id: { type: 'text', references: 'groups' },
		tag_id: { type: 'text', references: 'grouptags' },
	},
	group_properties: {
		group_id: { type: 'text', references: 'groups' },
		property_id: { type: 'text', references: 'properties' },
	},
	group_pages: {
		group_id: { type: 'text', references: 'groups' },
		page_id: { type: 'text', references: 'pages' },
	},
	pages_places: {
		page_id: { type: 'text', references: 'pages' },
		place_id: { type: 'text', references: 'places' },
	},
	pages_tags: {
		page_id: { type: 'text', references: 'pages' },
		tag_id: { type: 'text', references: 'pagetags' },
	},
	page_properties: {
		page_id: { type: 'text', references: 'pages' },
		property_id: { type: 'text', references: 'properties' },
	},
	grouptag_grantableby_usertags: {
		grouptag_id: { type: 'text', references: 'grouptags' },
		usertag_id: { type: 'text', references: 'usertags' },
	},
	pagetag_grantableby_usertags: {
		usertag_id: { type: 'text', references: 'usertags' },
		pagetag_id: { type: 'text', references: 'pagetags' },
	},
	subjects_places: {
		subject_id: { type: 'text', references: 'subjects' },
		place_id: { type: 'text', references: 'places' },
	},
	subjects_categories: {
		subject_id: { type: 'text', references: 'subjects' },
		category_id: { type: 'text', references: 'categories' },
	},
	subjects_semesters: {
		subject_id: { type: 'text', references: 'subjects' },
		semester_id: { type: 'text', references: 'subjectsemesters' },
	},
	subjects_weeks: {
		subject_id: { type: 'text', references: 'subjects' },
		week_id: { type: 'text', references: 'subjectweeks' },
	},
	subjects_teachers: {
		subject_id: { type: 'text', references: 'subjects' },
		teacher_id: { type: 'text', references: 'teachers' },
	},
	subjects_properties: {
		subject_id: { type: 'text', references: 'subjects' },
		property_id: { type: 'text', references: 'properties' },
	},
};
