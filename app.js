(() => {
  let App = {
    init: function() {
      moment.fn.toJSON = function() { return this.format() }
      this.retrieve()
      this.clothes = clothes
      this.outfits = outfits
      this.bindEvents()
      this.render()
    },

    bindEvents: function() {
      let newClothing = document.getElementById('new-clothing')
      let newOutfit = document.getElementById('new-outfit')
      let clothingList = document.getElementById('clothes')
      let outfitList = document.getElementById('outfits')
      newClothing.addEventListener('keyup', this.createClothing.bind(this))
      newOutfit.addEventListener('keyup', this.createOutfit.bind(this))
      clothingList.addEventListener('click', this.toggleClothing.bind(this))
      clothingList.addEventListener('click', this.delete.bind(this))
      outfitList.addEventListener('click', this.toggleOutfitContent.bind(this))
      outfitList.addEventListener('click', this.delete.bind(this))
      outfitList.addEventListener('click', this.wearOutfit.bind(this))
    },

    
    //replace with methods in the clothes and outfits objects that search by id
    getIndexFromEl: function(el, array) {
      let id = el.closest('li').dataset.id
      let i = array.length

      while (i--) {
        if (array[i].id === id) {
          return i
        }
      }
    },

    delete: function(e){
      if (!e.target.matches('.delete')){ 
        return
      }
      let closestList = this[e.target.closest('ul').id][e.target.closest('ul').id]
      let i = this.getIndexFromEl(e.target, closestList)
      closestList.splice(i, 1)

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

      clothes.addClothing(value)

      this.render()
    },

    toggleClothing: function(e) {
      if (!e.target.matches('.toggle')){ 
        return
      }
      let i = this.getIndexFromEl(e.target, clothes.clothes)
      clothes.toggleSelected(i)
      this.render()
    },

    createOutfit: function (e) {
      let input = e.target
      let outfitName = input.value.trim()
      let selectedClothes = clothes.selectedClothes()
      let key = e.key

      if ( key ==='Enter' ){
        input.value = ''
      }

      if ( !outfitName || selectedClothes.length===0 || key !== 'Enter') {
        return
      }

      outfits.addOutfit(outfitName, selectedClothes)
      this.render()
    },

    wearOutfit: function(e) {
      if (!e.target.matches('.wear-outfit')) {
        return
      }

      let i = this.getIndexFromEl(e.target, outfits.outfits)
      outfits.wearOutfit(i)

      this.render()
    },


    toggleOutfitContent: function(e){
      let toggle = e.target
      if (!toggle.matches('.toggle-outfit-content')){
        return
      }
      let i = this.getIndexFromEl(e.target, outfits.outfits)

      outfits.outfits[i].isContentVisible= !outfits.outfits[i].isContentVisible

      let outfitContent = toggle.parentNode.getElementsByClassName('outfit-content')[0]
      outfitContent.style.display = outfits.outfits[i].isContentVisible ? 'block' : 'none'
      this.render()
    },

    render: function(){
      this.renderClothes(clothes.clothes)
      this.renderOutfits(outfits.outfits) 

      this.store()     
    },

    store: function(){
      util.store('clothes', clothes.clothes)
      util.store('outfits', outfits.outfits)
    },

    retrieve: function(){
      clothes.retrieve()
      outfits.retrieve()
    },

    renderClothes: function(clothes){
      let clothingUL = document.getElementById('clothes')
      clothingUL.textContent = '' 

      if (clothes.length === 0) {
        return
      }

      let clothingList = document.createDocumentFragment() 
      clothes.forEach( (el) => clothingList.appendChild( this.renderClothing(el) ) )

      clothingUL.appendChild(clothingList)
    },

    renderOutfits: function(outfits){
      let outfitsUL = document.getElementById('outfits')
      outfitsUL.innerHTML = '' 

      if (outfits.length === 0) {
        return
      }

      let outfitsFragment = document.createDocumentFragment() 
      outfits.forEach( (el) => outfitsFragment.appendChild( this.renderOutfit(el) ) )

      outfitsUL.appendChild(outfitsFragment)
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
    
    mostRecentDate(outfit) {
      let mostRecentDate = document.createElement('span')
      mostRecentDate.textContent = 'Last worn: ' + outfit.lastWorn.format('MMMM DD YYYY')
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

  }

  App.init()
  window.App = App
})()

