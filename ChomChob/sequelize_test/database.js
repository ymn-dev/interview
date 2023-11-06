import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "mariadb",
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
  foreignKey: "item_id",
});
Item_Date.belongsTo(Item, {
  foreignKey: "item_id",
});

// const Promotion = sequelize.define("Promotion", {
//   promotion_id: {
//     type: DataTypes.STRING,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   new_price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   promotion_detail: {
//     type: DataTypes.STRING(1000),
//   },
// });

// const Item_Promotion = sequelize.define("Item_Promotion", {
//   item_id: {
//     type: DataTypes.STRING,
//     references: {

//     }
//   },
//   promotion_id: {
//     type: DataTypes.STRING,
//     autoIncrement: true,
//     primaryKey: true,
//   },
// });
// Item.belongsToMany(Promotion, {
//   through: Item_Promotion,
// });
// Promotion.belongsToMany(Item, {
//   through: Item_Promotion,
// });

// const Promotion_Date = sequelize.define("Promotion_Date", {});

// const Bundle = sequelize.define("Bundle", {});

// const Bundle_Item = sequelize.define("Bundle_Item", {});

// const Bundle_Date = sequelize.define("Bundle_Date", {});

// const Code = sequelize.define("Code", {});

// const Purchase = sequelize.define("Purchase", {});

// const Customer = sequelize.define("Customer", {});

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables have been created!");
  })
  .catch((err) => {
    console.error("Error creating the database and tables:", err);
  });
