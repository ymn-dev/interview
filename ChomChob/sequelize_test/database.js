import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "mariadb",
  define: {
    freezeTableName: true,
  },
});

const Item = sequelize.define("Item", {
  item_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_detail: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  item_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

const Item_Date = sequelize.define("Item_Date", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  open_sale_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_sale_date: {
    type: DataTypes.DATE,
  },
});

Item.hasMany(Item_Date, {
  foreignKey: {
    name: "item_id",
  },
});
Item_Date.belongsTo(Item, {
  foreignKey: "item_id",
});

const Promotion = sequelize.define("Promotion", {
  promotion_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  new_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  promotion_detail: {
    type: DataTypes.STRING(1000),
  },
});

const Item_Promotion = sequelize.define("Item_Promotion", {
  /*item_id: {
    type: DataTypes.STRING,
    foreignKey: "item_id",
    references: {
      model: Item,
      key: "item_id",
    },
  },
  promotion_id: {
    type: DataTypes.STRING,
    foreignKey: "promotion_id",
    references: {
      model: Promotion,
      key: "promotion_id",
    },
  },*/
});
Item.belongsToMany(Promotion, {
  through: Item_Promotion,
});
Promotion.belongsToMany(Item, {
  through: Item_Promotion,
});

const Promotion_Date = sequelize.define("Promotion_Date", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  open_sale_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_sale_date: {
    type: DataTypes.DATE,
  },
});

Promotion.hasMany(Promotion_Date, {
  foreignKey: "promotion_id",
});
Promotion_Date.belongsTo(Promotion, {
  foreignKey: "promotion_id",
});

const Bundle = sequelize.define("Bundle", {
  bundle_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  special_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  bundle_detail: {
    type: DataTypes.STRING(1000),
  },
});

const Bundle_Item = sequelize.define("Bundle_Item", {});

Bundle.belongsToMany(Item, {
  through: Bundle_Item,
});
Item.belongsToMany(Bundle, {
  through: Bundle_Item,
});

const Bundle_Date = sequelize.define("Bundle_Date", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  open_sale_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_sale_date: {
    type: DataTypes.DATE,
  },
});

Bundle.hasMany(Bundle_Date, {
  foreignKey: "bundle_id",
});
Bundle_Date.belongsTo(Bundle, {
  foreignKey: "bundle_id",
});

const Code = sequelize.define("Code", {
  code_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Customer = sequelize.define("Customer", {
  customer_id: {
    type: DataTypes.CHAR(36), //uuidv4 for mariadb
    primaryKey: true,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //other fields as needed, not primary concern
});

const Purchase = sequelize.define(
  "Purchase",
  {
    purchase_id: {
      type: DataTypes.CHAR(36), //uuidv4 for mariadb
      primaryKey: true,
    },
    item_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bundle_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    //sequelize has default "created at" for timestamp
  },
  {
    validateBundleOrItem() {
      if ((this.bundle_id === null && this.item_id === null) || (this.bundle_id !== null && this.item_id !== null)) {
        throw new Error("Only one of either bundle_id or item_id can exist per purchase.");
      }
    },
  }
);

Purchase.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Customer.hasMany(Purchase, {
  foreignKey: "customer_id",
});

Purchase.hasOne(Code, {
  foreignKey: "code_id",
});

Code.belongsTo(Purchase, {
  foreignKey: "code_id",
});

Purchase.belongsTo(Item, {
  foreignKey: "item_id",
  allowNull: true,
});

Item.hasMany(Purchase, {
  foreignKey: "item_id",
});

Purchase.belongsTo(Bundle, {
  foreignKey: "bundle_id",
  allowNull: true,
});

Bundle.hasMany(Purchase, {
  foreignKey: "bundle_id",
});

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables have been created!");
  })
  .catch((err) => {
    console.error("Error creating the database and tables:", err);
  });
