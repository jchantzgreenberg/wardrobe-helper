(() => {
  let outfits = {
    outfits: [],
    addOutfit: function(name, clothes) {
      clothes = clothes.map( (clothing) => {   
        return {
          id: clothing.id,
          name: clothing.name
        }
      }) 
      this.outfits.push({
        id: util.uuid(),
        name: name,
        clothes: clothes,
        isContentVisible: false,
        datesWorn: [],
      })
    },

    wearOutfit: function(i) {
      let lastWorn = moment()
      this.outfits[i].lastWorn = lastWorn
      this.outfits[i].datesWorn.push(lastWorn)
    },

    outfitsIncludingSelected: function(outfits, clothes) {
      let outfitsIncludingSelected = this.outfits.filter( outfit => this.outfitIncludes(outfit, clothes) )
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

    retrieve: function() {
      this.outfits = util.retrieve('outfits')
      this.datesToMoment()
    },

    datesToMoment: function() {
      this.outfits.forEach( outfit => {
        if (outfit.datesWorn.length){
          outfit.datesWorn = outfit.datesWorn.map(date => moment(date))
          outfit.lastWorn = moment(outfit.lastWorn)
        }
      })
    },

    outfitsWornSince: function(outfits, days) {
      let now = moment()
      let outfitsWornSince = this.outfits.filter( outfit => {
        let daysSinceLastWorn = now.endOf('day').diff(outfit.lastWorn, 'days')
        return daysSinceLastWorn <= days
      })
      return outfitsWornSince
    }
  }
  window.outfits = outfits
})()