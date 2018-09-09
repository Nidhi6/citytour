var express = require("express");
var router  = express.Router();
var City = require("../models/city");
var middleware = require("../middleware");


//INDEX - show all Citys
router.get("/", function(req, res){
    // Get all Citys from DB
    City.find({}, function(err, allCities){
       if(err){
           console.log(err);
       } else {
          res.render("cities/index",{cities:allCities});
       }
    });
});

//CREATE - add new City to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to Citys array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCity = {name: name, image: image, description: desc, author:author}
    // Create a new City and save to DB
    City.create(newCity, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to Cities page
            console.log(newlyCreated);
            res.redirect("/cities");
        }
    });
});

//NEW - show form to create new City
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("cities/new"); 
});

// SHOW - shows more info about one City
router.get("/:id", function(req, res){
    //find the City with provided ID
    City.findById(req.params.id).populate("comments").exec(function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            console.log(foundCity)
            //render show template with that City
            res.render("cities/show", {city: foundCity});
        }
    });
});

// EDIT City ROUTE
router.get("/:id/edit", middleware.checkCityOwnership, function(req, res){
    City.findById(req.params.id, function(err, foundCity){
        res.render("cities/edit", {city: foundCity});
    });
});

// UPDATE City ROUTE
router.put("/:id",middleware.checkCityOwnership, function(req, res){
    // find and update the correct City
    City.findByIdAndUpdate(req.params.id, req.body.city, function(err, updatedCity){
       if(err){
           res.redirect("/cities");
       } else {
           //redirect somewhere(show page)
           res.redirect("/cities/" + req.params.id);
       }
    });
});

// DESTROY City ROUTE
router.delete("/:id",middleware.checkCityOwnership, function(req, res){
   City.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/cities");
      } else {
          res.redirect("/cities");
      }
   });
});


module.exports = router;