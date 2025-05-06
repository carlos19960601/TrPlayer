import { DataTypes } from "sequelize";

async function up({ context: queryInterface }) {
	queryInterface.createTable(
		"videos",
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
			},
			md5: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			source: {
				type: DataTypes.STRING,
			},
			file_path: {
				type: DataTypes.STRING,
				allowNull: false,
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
					unique: true,
					fields: ["md5"],
				},
			],
		},
	);
}

async function down({ context: queryInterface }) {
	queryInterface.dropTable("videos");
}

export { down, up };
