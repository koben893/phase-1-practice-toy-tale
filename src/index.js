let addToy = false;
const baseUrl = 'http://localhost:3000/'
const toysUrl = baseUrl + 'toys/'


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  // grab toy form and add event listener
  const addToyForm = document.getElementById( 'add-toy-form' )
  addToyForm.addEventListener( 'submit', createNewToy)

  fetchToys()
});

//When the page loads, make a 'GET' request to fetch all the toy objects.

const fetchToys = () => {
  fetch( toysUrl )
  .then( r => r.json() )
  .then( renderAllToys )
}


//With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
const renderAllToys = ( toys ) => {
  toys.forEach( renderToyCard) 
}

const renderToyCard = ( toy ) => {

  const toyCollectionDiv = document.getElementById('toy-collection')

  //a div with the class of "card" for each toy and add it to the toy collection div
  const toyCardDiv = document.createElement( 'div' )
  toyCollectionDiv.appendChild( toyCardDiv )
  toyCardDiv.className = "card"

  // h2 tag with the toy's name
  const toyCardH2 = document.createElement( 'h2' )
  toyCardDiv.appendChild( toyCardH2 )
  toyCardH2.textContent = toy.name

  // img tag with the src of the toy's image attribute and the class name "toy-avatar"
  const toyCardImage = document.createElement( 'img' )
  toyCardDiv.appendChild( toyCardImage )
  toyCardImage.src = toy.image
  toyCardImage.alt = 'Picture of a toy'
  toyCardImage.className = 'toy-avatar'

  // p tag with how many likes that toy has
  const toyCardLikesP = document.createElement( 'p' )
  toyCardDiv.appendChild( toyCardLikesP )
  toyCardLikesP.textContent = `${ toy.likes } Likes`

  // button tag with a class "like-btn" and an id attribute set to the toy's id number
  const toyCardLikeButton = document. createElement( 'button' )
  toyCardDiv.appendChild( toyCardLikeButton )
  toyCardLikeButton.textContent = 'Like!'
  toyCardLikeButton.className = 'like-btn'
  toyCardLikeButton.id = toy.id
  toyCardLikeButton.addEventListener( 'click', () => increaseToyLikes( toy, toyCardLikesP ) )

}

// When a user clicks on a toys like btn a patch request should be sent to the likes

function increaseToyLikes( toy, toyCardLikesP ) {


  const patchRequest = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'accepts': 'application/json'
    },
    body: JSON.stringify({
      // update toy in front end likes to be new number with += function
      likes: toy.likes += 1
    })
  }

  fetch( toysUrl + toy.id, patchRequest )
  .then( r => r.json())
  .then( patchedToyData => {
    toyCardLikesP.textContent = `${ patchedToyData.likes } Likes`
  })

}



// When a user submits the toy form a POST request should be sent to the toysUrl and the new toy should be save in our db.json
function createNewToy ( event ) {
  event.preventDefault()
  const toyForm = event.target

  const newToy = {
    name: toyForm.name.value,
    image: toyForm.image.value,
    likes: 0
  }

  const postRequest =  {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accepts': 'application/json'
    },
    body: JSON.stringify( newToy )
  }


  fetch( toysUrl, postRequest )
  .then( r => r.json())
  .then( newToyData => {
    renderToyCard ( newToyData )
  })

  // if post is successful, the toy should be added to the dom without reloading the page

}