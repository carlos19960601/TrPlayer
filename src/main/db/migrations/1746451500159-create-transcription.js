import { DataTypes } from "sequelize";

async function up({ context: queryInterface }) {
	queryInterface.createTable(
		"transcriptions",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			target_id: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			target_type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			target_md5: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			language: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			state: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			model: {
				type: DataTypes.STRING,
			},
			recognition_result: {
				type: DataTypes.JSON,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			indexes: [
				{
					fields: ["target_type", "target_id"],
				},
				{
					fields: ["md5"],
				},
			],
		},
	);
}

async function down({ context: queryInterface }) {
	queryInterface.dropTable("transcriptions");
}

export { down, up };
