class VuePageHelper {
  constructor(input){
    let jsonGlossaryDomList = document.getElementsByClassName(input);
    if(jsonGlossaryDomList == null){
      this.glossary = input;
    }else{
      this.glossary = JSON.parse(jsonGlossaryDomList[0].innerHTML);
    }
    
  }
  getGlossary(){
    return this.glossary;
  }
}

export {VuePageHelper}

