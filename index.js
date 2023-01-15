const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const port = 3000;

//parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sequelize = new Sequelize("yashdb", "Yash", "MYSQL@pandey27", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database: ", err.message);
  });

const blog_table = sequelize.define(
  "blog_table",
  {
    title: Sequelize.STRING,
    desc: Sequelize.TEXT,
  },
  { tablename: "blog_table" }
);

blog_table.sync();

app.post("/", async (req, res) => {
  const title = req.body.title;
  const desc = req.body.desc;
  const saveBlog = blog_table.build({
    title,
    desc,
  });
  await saveBlog.save();
  res.send("data posted");
});

app.get("/", async (req, res) => {
  const alldata = await blog_table.findAll();
  res.json(alldata);
});

app.put("/:id", async (req, res) => {
  const data = req.body.data;
  blog_table.update(
    {
      desc: data,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  const alldata = await blog_table.findAll();
  res.json(alldata);
});

app.delete("/:id", async (req, res) => {
  blog_table.destroy({
    where: {
      id: req.params.id,
    },
  });
  const alldata = await blog_table.findAll();
  res.json(alldata);
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
