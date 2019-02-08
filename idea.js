class Idea {
  constructor(title, body, id, quality) {
    this.id = id || Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 0;
  };

  setToStorage(idea) {
    localStorage.setItem('ideas', JSON.stringify(idea))
  };

  deleteFromStorage(ideas, idea) {
    console.log('fires')
    const filteredIdeas = ideas.filter(idea => idea.id !== this.id)
    localStorage.setItem('ideas', JSON.stringify(filteredIdeas))
  }

  updateQuality(direction) {
    var qualityArray = ['Swill', 'Plausible', 'Genius'];
    if (direction === 'up' && this.quality < 2) {
      this.quality++;
    } else if (direction === 'down' && this.quality > 0) {
      this.quality--;
    }
    return qualityArray[this.quality];
  }

  updateSelf(text, type) {
    console.log('updateSelf fires')
    if (type === 'title') {
      this.title = text;
    }
    if (type === 'body') {
      this.body = text;
    }
    this.setToStorage(ideas);
  }
};