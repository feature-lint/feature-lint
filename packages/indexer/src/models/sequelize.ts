import { Sequelize, Model, DataTypes } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage:
    "/Users/larskolpin-freese/workspace/feature-lint/packages/indexer/database.sqlite"
});

export const initialize = async () => {
  console.log("AUF GEEHTS");
  await sequelize.sync({ force: true });
};
