import { DataTypes } from "sequelize";

async function up({ context: queryInterface }) {
	queryInterface.createTable(
		"llm_providers",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			provider_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			base_url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			api_key: {
				type: DataTypes.STRING,
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
					fields: ["provider_id"],
				},
			],
		},
	);
}

async function down({ context: queryInterface }) {
	queryInterface.dropTable("llm_providers");
}

export { down, up };
