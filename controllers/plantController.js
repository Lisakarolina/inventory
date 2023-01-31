const Plant = require("../models/plant");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      plant_count(callback) {
        Plant.countDocuments({}, callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Plant Catalog",
        error: err,
        data: results,
      });
    }
  );
};

// Show all plants
exports.plant_list = function (req, res, next) {
  Plant.find({}, "name")
    .sort({ title: 1 })
    .exec(function (err, list_plants) {
      if (err) {
        return next(err);
      }
      res.render("plant_list", {
        title: "Plant List",
        plant_list: list_plants,
      });
    });
};

// Show details of particular plant
exports.plant_detail = (req, res, next) => {
  async.parallel(
    {
      plant(callback) {
        Plant.findById(req.params.id).populate("category").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.plant == null) {
        const err = new Error("Plant not found");
        err.status = 404;
        return next(err);
      }
      res.render("plant_detail", {
        title: results.plant.name,
        plant: results.plant,
      });
    }
  );
};

// show create new plant form
exports.plant_create_get = (req, res, next) => {
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("plant_form", {
        title: "Create Plant",
        categories: results.categories,
      });
    }
  );
};

exports.plant_create_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("native", "Field native to must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("bloom", "Field bloom must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const plant = new Plant({
      name: req.body.name,
      description: req.body.description,
      native: req.body.native,
      bloom: req.body.bloom,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          for (const category of results.categories) {
            if (plant.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          res.render("plant_form", {
            title: "Create Plant",
            categories: results.categories,
            plant,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    plant.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/plantcatalog/plants");
    });
  },
];

// delete plant
exports.plant_delete_post = (req, res, next) => {
  Plant.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/plantcatalog/plants");
  });
};
