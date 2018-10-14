(() => {
  let clothes = {
    clothes: [],
    addClothing: function (name) {
      this.clothes.push({
        id: util.uuid(),
        name: name,
        isSelected: false,
      })
    },

    retrieve: function() {
      this.clothes = util.retrieve('clothes')
    },

    selectedClothes: function() {
      let selectedClothes = this.clothes.filter( clothing => clothing.isSelected )
      return selectedClothes
    },

    toggleSelected: function(i) {
      this.clothes[i].isSelected = !this.clothes[i].isSelected      
    },
    
  }

  window.clothes = clothes
})()