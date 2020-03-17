document.addEventListener("DOMContentLoaded", function() {
  showBooks()
});


 const listDiv = document.querySelector("#list-panel")
 const showDiv = document.querySelector("#show-panel")
  const ul = document.querySelector("#list")




  // handel the response and for each book assign to each book a li and append the li to the ul
 function showBooks(){
  getBooks().then(books =>{
    books.forEach(book => {
      const li = document.createElement("li")
      li.setAttribute("id", book.id)
      li.innerText = book.title
      ul.append(li)
      li.addEventListener("click", event => { 
    
        showDiv.innerText = ""
        oneBook(event.target.id)
       
       })
    });
  })
  
 }
  

//  fetch from the books API and return the response 
 function getBooks(){
  return fetch("http://localhost:3000/books")
   .then(response => response.json())
 }


 const renderUser = (book, user, ul) => {
  const li = document.createElement("li")
  li.innerText = user.username

  const btn = document.createElement("button")
  btn.setAttribute("id", user.id)
  btn.innerText = `Unlike 👎`
  
  btn.addEventListener("click", event => {

   event.preventDefault();
   deleteUser(user.id).then(() => {
     book.users =  book.users.filter(users => users.id !== user.id)
     li.remove()
     btn.remove()

     fetch(`http://localhost:3000/books/${book.id}`, {
       method: "PATCH",
       headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({ 
      users: book.users
     })
      })
    
    } )
   
  })

 
  ul.append(li, btn)
 }

 function appendBook(book){

  
   const h1 = document.createElement("p")
   h1.innerText = book.title 
   
   const img = document.createElement("img")
   img.setAttribute("src", book.img_url)
  
   const p = document.createElement("p")
   p.innerText = book.description

   const btn = document.createElement("button");
   btn.setAttribute("id", book.id);
   btn.innerText = "read book";

   const likebtn = document.createElement("button")
   likebtn.setAttribute("id", book.id)

   likebtn.innerText = `👍 ${book.users.length}`
  
    likebtn.addEventListener("click", event => {
     
     event.preventDefault();
     
      like().then(user => {
        addUser(event.target.id, book.users, user)
        .then(book => {
          likebtn.innerText = `👍 ${book.users.length}`

          renderUser(book, user, ul)
         
        })
           
      })
      
    })

  
    const newDiv = document.createElement("div")
    newDiv.setAttribute("class", "users-panel")

    const ul = document.createElement("ul")
    ul.setAttribute("id", "user-list")
    
    const h2 = document.createElement("h2")
    h2.innerText = "User who liked this book"


    showDiv.append(h1, img, btn, p, likebtn, h2)
    
    
    book.users.forEach(user => {
        renderUser(book, user, ul)
 
    } )
  
    showDiv.appendChild(ul)

 }




function deleteUser(user_id){

  const confObj = {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}

return fetch(`http://localhost:3000/users/${user_id}`, confObj)
.then(response => response.json())

}





//array of hash

function addUser(book_id, users_array, userObj){

  const confObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      users: [...users_array, userObj]
    })
  }

  return fetch(`http://localhost:3000/books/${book_id}`, confObj)
  .then(response => response.json())

}


// create new user and return a prom
 function like(){

  const confObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      
      username: "TESTid99"
    })
  }

  return fetch("http://localhost:3000/users", confObj)
  .then(response => response.json())
 
 
 }
 

 //take a book id send the request the request to get this book and display it 

 function oneBook(book_id){
 
   fetch(`http://localhost:3000/books/${book_id}`)
  .then(response => response.json())
  .then(book => appendBook(book))

 }


