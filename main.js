const titleInput = document.getElementById('title-input')
const bodyInput = document.getElementById('body-input')
const saveButton = document.querySelector('.save-button')
let ideas = []

document.querySelector('.save-button').disabled = true
bodyInput.addEventListener('keyup', enableSaveButton)

document.querySelector('.idea-form').addEventListener('submit', createIdea)
document.getElementById('card-container').addEventListener('click', handleClick)
document.getElementById('card-container').addEventListener('keyup', handleChange)
// document.getElementById('search-input').addEventListener('keyup', searchFilter)
// document.querySelector('.genius-button').addEventListener('click', geniusFilter)
// document.querySelector('.swill-button').addEventListener('click', swillFilter)
// document.querySelector('.plausible-button').addEventListener('click', plausibleFilter)

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
    increaseQuality(e)
      break
    case 'downvote-button':
    decreaseQuality(e)
      break 
    default:
      break
  }
}

function increaseQuality(e) {
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

function decreaseQuality(e) {
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

// function geniusFilter(e) {
//   e.preventDefault()
//   const qualityCategory = document.querySelectorAll('.quality-category')
//   const geniusButtonText = document.querySelector('.genius-button')
//   qualityCategory.forEach(function (qualityValue) {
//     if (qualityValue.innerText !== geniusButtonText.innerText) {
//       qualityValue.closest('.idea-card').classList.add('display-mode-none')
//     }
//   })
// }

// function plausibleFilter(e) {
//   e.preventDefault()
//   const qualityCategory = document.querySelectorAll('.quality-category')
//   const plausibleButtonText = document.querySelector('.plausible-button')
//   qualityCategory.forEach(function (qualityValue) {
//     if (qualityValue.innerText !== plausibleButtonText.innerText) {
//       qualityValue.closest('.idea-card').classList.add('display-mode-none')
//     }
//   })
// }

// function searchFilter() {
//   Object.keys(localStorage).forEach(function (cardObj) {
//     const matchingCardsObject = document.getElementById(`${JSON.parse(localStorage[cardObj]).id}`)
//     const matchingCards = matchingCardsObject.parentNode.parentNode
//     const localStorageTitle = JSON.parse(localStorage[cardObj]).title
//     const localStorageBody = JSON.parse(localStorage[cardObj]).body
//     const searchInput = document.getElementById('search-input').value.toLowerCase()
//     if (!localStorageTitle.toLowerCase().includes(searchInput) && !localStorageBody.toLowerCase().includes(searchInput)) {
//       matchingCards.classList.add('display-mode-none')
//     } else if (localStorageTitle.toLowerCase().includes(searchInput) && localStorageBody.toLowerCase().includes(searchInput)) {
//       matchingCards.classList.remove('display-mode-none')
//     }
//   })
// }

// function swillFilter(e) {
//   e.preventDefault()
//   const qualityCategory = document.querySelectorAll('.quality-category')
//   const swillButtonText = document.querySelector('.swill-button')
//   qualityCategory.forEach(function (qualityValue) {
//     if (qualityValue.innerText !== swillButtonText.innerText) {
//       qualityValue.closest('.idea-card').classList.add('display-mode-none')
//     }
//   })
// }