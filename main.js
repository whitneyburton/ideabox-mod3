const titleInput = document.getElementById('title-input')
const bodyInput = document.getElementById('body-input')
const saveButton = document.querySelector('.save-button')

document.querySelector('.save-button').disabled = true
titleInput.addEventListener('keyup', enableSaveButton)

document.getElementById('card-container').addEventListener('click', updateCardQuality)
document.getElementById('card-container').addEventListener('click', removeCard)
document.getElementById('card-container').addEventListener('focusout', updateCardInputs)
document.getElementById('search-input').addEventListener('keyup', searchFilter)
document.querySelector('.save-button').addEventListener('click', createIdea)
document.querySelector('.genius-button').addEventListener('click', geniusFilter)
document.querySelector('.swill-button').addEventListener('click', swillFilter)
document.querySelector('.plausible-button').addEventListener('click', plausibleFilter)

loadAllCards()

function loadAllCards() {
  document.querySelector('.idea-form').reset()
  Object.keys(localStorage).forEach(function (key) {
    populateIdeaCard(JSON.parse(localStorage.getItem(key)))
  })
}

function enableSaveButton() {
  bodyInput ?
    saveButton.disabled = false :
    saveButton.disabled = true
}

function createIdea(e) {
  e.preventDefault()
  const newIdea = new Idea(titleInput.value, bodyInput.value)
  newIdea.setToStorage()
  populateIdeaCard(newIdea)
  document.querySelector('.idea-form').reset()
}

function populateIdeaCard(idea) {
  const card = document.createElement('section')
  const qualityArray = ['Swill', 'Plausible', 'Genius']
  const cardContainer = document.getElementById('card-container')
  card.className = 'idea-card'
  card.dataset.index = idea.id
  card.innerHTML =
    `<div class="card-content">
      <h2 class="idea-title" id="${idea.id}" contenteditable= "true">${idea.title}</h2>
      <h4 class="idea-body" contenteditable="true">${idea.body}</h4>
    </div>
    <footer>
      <div class="vote">
        <button class="icon-size downvote-icon"src="images/downvote.svg">DOWNVOTE</button>
        <button class="icon-size upvote-icon" src="images/upvote.svg">UPVOTE</button>
        <span class="quality-text">Quality:&nbsp</span>
        <span class="quality-category">${qualityArray[idea.quality]}</span>
    </div>
    <div class="delete">
      <button class="icon-size delete-icon" src="images/delete.svg">DELETE</button>
    </div>
    </footer>`
  cardContainer.insertBefore(card, cardContainer.firstChild)
}

function removeCard(e) {
  if (e.target.className === 'icon-size delete-icon') {
    const id = e.target.closest('.idea-card').dataset.index
    const ideaDeleteMethods = new Idea('', '', id)
    ideaDeleteMethods.deleteFromStorage()
    e.target.closest('.idea-card').remove()
  }
}



function geniusFilter(e) {
  e.preventDefault()
  const qualityCategory = document.querySelectorAll('.quality-category')
  const geniusButtonText = document.querySelector('.genius-button')
  qualityCategory.forEach(function (qualityValue) {
    if (qualityValue.innerText !== geniusButtonText.innerText) {
      qualityValue.closest('.idea-card').classList.add('display-mode-none')
    }
  })
}

function plausibleFilter(e) {
  e.preventDefault()
  const qualityCategory = document.querySelectorAll('.quality-category')
  const plausibleButtonText = document.querySelector('.plausible-button')
  qualityCategory.forEach(function (qualityValue) {
    if (qualityValue.innerText !== plausibleButtonText.innerText) {
      qualityValue.closest('.idea-card').classList.add('display-mode-none')
    }
  })
}

function searchFilter() {
  Object.keys(localStorage).forEach(function (cardObj) {
    let matchingCardsObject = document.getElementById(`${JSON.parse(localStorage[cardObj]).id}`)
    let matchingCards = matchingCardsObject.parentNode.parentNode
    let localStorageTitle = JSON.parse(localStorage[cardObj]).title
    let localStorageBody = JSON.parse(localStorage[cardObj]).body
    let searchInput = document.getElementById('search-input').value.toLowerCase()
    if (!localStorageTitle.toLowerCase().includes(searchInput) && !localStorageBody.toLowerCase().includes(searchInput)) {
      matchingCards.classList.add('display-mode-none')
    } else if (localStorageTitle.toLowerCase().includes(searchInput) && localStorageBody.toLowerCase().includes(searchInput)) {
      matchingCards.classList.remove('display-mode-none')
    }
  })
}

function swillFilter(e) {
  e.preventDefault()
  const qualityCategory = document.querySelectorAll('.quality-category')
  const swillButtonText = document.querySelector('.swill-button')
  qualityCategory.forEach(function (qualityValue) {
    if (qualityValue.innerText !== swillButtonText.innerText) {
      qualityValue.closest('.idea-card').classList.add('display-mode-none')
    }
  })
}

function updateCardInputs(e) {
  const id = e.target.closest('.idea-card').dataset.index
  const parsedIdea = JSON.parse(localStorage.getItem(id))
  const idea = new Idea(parsedIdea.title, parsedIdea.body, id, parsedIdea.quality)
  if (e.target.className === 'idea-title') {
    idea.updateSelf(e.target.innerText, 'title')
  }
  if (e.target.className === 'idea-body') {
    idea.updateSelf(e.target.innerText, 'body')
  }
}

function updateCardQuality(e) {
  if (e.target.closest('.idea-card') !== null) {
    const id = e.target.closest('.idea-card').dataset.index
    const idea = JSON.parse(localStorage.getItem(id))
    const ideaQuality = new Idea(idea.title, idea.body, idea.id, idea.quality)
    if (e.target.className === 'icon-size upvote-icon') {
      e.target.nextElementSibling.nextElementSibling.innerText = ideaQuality.updateQuality('up')
    }
    if (e.target.className === 'icon-size downvote-icon') {
      e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerText = ideaQuality.updateQuality('down')
    }
  }
}