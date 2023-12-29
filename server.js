const express = require('express');
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const port = 800

app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path')
app.use(express.static('public'));
app.set("view engine", "ejs","css");
app.set("views", "views");



const db = mysql.createConnection({
  host: "localhost",
  database: "coba",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");

  app.get("/", (req, res) => {
    const sql = ("SELECT * FROM user")
    db.query(sql, (err, result) => {

      const users = JSON.parse(JSON.stringify(result))

      res.render("index", { users: users, title: "Pesan Anonim" })
    })
 
  });

  app.get("/hasil", (req, res) => {
    const sql = ("SELECT * FROM user")
    db.query(sql, (err, result) => {

      const users = JSON.parse(JSON.stringify(result))

      res.render("hasil", { users: users, title: "Hasil Pesan" })
    })
 
  });

  app.post("/search",(req,res)=>{
    const cari = req.body.cari
    const sql = `SELECT * FROM user WHERE name_user LIKE ('%${cari}%')`
    // const sql =  `SELECT * FROM user WHERE name_user LIKE ('%${req.body.cari}%') AND negara_user LIKE ('%${req.body.cari}%')`
    db.query(sql, (err, fields) => {
      if(err) throw err
       
      const users = JSON.parse(JSON.stringify(fields))

      res.render("hasil", { users: users, title:`pencarian dari ${cari}` })
    })

  
  })
     app.post("/tambah", (req, res) => {
      const insertSql = `INSERT INTO user (name_user , birth_user, negara_user) VALUES ('${req.body.name_user}', '${req.body.birth_user}', '${req.body.negara_user}')`;
      db.query(insertSql, (err, result) => {
        if (err) throw err; // Tambahkan penanganan kesalahan untuk melihat apakah ada masalah saat menjalankan kueri
        console.log("Data berhasil disimpan!");
        res.redirect("/"); // Redirect kembali ke halaman utama setelah data disimpan
      });
    });



    app.post("/hapus", (req, res) => {
      const userId = req.body.userId;
      const sql = `DELETE FROM user WHERE user , id_user = ${userId}`;
      db.query(sql, (err, result) => {
        console.log(result)
        if (err) {
          console.error(err);
          res.status(500).send('Error deleting user');
        } else {
          console.log("Data berhasil dihapus!");
          res.redirect("/hasil");
        }
      });
    });
})

app.listen(port, () => {
  console.log(`Server on localhost:${port}`);
})
