import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize("mariadb::memory:");

const Item = sequelize.define("Item", {
  id: Sequelize.STRING,
  item_name: Sequelize.STRING,
  item_price: Sequelize.DECIMAL(10, 2),
});

const Item_Date = sequelize.define("", {});

const Promotion = sequelize.define("", {});

const Item_Promotion = sequelize.define("", {});

const Promotion_Date = sequelize.define("", {});

const Bundle = sequelize.define("", {});

const Bundle_Item = sequelize.define("", {});

const Bundle_Date = sequelize.define("", {});

const Code = sequelize.define("", {});

const Purchase = sequelize.define("", {});

const Customer = sequelize.define("", {});
