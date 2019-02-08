class Idea {
  constructor(title, body, id, quality) {
    this.id = id || Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 0;
  };

  setToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  };

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  } 

  updateQuality(direction) {
    var qualityArray = ['Swill', 'Plausible', 'Genius'];
    if (direction === 'up' && this.quality < 2) {
      this.quality++;
    } else if (direction === 'down' && this.quality > 0) {
      this.quality--;
    }
    this.setToStorage();
    return qualityArray[this.quality];
  }
  updateSelf(text, type) {
    if (type === 'title') {
      this.title = text;
    } 
    if (type === 'body') {
      this.body = text;
    }
    this.setToStorage();
  }
};