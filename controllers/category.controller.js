const db = require("../config/mongo.init");
const Category = require("../models/category");

exports.add = async (req, res) => {
  let { name, color, userId } = req.body;

  if (!name || !color || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newCategory = new Category({
    name,
    color,
    userId,
  });
  newCategory
    .save()
    .then((result) => {
      res.status(200).json({
        status: "SUCCESS",
        message: "New category  added successfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "FAILED",
        message: "An error occured while saving category !",
      });
    });
};

exports.getCategory = async (req, res) => {
  try {
    const userId = req.params.id;
    const category = await Category.find({ userId });

    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { color: req.body.color, name: req.body.name } },
      { new: true }
    );

    if (updatedCategory) {
      return res
        .status(200)
        .send({ status: true, message: "Category updated." });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Category update failed." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleteCategory = await Category.findOneAndDelete(
      { _id: req.params.id },
      { new: true }
    );
    if (deleteCategory) {
      return res
        .status(200)
        .send({ status: true, message: "Category deleted." });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Category delete failed." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
