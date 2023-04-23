import { ColumnDefinitionBuilder, CreateTableBuilder, Expression, Kysely, sql } from 'kysely';
import { TDatabase } from './TDatabase';
import { entityTableDefinitions } from './entityTableDefinitions';
import { joinTableDefinitions } from './joinTableDefinitions';

type TColumnTypeInString = 'boolean' | 'boolean[]' | 'double precision' | 'double precision[]' | 'text[]' | 'text';

type TEntityTableColumnDefinition = {
	type: TColumnTypeInString;
	isPrimaryKey: boolean;
	isNotNull: boolean;
	references: string;
};

const createColumnTypeExpression = (columnType: TColumnTypeInString): Expression<string> => {
	let expression: Expression<string>;

	if (columnType === 'boolean') {
		expression = sql<string>`boolean`;
	} else if (columnType === 'boolean[]') {
		expression = sql<string>`boolean[]`
	} else if (columnType === 'double precision') {
		expression = sql<string>`double precision`;
	} else if (columnType === 'double precision[]') {
		expression = sql<string>`double precision[]`
	} else if (columnType === 'text[]') {
		expression = sql<string>`text[]`;
	} else {
		expression = sql<string>`text`;
	}

	return expression;
}

const columnBuilderCallbackReturns = (columnDefinition: TEntityTableColumnDefinition, columnBuilder: ColumnDefinitionBuilder): ColumnDefinitionBuilder => {
	if (columnDefinition.references) {
		return columnBuilder.references(`${columnDefinition.references}.id`).onDelete('set null');
	} else if (columnDefinition.isPrimaryKey) {
		return columnBuilder.primaryKey();
	} else if (columnDefinition.isNotNull) {
		return columnBuilder.notNull();
	}
	return columnBuilder;
}

export const createTables = async (db: Kysely<TDatabase>) => {

	const entityTableEntries = Object.entries(entityTableDefinitions);
	entityTableEntries.forEach(([tableName, table]) => {
		let createTableQuery = db.schema.createTable(tableName);
		const columnEntries = Object.entries(table) as (readonly [string, TEntityTableColumnDefinition])[];
		columnEntries.forEach(([columnName, column]) => {
			let columnType = createColumnTypeExpression(column.type);
			createTableQuery = createTableQuery.addColumn(columnName, columnType, col => columnBuilderCallbackReturns(column, col));
		});
		createTableQuery.ifNotExists().execute();

		const createIndexQuery = db.schema
			.createIndex(`${tableName}_pk_index`)
			.on(tableName)
			.column('id');
		createIndexQuery.ifNotExists().execute();
	});

	const joinTableEntries = Object.entries(joinTableDefinitions);
	joinTableEntries.forEach(([tableName, table]) => {
		const columnNames = Object.keys(table);
		let createTableQuery: CreateTableBuilder<string, typeof columnNames[number]> = db.schema.createTable(tableName);
		const columnEntries = Object.entries(table) as (readonly [string, TEntityTableColumnDefinition])[];
		columnEntries.forEach(([columnName, column]) => {
			let columnType = createColumnTypeExpression(column.type);
			createTableQuery = createTableQuery.addColumn(columnName, columnType, col => columnBuilderCallbackReturns(column, col));
		});
		createTableQuery
			.addPrimaryKeyConstraint(`${tableName}_cpk_constraint`, columnNames)
			.ifNotExists()
			.execute();

		const createIndexQuery = db.schema
			.createIndex(`${tableName}_cpk_index`)
			.on(tableName)
			.columns(columnNames);
		createIndexQuery.ifNotExists().execute();
	});

	await db.schema
		.createIndex('users_email_index')
		.on('users')
		.column('email')
		.ifNotExists()
		.execute();

	await db.schema
		.createIndex('apitokens_token_index')
		.on('apitokens')
		.column('token')
		.ifNotExists()
		.execute();
}
