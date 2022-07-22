import { sequelize } from "./sequelize";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";

interface UserDefinedFeature
  extends Model<
    InferAttributes<UserDefinedFeature>,
    InferCreationAttributes<UserDefinedFeature>
  > {
  name: string;
  matcher: string;
}
export const UserDefinedFeature = sequelize.define<UserDefinedFeature>(
  "UserDefinedFeature",
  {
    name: DataTypes.STRING,
    matcher: DataTypes.STRING
  },
  {
    timestamps: false
  }
);
