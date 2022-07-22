import { sequelize } from "./sequelize";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";

interface File
  extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  path: string;
  filename: string;
}
export const File = sequelize.define<File>(
  "File",
  {
    path: DataTypes.STRING,
    filename: DataTypes.STRING
  },
  {
    timestamps: false
  }
);
