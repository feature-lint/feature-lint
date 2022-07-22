import { sequelize } from "./sequelize";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";

interface UserDefinedBuildingBlock
  extends Model<
    InferAttributes<UserDefinedBuildingBlock>,
    InferCreationAttributes<UserDefinedBuildingBlock>
  > {
  name: string;
}
export const UserDefinedBuildingBlock = sequelize.define<
  UserDefinedBuildingBlock
>(
  "UserDefinedBuildingBlock",
  {
    name: DataTypes.STRING
  },
  {
    timestamps: false
  }
);
