const express = require('express');
const router = express.Router();
const Post = require('../models/post');

//Routes
// router.get('', async (req, res) =>{
//     const locals = {
//         title: "Mackdu Blog",
//         description: "Simple blog created with NodeJs, Express & MongoDB."
//     };
//     try{
//         const data = await Post.find();
//         res.render('index', {locals, data});
//     }catch(error){
//         console.log(error);
//     }
    
// });
router.get('', async (req, res) =>{

    try{
        const locals = {
            title: "Mackdu Blog",
            description: "Simple blog created with NodeJs, Express & MongoDB."
        }
        let perPage = 10;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{$sort:{createdAT: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/ perPage);
        res.render('index',{ 
        locals,
        data,
        curent: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
        });
    }catch(error){
        console.log(error);
    }
    
});
router.get('/post/:id', async (req, res) => {

  try {
    let slug = req.params.id;
    const data = await Post.findById({_id: slug});
    const locals = {
        title: data.title,
        description: "Simple blog created with NodeJs, Express & MongoDB.",
        currentRoute: `/post/${slug}`
      }

    res.render('post', { locals, data, currentRoute });
  } catch (error) {
    console.log(error);
  }

});

router.post('/search', async (req, res) => {
  try {
    const locals = {
        title: "search",
        description: "Simple blog created with NodeJs, Express & MongoDB."
      }
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g, "");

    const data = await Post.find(
      {
        $or: [
          {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
          {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
        ]
      }
    );
    res.render("search", {
      data,
      locals

    });
  } catch (error) {
    console.log(error);
  }
  
})
router.get('/about', (req, res) =>{
    res.render('about',{
      currentRoute: '/about'
    });
});
router.get('/contact', (req, res) =>{
    res.render('contact', {currentRoute: req.path});
});
module.exports = router; 
