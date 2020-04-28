const express = require("express");
const mongoose = require("mongoose");
// modules that contain self-make method using exports
const date = require(__dirname + "/date.js");

const app = express();
//allow us to use ejs in the view folder, and have some dynamic html code with ejs.
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
//all us to use local file that inside the public folder on to the server
app.use(express.static("public"));

mongoose.connect("mongodb+srv://huoliang:Test123@cluster0-gljiy.mongodb.net/todoListDB", { useUnifiedTopology: true, useNewUrlParser: true});

//schema to pass in mongoose model
const itemSchema = {
  name: String
};

//mongoose model are usually capitalize,
//and mongoose model create a new collection with name items and follow itemschema rule
const Item =mongoose.model("Item", itemSchema);

// const item1 = new Item({
//   name : "Welcome!"
// })
//
// const item2 = new Item({
//   name : "Hit + to add"
// })
//
// const item3 = new Item({
//   name : "Check the box to delete."
// })
//
// const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items:[itemSchema]
}

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {
//exports method from date.js
  let day=date.getDate();

  Item.find({}, (err, items)=>{
    if(err){
      console.log(err);
    }else{
      // if(items.length === 0){
      //   Item.insertMany(defaultItems, (insertErr)=>{
      //     (insertErr)? console.log(insertErr) : console.log("Save.");})
      //     items = defaultItems;
      // }
      res.render("list", {title: day, newItems:items});
    }
  })
})

app.get("/:customListName", (req, res)=>{
  let customListName = req.params.customListName;
  customListName = customListName.charAt(0).toUpperCase() + customListName.slice(1);


  List.findOne({name:customListName}, (err, results)=>{
      if(!err){
        if(!results){
          const list = new List({
            name:customListName,
            items: []
          });
          list.save();
          res.redirect("/" + customListName);
        }else{
          res.render("list", {title: results.name, newItems: results.items});
        }
      }
  })

})

app.post("/", (req, res)=>{
  //body.list is the button value from the list.ejs
  // if(req.body.list === "Work List"){
  //   const itemName = req.body.new;
  //   item.save();
  //   res.redirect("/work")
  // }else{
    let day=date.getDate();
    const itemName = req.body.new;
    const listName = req.body.list;

  const item = new Item({
      name : itemName
    })

    if(listName === day){
      item.save();
      res.redirect("/");
    }else{
      List.findOne({name: listName}, (err, results)=>{
        results.items.push(item);
        results.save();
        res.redirect("/" + listName);
      })
    }

  // }
})

app.post("/delete", (req, res)=>{
  let day = date.getDate();
  const id = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === day){
    Item.findByIdAndDelete(id, (err)=>{
      (err)? console.log(err) : console.log("Successful Deletion");
    })
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name: listName},{$pull:{items: {_id: id}}}, (err, results)=>{
      if(!err){
        res.redirect("/" + listName);
      }
    })
  }

})

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is running.");
})
