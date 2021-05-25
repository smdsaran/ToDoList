const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.use(bodyParser.urlencoded( {extended : true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://20001118:20001118@Sa@cluster0.w9eiq.mongodb.net/toDolist', {useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false});

const toDoSchema = new mongoose.Schema({
   name: String
});



const Item = new mongoose.model("Item" , toDoSchema);

const item1 = new Item( {
  name: "Welcome"
});

const item2 = new Item( {
  name: "Click + key to Add ."
});

const defaultItems = [item1 , item2];

const listSchema = new mongoose.Schema({
  name: String , 
  items: [toDoSchema]
});

const List = new mongoose.model("List" , listSchema);

const day = date.GetDate();

app.get("/" , function(req , res) {

  

  Item.find({} , function(err , doc) {
    
    if(doc.length === 0) {
    Item.insertMany( defaultItems , function(err) {
      if(err) {
        console.log("Error Occured");
      }
    
      else {
        console.log("Datas Saved Successfully");
      }
    });

    res.redirect("/");
    }

  else {
      res.render("lists" , {
        toDay: "ToDoList" , newItems: doc
    });
  }
  });




});

app.post("/" , function(req , res) {
  const item = req.body.newItem;
  const listName = req.body.list_name;

  const n_item = new Item( {
    name: item
  });

  if(listName === "ToDoList") {
    n_item.save();
  res.redirect("/");
  }

  else {
    List.findOne( { name: listName }, function(err , founddoc) {
      founddoc.items.push(n_item);
      founddoc.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete" ,   function(req , res) {
  const deleteItem = req.body.check;
  const listName = req.body.listName;

  if(listName === "ToDoList") {
    Item.deleteOne( { _id: deleteItem} , function(err) {
        if(!err) {
          console.log("Item Deleted");
        }
    });
    res.redirect("/");
  }

  else {
    List.findOneAndUpdate({name: listName}, {$pull: {items:{_id: deleteItem}}}, (err, data) => {
      if (!err) {
        console.log("Item Deleted in custom list .");
      }
    });
    res.redirect("/" + listName);

  }

});

app.get("/:customListName" , function(req , res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName} , function(err , docresult) {
    if(!err) {
      if(!docresult) {
        // new  list create
          const list = new List( {
            name: customListName , 
            items: defaultItems
          });
        
        list.save();

        res.redirect("/" + customListName);
        
      }

      else {
        // view the list
        res.render("lists" , {
          toDay: docresult.name , newItems: docresult.items
      });
    }
  }
  });

  

});

app.get("/work" , function(req , res){
    res.render("lists" , {
        toDay: "Work" , newItems: works
});

});

app.post("/work" , function(req , res) {

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port , function() {
    console.log("Server is running .....");
});