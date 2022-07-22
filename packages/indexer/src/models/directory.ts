import { sequelize } from "./sequelize";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";

interface Directory
  extends Model<
    InferAttributes<Directory>,
    InferCreationAttributes<Directory>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  path: string;
}
export const Directory = sequelize.define<Directory>(
  "Directory",
  {
    path: DataTypes.STRING
  },
  {
    timestamps: false
  }
);
