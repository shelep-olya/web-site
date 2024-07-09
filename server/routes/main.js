const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Головна сторінка з пагінацією
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "Mackdu Blog",
      description: "Simple blog created with NodeJs, Express & MongoDB.",
    };

    let perPage = 10;
    let page = parseInt(req.query.page) || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments();
    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error });
  }
});

// Сторінка окремого поста
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById(slug);

    const locals = {
      title: data.title,
      description: "Simple blog created with NodeJs, Express & MongoDB.",
      currentRoute: `/post/${slug}`,
    };

    res.render("post", { locals, data, currentRoute: "/post" });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error });
  }
});

// Пошук постів
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search Results",
      description: "Simple blog created with NodeJs, Express & MongoDB.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      locals,
      data,
      currentRoute: "/search",
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error });
  }
});

// Сторінка "Про нас"
router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});

// Сторінка "Контакти"
router.get("/contact", (req, res) => {
  res.render("contact", {
    currentRoute: "/contact",
  });
});

module.exports = router;
