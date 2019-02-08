const titleInput = document.getElementById('title-input')
const bodyInput = document.getElementById('body-input')
const saveButton = document.querySelector('.save-button')
let ideas = []

document.querySelector('.save-button').disabled = true
bodyInput.addEventListener('keyup', enableSaveButton)

document.querySelector('.idea-form').addEventListener('submit', createIdea)
document.getElementById('card-container').addEventListener('click', handleClick)
document.getElementById('card-container').addEventListener('keyup', handleChange)
document.getElementById('search-input').addEventListener('keyup', searchFilter)

document.querySelector('.genius-button').addEventListener('click', geniusFilter)
document.querySelector('.swill-button').addEventListener('click', swillFilter)
document.querySelector('.plausible-button').addEventListener('click', plausibleFilter)

loadIdeas()

function loadIdeas() {
  if (localStorage.getItem('ideas').length > 0) {
    const storedIdeas = JSON.parse(localStorage.getItem('ideas'))
    storedIdeas.forEach(idea => {
      const { title, body, id, quality } = idea
      var idea = new Idea(title, body, id, quality)
      ideas.push(idea)
      populateIdeaCard(idea)
    })
  }
}

function enableSaveButton() {
  if (bodyInput) {
    saveButton.disabled = false
  } else {
    saveButton.disabled = true
  }
}

function createIdea(e) {
  e.preventDefault()
  const newIdea = new Idea(titleInput.value, bodyInput.value)
  ideas.push(newIdea)
  newIdea.setToStorage(ideas)
  populateIdeaCard(newIdea)
  document.querySelector('.idea-form').reset()
}

function populateIdeaCard(idea) {
  const { title, body, id, quality } = idea
  const card = document.createElement('section')
  const qualities = ['Swill', 'Plausible', 'Genius']
  const cardContainer = document.getElementById('card-container')
  card.className = 'idea-card'
  card.dataset.id = id
  card.innerHTML =
    `<div class="card-content">
      <h2 class="idea-title" id="${id}" contenteditable= "true">${title}</h2>
      <h4 class="idea-body" contenteditable="true">${body}</h4>
    </div>
    <footer class="vote">
      <button class="downvote-button">DOWNVOTE</button>
      <button class="upvote-button">UPVOTE</button>
      <span class="quality-text">Quality:&nbsp</span>
      <span class="quality-category">${qualities[quality]}</span>
    <div class="delete">
      <button class="delete-button">DELETE</button>
    </div>
    </footer>`
  cardContainer.prepend(card)
}

function deleteIdea(e) {
  var id = parseInt(e.target.closest('.idea-card').dataset.id)
  const filteredIdeas = ideas.filter(idea => {
    if (idea.id === id) {
      idea.deleteFromStorage(ideas)
    }
    return idea.id !== id
  })
  ideas = [...filteredIdeas]
  e.target.closest('.idea-card').remove()
}

function handleChange(e) {
  var id = parseInt(e.target.closest('.idea-card').dataset.id)
  switch (e.target.className) {
    case 'idea-title':
      ideas.forEach(idea => {
        if (idea.id === id) {
          idea.updateSelf(e.target.innerText, 'title')
        }
      })
      break
    case 'idea-body':
      ideas.forEach(idea => {
        if (idea.id === id) {
          idea.updateSelf(e.target.innerText, 'body')
        }
      })
      break
    default:
      break
  }
}

function handleClick(e) {
  e.preventDefault()
  switch (e.target.className) {
    case 'delete-button':
    deleteIdea(e)
      break
    case 'upvote-button':
    incrementQuality(e)
      break
    case 'downvote-button':
    decrementQuality(e)
      break 
    default:
      break
  }
}

function incrementQuality(e) {
  if (e.target.closest('.idea-card') !== null) {
    var id = parseInt(e.target.closest('.idea-card').dataset.id)
    ideas.forEach(idea => {
      if (idea.id === id) {
        e.target.nextElementSibling.nextElementSibling.innerText = idea.updateQuality('up')
        idea.setToStorage(ideas)
      }
    })
  }
}

function decrementQuality(e) {
  if (e.target.closest('.idea-card') !== null) {
    var id = parseInt(e.target.closest('.idea-card').dataset.id)
    ideas.forEach(idea => {
      if (idea.id === id) {
        e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerText = idea.updateQuality('down')
        idea.setToStorage(ideas)
      }
    })
  }
}

function swillFilter(e) {
  e.preventDefault()
  document.getElementById('card-container').innerHTML = null;
  ideas.map(idea => {
    if (idea.quality === 0) {
      populateIdeaCard(idea)
    }
  })
}

function plausibleFilter(e) {
  e.preventDefault()
  document.getElementById('card-container').innerHTML = null;
  ideas.map(idea => {
    if (idea.quality === 1) {
      populateIdeaCard(idea)
    }
  })
}

function geniusFilter(e) {
  e.preventDefault()
  document.getElementById('card-container').innerHTML = null;
  ideas.map(idea => {
    if (idea.quality === 2) {
      populateIdeaCard(idea)
    }
  })
}

function searchFilter() {
  document.getElementById('card-container').innerHTML = null;
  const searchInput = document.getElementById('search-input').value.toLowerCase()
  const filteredIdeas = ideas.filter(idea => {
    return (idea.title.toLowerCase().includes(searchInput) || idea.body.toLowerCase().includes(searchInput))
  })
  filteredIdeas.forEach(idea => populateIdeaCard(idea))
}