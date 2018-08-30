var util = {
  uuid: function() {
    //replace with actual uuid4 implementation
    let random = '' + Math.random()
    return random
  },

  store: function (name, data) {
    return localStorage.setItem(name, JSON.stringify(data))
  },

  retrieve: function (name) {
    let storedData = localStorage.getItem(name)
    return JSON.parse(storedData) || []
  }
}

var App = {
  init: function() {
    this.clothes = util.retrieve('clothes')
    this.outfits = util.retrieve('outfits')
    this.bindEvents()
    this.render()
  },

  createClothing: function (e) {
    var input = e.target
    var value = input.value.trim()
    var key = e.key

    if ( key !== 'Enter' || !value ) {
      return
    }

    if ( key === 'Enter' ) {
      input.value = ''
    } 

    this.clothes.push({
      id: util.uuid(),
      name: value,
      isSelected: false
    })

    this.render()


  },

  selectedClothes: function() {
    let selectedClothes = this.clothes.filter( clothing => clothing.isSelected )
    return selectedClothes
  },

  createOutfit: function (e) {
    var input = e.target
    var outfitName = input.value.trim()
    var selectedClothes = this.selectedClothes()
    var key = e.key

    if ( !outfitName || selectedClothes.length===0 || key !== 'Enter') {
      return
    }

    if ( key ==='Enter' ){
      input.value = ''
    }

    selectedClothes = this.selectedClothes().map( (selected) => {   
      return {
        id: selected.id,
        name: selected.name
      }
    }) 

    var newOutfit = {
      id: util.uuid(),
      name: outfitName,
      clothes: selectedClothes,
      isContentVisible: false,
    }

    this.outfits.push(newOutfit)

    this.render()

  },

  bindEvents: function() {
    var newClothing = document.getElementById('new-clothing')
    var newOutfit = document.getElementById('new-outfit')
    var clothingList = document.getElementById('clothes')
    var outfitList = document.getElementById('outfits')
    newClothing.addEventListener('keyup', this.createClothing.bind(this))
    newOutfit.addEventListener('keyup', this.createOutfit.bind(this))
    clothingList.addEventListener('click', this.toggle.bind(this))
    clothingList.addEventListener('click', this.delete.bind(this))
    outfitList.addEventListener('click', this.toggleOutfitContent.bind(this))
    outfitList.addEventListener('click', this.delete.bind(this))
  },

  render: function(){
    this.renderClothes()
    this.renderOutfits()

    util.store('clothes', this.clothes)
    util.store('outfits', this.outfits)
  },

  getIndexFromEl: function(el, array) {
    var id = el.closest('li').dataset.id
    var i = array.length

    while (i--) {
      if (array[i].id === id) {
        return i
      }
    }
  },

  toggle: function(e) {
    if (!e.target.matches('.toggle')){ 
      return
    }
    var i = this.getIndexFromEl(e.target, this.clothes)
    this.clothes[i].isSelected = !this.clothes[i].isSelected
    this.render()
  },

  delete: function(e){
    if (!e.target.matches('.delete')){ 
      return
    }
    var closestListID = e.target.closest('ul').id
    var i = this.getIndexFromEl(e.target, closestListID)
    this[closestListID].splice(i, 1)

    this.render()
  },

  renderClothes: function(){
    let clothes = this.clothes

    let clothingUL = document.getElementById('clothes')
    clothingUL.innerHTML = '' 
 
    if (clothes.length === 0) {
      return
    }

    let clothingList = document.createDocumentFragment() 
    clothes.forEach( (el) => clothingList.appendChild( this.renderClothing(el) ) )

    clothingUL.appendChild(clothingList)
  },

  renderClothing: function(clothing){
    let clothingFragment = document.createDocumentFragment()
    

    let clothingLi = document.createElement('li')
    let clothingIsSelected = clothing.isSelected
    if ( clothingIsSelected ) {
      clothingLi.classList.add('selected')
    }
    clothingLi.dataset.id = clothing.id

    let clothingName = document.createElement('label')
    clothingName.textContent = clothing.name

    let toggleInput = document.createElement('input')
    toggleInput.classList.add('toggle')
    toggleInput.type = 'checkbox'
    toggleInput.checked = clothingIsSelected

    let deleteButton = document.createElement('button')
    deleteButton.classList.add('delete')
    deleteButton.textContent = 'DELETE'

    clothingLi.appendChild(toggleInput)
    clothingLi.appendChild(clothingName)
    clothingLi.appendChild(deleteButton)
    clothingFragment.appendChild(clothingLi)

    return clothingFragment
  },

  renderOutfit: function(outfit){
    let isContentVisible = outfit.isContentVisible
    let outfitFragment = document.createDocumentFragment()

    let outfitLi = document.createElement('li')
    outfitLi.dataset.id = outfit.id

    let toggleOutfitContent = document.createElement('input')
    toggleOutfitContent.classList.add('toggle-outfit-content')
    toggleOutfitContent.type = 'checkbox'
    toggleOutfitContent.checked = isContentVisible

    let outfitName = document.createElement('label')
    outfitName.textContent = outfit.name

    let outfitContent = document.createElement('ul')
    outfitContent.classList.add('outfit-content')
    let outfitContentFragment = document.createDocumentFragment()
    outfit.clothes.forEach( (clothing) => {
      let clothingLi = document.createElement('li')
      clothingLi.textContent = clothing.name
      outfitContentFragment.appendChild(clothingLi)
    })
    outfitContent.appendChild(outfitContentFragment)
    outfitContent.style.display = isContentVisible ? 'block' : 'none'

    let wearButton = document.createElement('button')
    wearButton.classList.add('wear-outfit')
    wearButton.textContent = 'Wear Outfit'

    let deleteButton = document.createElement('button')
    deleteButton.classList.add('delete')
    deleteButton.textContent = 'DELETE'

    outfitLi.appendChild(toggleOutfitContent)
    outfitLi.appendChild(outfitName)
    outfitLi.appendChild(deleteButton)
    outfitLi.appendChild(wearButton)
    outfitLi.appendChild(outfitContent)
    outfitFragment.appendChild(outfitLi)

    return outfitFragment
  },

  toggleOutfitContent: function(e){
    let toggle = e.target
    if (!toggle.matches('.toggle-outfit-content')){
      return
    }
    let i = this.getIndexFromEl(e.target, this.outfits)

    this.outfits[i].isContentVisible= !this.outfits[i].isContentVisible

    let outfitContent = toggle.parentNode.getElementsByClassName('outfit-content')[0]
    outfitContent.style.display = this.outfits[i].isContentVisible ? 'block' : 'none'
    this.render()
  },

  renderOutfits: function(){
    let outfits = this.outfits

    let outfitsUL = document.getElementById('outfits')
    outfitsUL.innerHTML = '' 
 
    if (outfits.length === 0) {
      return
    }

    let outfitsFragment = document.createDocumentFragment() 
    outfits.forEach( (el) => outfitsFragment.appendChild( this.renderOutfit(el) ) )

    outfitsUL.appendChild(outfitsFragment)
  },

}

App.init()