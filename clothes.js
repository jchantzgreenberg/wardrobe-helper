(() => {
  // let clothes = {
  //   clothes: [],
  //   addClothing: function (name) {
  //     this.clothes.push({
  //       id: util.uuid(),
  //       name: name,
  //       isSelected: false,
  //     })
  //   },

    // retrieve: function() {
    //   this.clothes = util.retrieve('clothes')
    // },

    // selectedClothes: function() {
    //   let selectedClothes = this.clothes.filter( clothing => clothing.isSelected )
    //   return selectedClothes
    // },

    // toggleSelected: function(i) {
    //   this.clothes[i].isSelected = !this.clothes[i].isSelected      
    // },
    
  // }

  // window.clothes = clothes
  function Clothes() {
    this.array = []
  }

  Clothes.prototype.getIndex = util.getIndex

  Clothes.prototype.addClothing = function(name) {
    this.array.push({
      id: util.uuid(),
      name: name,
      isSelected: false,
    })
  }

  Clothes.prototype.retrieve = function() {
    this.array = util.retrieve('clothes')
  }

  Clothes.prototype.selectedClothes = function() {
    let selectedClothes = this.array.filter( clothing => clothing.isSelected )
    return selectedClothes
  }

  Clothes.prototype.toggleSelected = function(i) {
    this.array[i].isSelected = !this.array[i].isSelected      
  }

  window.Clothes = Clothes
})()