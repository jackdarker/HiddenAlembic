"use strict";
/*
 *
 */
class Position { //TODO how can this work with multiple chars?
    constructor() {
        this.other = player;
        this.facing = "away"
        this.distance = "far"
    }
}

class Stance {
    constructor() {
        this.minStability = 0,
        this.regenStability =0;
        this.id='Stance';
    }
    //_parent will be added dynamical
    get parent(){return this._parent?this._parent():null;}
    _relinkItems(parent){this._parent=window.gm.util.refToParent(parent);}
    get desc(){ return(Stance.name);}
    checkStance(){ //checks if the stance needs to be switched
        return(null);
    }
    onCombatStart(){
    }
    onTurnStart(){ 
    }
    updateTime(){
        //let now =window.gm.getTime();
    }
    transitFrom(old){ //override this for better description, old might be null!
        let res={OK:true,msg:''};
        res.msg=this.parent.name + ' is now '+ this.desc+'.' 
        return(res);
    }
}
class StanceStanding extends Stance {
    toJSON(){return window.storage.Generic_toJSON("StanceStanding", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(StanceStanding, value.data));}
    constructor(){super();this.id='StanceStanding';}
    checkStance() {
        let stance =null;
        if(this.parent.Stats.get('poise').value<30){
            stance = new StanceQuadrup();
        }
        return(stance)
    }
    get desc(){ return('walking normally');}
    static canTransitTo( who){ //checks if this Stance can be applied to who 
        let res={OK:false,msg:''};
        if(who.Stance.id==="StanceStanding") return(res);
        if(who.Stats.get('poise').value<45) {res.msg='not enough poise';return(res);}
        res.OK=true;
        return(res);
    }
    /*listPossibleAction(){
        //what can you do in this position?
        let list = [{id:"Dodge", type:"counter",requires:{},data:{}}
            ,{id:"Punch", type:"melee",requires:{},data:{}}]
            return(list);
    }
    listPossibleAbuse(){
        //what can others do to you in this position?
        let list = [{id:"Punch", type:"melee",requires:{},data:{}}
            ,{id:"Kiss", type:"melee",requires:{},data:{}}]
            return(list);
    }*/
}

class StanceQuadrup extends Stance {
    toJSON(){return window.storage.Generic_toJSON("StanceQuadrup", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(StanceQuadrup, value.data));}
    constructor(){super();this.id='StanceQuadrup';}
    checkStance() {
        let stance =null;
        return(stance)
    }
    get desc(){ return('crawling on hands and legs');}
    static canTransitTo( who){
        let res={OK:false,msg:''};
        if(who.Stance.id==="StanceQuadrup") return(res);
        res.OK=true;
        return(res);
    }
}

window.gm.StanceLib = (function (Lib){
    window.storage.registerConstructor(StanceStanding);
    window.storage.registerConstructor(StanceQuadrup);
    Lib['StanceStanding']=StanceStanding;
    Lib['StanceQuadrup']=StanceQuadrup;
    return Lib; 
}(window.gm.StanceLib || {}));