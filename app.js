let util = {
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

;(() => {
  let App = {
    init: function() {
      moment.fn.toJSON = function() { return this.format() } 
      this.clothes = util.retrieve('clothes')
      this.outfits = util.retrieve('outfits')
      this.bindEvents()
      this.render()
    },

    createClothing: function (e) {
      let input = e.target
      let value = input.value.trim()
      let key = e.key

      if ( key === 'Enter' ) {
        input.value = ''
      } 

      if ( key !== 'Enter' || !value ) {
        return
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
      let input = e.target
      let outfitName = input.value.trim()
      let selectedClothes = this.selectedClothes()
      let key = e.key

      if ( key ==='Enter' ){
        input.value = ''
      }

      if ( !outfitName || selectedClothes.length===0 || key !== 'Enter') {
        return
      }

      selectedClothes = this.selectedClothes().map( (selected) => {   
        return {
          id: selected.id,
          name: selected.name
        }
      }) 

      let newOutfit = {
        id: util.uuid(),
        name: outfitName,
        clothes: selectedClothes,
        isContentVisible: false,
        datesWorn: [],
      }
      this.outfits.push(newOutfit)
      this.render()
    },

    wearOutfit: function(e) {
      if (!e.target.matches('.wear-outfit')) {
        return
      }

      let i = this.getIndexFromEl(e.target, this.outfits)
      this.outfits[i].datesWorn.push(moment())

      this.render()
    },

    bindEvents: function() {
      let newClothing = document.getElementById('new-clothing')
      let newOutfit = document.getElementById('new-outfit')
      let clothingList = document.getElementById('clothes')
      let outfitList = document.getElementById('outfits')
      newClothing.addEventListener('keyup', this.createClothing.bind(this))
      newOutfit.addEventListener('keyup', this.createOutfit.bind(this))
      clothingList.addEventListener('click', this.toggle.bind(this))
      clothingList.addEventListener('click', this.delete.bind(this))
      outfitList.addEventListener('click', this.toggleOutfitContent.bind(this))
      outfitList.addEventListener('click', this.delete.bind(this))
      outfitList.addEventListener('click', this.wearOutfit.bind(this))
    },

    render: function(){
      this.renderClothes()
      this.renderOutfits()

      util.store('clothes', this.clothes)
      util.store('outfits', this.outfits)
    },

    getIndexFromEl: function(el, array) {
      let id = el.closest('li').dataset.id
      let i = array.length

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
      let i = this.getIndexFromEl(e.target, this.clothes)
      this.clothes[i].isSelected = !this.clothes[i].isSelected
      this.render()
    },

    delete: function(e){
      if (!e.target.matches('.delete')){ 
        return
      }
      let closestList = this[e.target.closest('ul').id]
      let i = this.getIndexFromEl(e.target, closestList)
      closestList.splice(i, 1)

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
      let clothingLi = document.createElement('li')
      clothingLi.dataset.id = clothing.id

      let clothingIsSelected = clothing.isSelected
      if ( clothingIsSelected ) {
        clothingLi.classList.add('selected')
      }

      let clothingName = document.createElement('label')
      clothingName.textContent = clothing.name

      let toggleInput = this.checkboxInput(clothingIsSelected)
      toggleInput.classList.add('toggle')

      let deleteButton = this.deleteButton()

      clothingLi.appendChild(this.fragmentFromElements([toggleInput, clothingName, deleteButton]))

      return clothingLi
    },

    deleteButton: function(){
      let deleteButton = document.createElement('button')
      deleteButton.classList.add('delete')
      deleteButton.textContent = 'DELETE'
      return deleteButton
    },

    checkboxInput: function(isChecked){
      let checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = isChecked
      return checkbox
    },

    renderOutfit: function(outfit){
      let isContentVisible = outfit.isContentVisible

      let outfitLi = document.createElement('li')
      outfitLi.dataset.id = outfit.id

      let toggleOutfitContent = this.checkboxInput(isContentVisible)
      toggleOutfitContent.classList.add('toggle-outfit-content')

      let outfitName = document.createElement('label')
      outfitName.textContent = outfit.name

      let outfitContent = document.createElement('ul')
      outfitContent.classList.add('outfit-content')

      if (outfit.datesWorn.length) {
        outfitContent.appendChild(this.mostRecentDate(outfit))
      }

      outfit.clothes.forEach( (clothing) => {
        let clothingLi = document.createElement('li')
        clothingLi.textContent = clothing.name
        outfitContent.appendChild(clothingLi)
      })

      outfitContent.style.display = isContentVisible ? 'block' : 'none'

      let wearButton = document.createElement('button')
      wearButton.classList.add('wear-outfit')
      wearButton.textContent = 'Wear Outfit'

      let deleteButton = this.deleteButton()

      outfitLi.appendChild(this.fragmentFromElements([toggleOutfitContent, outfitName, 
        deleteButton, wearButton, outfitContent]))

      return outfitLi
    },

    mostRecentDate(outfit) {
      let datesWorn = outfit.datesWorn
      let numberOfTimesWorn = datesWorn.length
      let mostRecentDate = document.createElement('span')
      mostRecentDate.textContent = 'Last worn: ' + moment(datesWorn[numberOfTimesWorn-1]).format('MMMM DD YYYY')
      return mostRecentDate
    },

    fragmentFromElements: function(elements) {
      let toAppend = document.createDocumentFragment()
      let i = 0
      while (i < elements.length) {
        toAppend.appendChild(elements[i])
        i++
      }
      return toAppend
    },

    outfitsIncludingSelected: function() {
      let selectedClothes = this.clothes.filter( clothing => {
        return clothing.isSelected
      })

      let outfits = this.outfits.filter( outfit => this.outfitIncludes(outfit, selectedClothes) )
      return outfits
    },

    outfitIncludes: function(outfit, clothes) {
      let outfitClothesIDs = outfit.clothes.map( clothing => clothing.id )
      let includesClothes = true
      let i = 0
      while (includesClothes && (i < clothes.length) ){
        includesClothes = outfitClothesIDs.includes(clothes[i].id)
        i++
      }
      return includesClothes
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
})()