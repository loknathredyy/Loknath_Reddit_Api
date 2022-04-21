const client = require("./connection")
const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())

app.use(function (req, res, next) {

//   const corsWhiteList=['https://loknath-tourism-app.vercel.app', , 'https://indian-tourism-app.herokuapp.com']
//   if(corsWhiteList.indexOf(req.headers.origin) !== -1){
  // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'https://loknath-tourism-app.vercel.app');
//   res.setHeader('Access-Control-Allow-Origin',  'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
//   }
  next();
});

const PORT = process.env.PORT || 3300
// const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

client.connect()

app.get("/" , (req, res) => {
    res.send("Go to /users")
})

app.get("/users", (req, res) => {
  client.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      res.send(result.rows)
    }
  })
})


app.get("/users/:user_id", (req, res) => {
  client.query(
    `SELECT * FROM users WHERE user_id = ${req.params.user_id}`,
    (err, result) => {
      if(err){
        console.log(err)
        res.sendStatus(500)
      } else if (result.rows.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result.rows)
      }
    }
    )
  })
  
  app.get("/users_posts", (req, res) => {
    client.query("SELECT * FROM users_posts", (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        res.send(result.rows)
      }
    })
  })
  
  app.get("/users/:user_id/users_posts", (req, res) => {
  client.query(
    `SELECT * FROM users_posts WHERE user_id = ${req.params.user_id}`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else if (result.rows.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result.rows)
      }
    }
  )
})

app.get("/users/:user_id/users_posts/:post_id", (req, res) => {
  client.query(
    `SELECT * FROM users_posts WHERE user_id = ${req.params.user_id} AND post_id = ${req.params.post_id}`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else if (result.rows.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result.rows)
      }
    }
  )
})

app.get("/users_posts/:post_id", (req, res) => {
  client.query(
    `SELECT * FROM users_posts WHERE post_id = ${req.params.post_id}`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else if (result.rows.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result.rows)
      }
    }
  )
})

app.post("/users/:user_id/users_posts", (req, res) => {
  client.query(
    `INSERT INTO users_posts (user_id, image_url, video_url,post_caption) VALUES ( ${req.params.user_id}, '${req.body.image_url}', '${req.params.video_url}','${req.body.post_caption}')`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        res.sendStatus(201)
      }
    }
  )
})

app.post("/users", (req, res) => {
  const { name } = req.body
  client.query(
    `INSERT INTO users (name) VALUES ('${name}')`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        res.sendStatus(201)
      }
    }
  )
})

app.put("/users/:user_id", (req, res) => {
  const user_id = req.params.state_id
  const { name } = req.body
  client.query(
    `UPDATE users SET name = '${name}' WHERE user_id = ${user_id}`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else if (result.rowCount === 0) {
        res.sendStatus(404)
      } else {
        res.send("Updated")
      }
    }
  )
})

app.put("/users/:user_id/user_posts/:post_id", (req, res) => {
  const { post_caption, image_url,video_url } = req.body
  const user_id = req.params.user_id
  const post_id = req.params.post_id
  client.query(
    `UPDATE users_posts SET  post_caption = '${post_caption}', image_url = '${image_url}', video_url='${video_url}' WHERE user_id = ${user_id} AND post_id = ${post_id}`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else if (result.rowCount === 0) {
        res.sendStatus(404)
      } else {
        res.send("Updated")
      }
    }
  )
})

app.delete("/users/:user_id", (req, res) => {
  const user_id = req.params.user_id
  client.query(`DELETE FROM users WHERE user_id = ${user_id}`, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else if (result.rowCount === 0) {
      res.sendStatus(404)
    } else {
      res.send("Deleted")
    }
  })
})

app.delete("/users/:user_id/users_posts/:post_id", (req, res) => {
  const user_id = req.params.user_id
  const post_id = req.params.post_id
  client.query(
    `DELETE FROM users_posts WHERE user_id = ${user_id} AND post_id = ${post_id}`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else if (result.rowCount === 0) {
        res.sendStatus(404)
      } else {
        res.send("Deleted")
      }
    }
  )
})

app.delete("/users_posts/:post_id", (req, res) => {
  client.query(
    `DELETE FROM users_posts WHERE post_id = ${req.params.post_id}`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else if (result.rowCount === 0) {
        res.sendStatus(404)
      } else {
        res.send("Deleted")
      }
    }
  )
})


// POST COMMENT
app.post('/users_posts/:post_id/comments', (req, res) => {
    const {post_id,comment} = req.body
    client.query(
        `INSERT INTO comments (post_id,comment) VALUES(${post_id},'${comment}')`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else if (result.rowCount==0){
            res.sendStatus(404)
        }else{
            res.send("comment added")
        }
    })
    client.end
})

// Get all comments

  app.get("/comments", (req, res) => {
    client.query("SELECT * FROM comments", (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        res.send(result.rows)
      }
    })
  })

// GET A COMMENT
app.get('/users_posts/:post_id/comments/', (req, res) => {
    client.query(
        `select * from comments where post_id=${req.params.post_id}`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        }else if (result.rows.length === 0) {
        res.sendStatus(404)
        }
         else {
            res.send(result.rows)
        }
    })
    client.end
})

// DELETE COMMENT
app.delete('/users_posts/:post_id/comments/:comment_id', (req, res) => {
    client.query(
        `DELETE FROM comments WHERE comment_id = ${req.params.comment_id}`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err.message)
        } else {
            res.send('comment deleted successfully')
        }
    })
    client.end
})

app.delete('/comments/:comment_id', (req, res) => {
    client.query(
        `DELETE FROM comments WHERE comment_id = ${req.params.comment_id}`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err.message)
        } else {
            res.send('comment deleted successfully')
        }
    })
    client.end
})
