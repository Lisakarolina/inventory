const express = require("express");
const router = express.Router();

const plant_controller = require("../controllers/plantController");
const category_controller = require("../controllers/categoryController");

router.get("/", plant_controller.index);

router.get("/plant/create", plant_controller.plant_create_get);

router.post("/plant/create", plant_controller.plant_create_post);

router.post("/plant/:id", plant_controller.plant_delete_post);

router.get("/plant/:id", plant_controller.plant_detail);

router.get("/plants", plant_controller.plant_list);

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id", category_controller.category_detail);

router.post("/category/:id", category_controller.category_delete_post);

router.get("/categories", category_controller.category_list);

module.exports = router;
