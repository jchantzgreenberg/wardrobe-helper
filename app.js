(() => {
  let App = {
    init: function() {
      moment.fn.toJSON = function() { return this.format() }
      this.clothes = new Clothes()
      this.outfits = outfits
      this.outfits.getIndex = util.getIndex
      this.filters = {
        wornSince: false,
        includingSelected: false,
      }
      this.retrieve()
      this.bindEvents()
      this.render()
    },

    bindEvents: function() {
      let newClothing = document.getElementById('new-clothing')
      let newOutfit = document.getElementById('new-outfit')
      let clothingList = document.getElementById('clothes')
      let outfitList = document.getElementById('outfits')
      let toggleWornSince = document.getElementById('wornSince')
      let toggleIncludingSelected = document.getElementById('includingSelected')
      newClothing.addEventListener('keyup', this.createClothing.bind(this))
      newOutfit.addEventListener('keyup', this.createOutfit.bind(this))
      clothingList.addEventListener('click', this.toggleClothing.bind(this))
      clothingList.addEventListener('click', this.delete.bind(this))
      outfitList.addEventListener('click', this.toggleOutfitContent.bind(this))
      outfitList.addEventListener('click', this.delete.bind(this))
      outfitList.addEventListener('click', this.wearOutfit.bind(this))
      toggleWornSince.addEventListener('click', this.toggleFilter.bind(this))
      toggleIncludingSelected.addEventListener('click', this.toggleFilter.bind(this))

    },

    getIndexFromEl: function(el) {
      let uuid = el.closest('li').dataset.id
      let closestUL = el.closest('ul').id
      let index = this[closestUL].getIndex(uuid)
      return index
    },

    delete: function(e){
      if (!e.target.matches('.delete')){ 
        return
      }
      let closestList = this[e.target.closest('ul').id].array
      let i = this.getIndexFromEl(e.target, closestList)
      closestList.splice(i, 1)

      this.render()
    },

    toggleFilter: function(e){
      let target = e.target
      let type = target.id
      if (!target.matches('.filter')){
        return
      }
      this.filters[type] = !this.filters[type]
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

      this.clothes.addClothing(value)

      this.render()
    },

    toggleClothing: function(e) {
      if (!e.target.matches('.toggle')){ 
        return
      }
      let i = this.getIndexFromEl(e.target)
      this.clothes.toggleSelected(i)
      this.render()
    },

    createOutfit: function (e) {
      let input = e.target
      let outfitName = input.value.trim()
      let selectedClothes =this.clothes.selectedClothes()
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

      let i = this.getIndexFromEl(e.target)
      outfits.wearOutfit(i)

      this.render()
    },


    toggleOutfitContent: function(e){
      let toggle = e.target
      if (!toggle.matches('.toggle-outfit-content')){
        return
      }
      let i = this.getIndexFromEl(e.target)
      outfits.toggleContentVisibility(i)
      this.render()
    },

    render: function(){
      this.renderClothes(this.clothes.array)
      this.renderOutfits(outfits.filteredOutfits(this.filters, this.clothes.selectedClothes())) 
      this.store()     
    },

    store: function(){
      util.store('clothes',this.clothes.array)
      util.store('outfits', outfits.array)
    },

    retrieve: function(){
      this.clothes.retrieve()
      this.outfits.retrieve()
    },

    renderClothes: function(clothes){
      let clothingUL = document.getElementById('clothes')
      clothingUL.textContent = '' 

      if (this.clothes.length === 0) {
        return
      }

      let clothingList = document.createDocumentFragment() 
      this.clothes.array.forEach( (el) => clothingList.appendChild( this.renderClothing(el) ) )

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
      outfitContent.style.display = isContentVisible ? 'block' : 'none'

      if (outfit.datesWorn.length) {
        outfitContent.appendChild(this.mostRecentDate(outfit))
      }

      outfit.clothes.forEach( (clothing) => {
        let clothingLi = document.createElement('li')
        clothingLi.textContent = clothing.name
        outfitContent.appendChild(clothingLi)
      })

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

