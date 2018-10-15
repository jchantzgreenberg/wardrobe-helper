(() => {
  let outfits = {
    array: [],
    addOutfit: function(name, clothes) {
      clothes = clothes.map( (clothing) => {   
        return {
          id: clothing.id,
          name: clothing.name
        }
      }) 
      this.array.push({
        id: util.uuid(),
        name: name,
        clothes: clothes,
        isContentVisible: false,
        datesWorn: [],
      })
    },

    wearOutfit: function(i) {
      let lastWorn = moment()
      this.array[i].lastWorn = lastWorn
      this.array[i].datesWorn.push(lastWorn)
    },

    retrieve: function() {
      this.array = util.retrieve('outfits')
      this.datesToMoment()
    },

    datesToMoment: function() {
      this.array.forEach( outfit => {
        if (outfit.datesWorn.length){
          outfit.datesWorn = outfit.datesWorn.map(date => moment(date))
          outfit.lastWorn = moment(outfit.lastWorn)
        }
      })
    },

    outfitsIncludingSelected: function(outfits, clothes) {
      if(!clothes){return outfits} 
      let outfitsIncludingSelected = outfits.filter( outfit => this.outfitIncludes(outfit, clothes) )
      return outfitsIncludingSelected
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

    outfitsWornSince: function(outfits, days) {
      let now = moment()
      let outfitsWornSince = outfits.filter( outfit => {
        if (outfit.datesWorn.length === 0){
          return
        }
        let daysSinceLastWorn = now.endOf('day').diff(outfit.lastWorn, 'days')
        return daysSinceLastWorn <= days
      })
      return outfitsWornSince
    },

    outfitsWornSinceAndIncluding: function(outfits, days, clothes) {
      let outfitsWornSince = this.arrayWornSince(outfits, days)
      let outfitsWornSinceAndIncluding = this.arrayIncludingSelected(outfitsWornSince, clothes)
      return outfitsWornSinceAndIncluding
    },

    toggleContentVisibility: function(index) {
      let isContentVisible = this.array[index].isContentVisible
      this.array[index].isContentVisible = !isContentVisible
    }
  }
  window.outfits = outfits
})()