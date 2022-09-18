"use strict";

class SkillInspect extends Skill {
    constructor(){
        super("Inspect");
        this.msg = '';
    }
    toJSON(){return window.storage.Generic_toJSON("SkillInspect", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillInspect, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc(){ return("Check out your foe.");}
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)){
            result.OK = true;
            this.msg = 'resistance of ';//window.gm.printBodyDescription(targets[0],true);
            for(let n of window.gm.combat.TypesDamage){
                this.msg += 'resist/armor '+n.id+ ' '+ targets[0].Stats.getItem('rst_'+n.id).value +'% / '+targets[0].Stats.getItem('arm_'+n.id).value+'</br>'; 
            }
            this.msg+= '</br>';
            for(let n of ['agility','charisma','endurance','intelligence','luck','perception','strength']){
                this.msg += n+ ' '+ targets[0].Stats.getItem(n).value +', '; 
            }
            this.msg+= '</br>';
            //todo display stats dependign on skill
            result.msg =this.msg;
        }
        return result
    }
    getCastDescription(result){
        return(this.msg);
    }
}
//execute simple attack with active weapon or claws
class SkillAttack extends Skill {
    constructor(){
        super("Attack");
        this.msg = '';
        this.weapon='';
        this.cost.energy =10;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillAttack", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillAttack, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc(){ return("Use weapon or claws to deal damage. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                let attack = this.__estimateAttack(target)
                let result2 = window.gm.combat.calcAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        }
        return result;
    }
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        let lHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.LHand);
        let rHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.RHand);
        attack.mod=null;
        if(rHand && rHand.attackMod){ //get weapon damage info
            attack.mod=rHand.attackMod(target);
        } else if(lHand && lHand.attackMod){ //todo dual wield?
            attack.mod=lHand.attackMod(target);
        }
        if(attack.mod===null){ //if has no weapon get claw damage, mouth damage, ??
            rHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bHands);
            if(rHand && rHand.attackMod){
                attack.mod=rHand.attackMod(target);
            }
        }
        if(attack.mod===null){ //fallback??
            let mod = new SkillMod();mod.msg='barehanded';
            mod.onHit = [{ target:target, eff:[effDamage.factory(3,'blunt')]}];
            attack.mod=mod;
        }
        return(attack);
    }
    getCastDescription(result){
        return(this.msg);
    }
}
class SkillStrongHit extends SkillAttack {
    constructor(){
        super();this.id=this.name='StrongAttack'
        this.msg = '';this.weapon='';
        this.cost.energy =30;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillStrongHit", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillStrongHit, value.data));}
    get desc(){ return("Use "+this.weapon+" offensivly for increased critical chance but overall reduced hit chance. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                let attack =window.gm.combat.defaultAttackData();
                //get data from weapon
                attack.mod = this.parent.parent.Outfit.getItem(this.weapon).attackMod(target);
                attack.mod.critChance=50,attack.mod.hitChance=70;
                let result2 = window.gm.combat.calcAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        }
        return result;
    }
}
class SkillShoot extends SkillAttack {
    constructor(){
        super();this.id=this.name='SkillShoot'
        this.msg = '';this.weapon='';
        this.cost.energy =20,this.cost.will =5; //todo ammo cost
    }
    toJSON(){return window.storage.Generic_toJSON("SkillShoot", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillShoot, value.data));}
    get desc(){ return("Use "+this.weapon+" to shoot at someone. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                let attack =window.gm.combat.defaultAttackData();
                //get data from weapon
                attack.mod = this.parent.parent.Outfit.getItem(this.weapon).attackMod(target);
                attack.mod.critChance=5,attack.mod.hitChance=50;
                let result2 = window.gm.combat.calcAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        }
        return result;
    }
}
class SkillUltraKill extends SkillAttack {
    constructor(){
        super();
        this.id=this.name='UltraKill'
        this.msg = '';
    }
    toJSON(){return window.storage.Generic_toJSON("SkillUltraKill", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillUltraKill, value.data));}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        attack.mod = new SkillMod();
        attack.mod.onHit = [{ target:target, eff: [effDamage.factory(99999,'blunt')]}];
        return(attack);
    }
}
//execute attack with Face
class SkillBite extends SkillAttack {
    constructor(){
        super();
        this.id=this.name='Bite'
        this.msg = '';
        this.cost.energy =20;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillBite", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillBite, value.data));}
    get desc(){ return("Use your maw to bite the foe. "+this.getCost().asText());}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        let mouth=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bMouth);
        attack.mod= new SkillMod();
        if(mouth && mouth.attackMod){ //get teeth damage info
            attack.mod=mouth.attackMod(target);
        }
        return(attack);
    }
}
//execute attack with Stinger
class SkillSting extends SkillAttack {
    static dataPrototype(){ return({style:''}); }
    static factory(id){
        let obj =  new SkillSting();
        obj.setStyle(id);
        return(obj);
    }
    constructor(){
        super();
        this.id=this.name='Sting';
        this.data = SkillSting.dataPrototype();
        this.msg = '';
        this.cost.energy =20;
    }
    setStyle(id){
        this.data.style = id;
        switch(id){
            case 'wasp-stinger': 
                this.id=this.name= id; this.data.weapon='bTailBase';
                this.startDelay=1,this.defCoolDown=3;  //todo poison regeneration depends on?
                break;
            default:
                throw new Error("unknown Stinger-style "+id);
        }
    }
    getStyle(){ return this.data.style; }
    toJSON(){return window.storage.Generic_toJSON("SkillSting", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillSting, value.data));}
    get desc(){ return("Use your "+this.name+" to sting a foe. "+this.getCost().asText());}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        let weapon=this.caster.Outfit.getItemForSlot(this.data.weapon);
        attack.mod= new SkillMod();
        if(weapon && weapon.attackMod){ //get damage info
            attack.mod=weapon.attackMod(target);
        }
        return(attack);
    }
}
//slobber your foe
class SkillSlobber extends SkillAttack {
    static dataPrototype(){ return({style:''}); }
    static factory(id){
        let obj =  new SkillSlobber();
        obj.setStyle(id);
        return(obj);
    }
    constructor(){
        super();
        this.id=this.name='Slobber';
        this.data = SkillSlobber.dataPrototype();
        this.msg = '';
        this.cost.energy =25;
    }
    setStyle(id){
        this.data.style = id;
        switch(id){
            case 'slime-slobber': 
                this.id=this.name=id; this.data.weapon='bTailBase';
                this.startDelay=0,this.defCoolDown=1;
                break;
            default:
                throw new Error("unknown slobber-style "+id);
        }
    }
    getStyle(){ return this.data.style; }
    toJSON(){return window.storage.Generic_toJSON("SkillSlobber", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillSlobber, value.data));}
    get desc(){ return("Use your "+this.name+" to drool all over your foe. "+this.getCost().asText());}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        let weapon=this.caster.Outfit.getItemForSlot(this.data.weapon);
        attack.mod= new SkillMod();
        if(weapon && weapon.attackMod){ //get damage info
            attack.mod=weapon.attackMod(target);
        }
        return(attack);
    }
}
//execute attack with Feet
class SkillKick extends SkillAttack {
    constructor(){
        super();
        this.id=this.name='Kick'
        this.msg = '';
        this.cost.energy =20;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillKick", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillKick, value.data));}
    get desc(){ return("Use your feet kungfu style. "+this.getCost().asText());}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        let feet=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bFeet);
        attack.mod= new SkillMod();
        if(feet && feet.attackMod){ //get feet damage info
            attack.mod=feet.attackMod(target);
        }
        return(attack);
    }
}
class SkillTailWhip extends SkillAttack {
    constructor(){
        super();
        this.id=this.name='Tailwhip'
        this.msg = '';
        this.cost.energy =20;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillTailWhip", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillTailWhip, value.data));}
    get desc(){ return("Use your big tail as a weapon. "+this.getCost().asText());}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        let tail=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bTailBase);
        attack.mod= new SkillMod();
        if(tail && tail.attackMod){ //get damage info
            attack.mod=tail.attackMod(target);
        }
        return(attack);
    }
}
class SkillFireball extends SkillAttack {
    static dataPrototype(){ return({style:''}); }
    static factory(id){
        let obj =  new SkillFireball();
        obj.setStyle(id);
        return(obj);
    }
    constructor(){
        super();
        this.id=this.name='Fireball';
        this.data = SkillFireball.dataPrototype();
        this.msg = ''
        this.cost.energy=20,this.cost.will=20;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillFireball", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillFireball, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    setStyle(id){
        this.data.style = id;
        switch(id){
            case 'fireball': 
            case 0:
                this.id=this.name="SkillFireball";
                //this.startDelay=0,this.defCoolDown=1;
                break;
            default:
                throw new Error("unknown "+id);
        }
    }
    getStyle(){ return this.data.style; }
    get desc(){ return("Cast a fireball. "+this.getCost().asText());}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        attack.mod = new SkillMod();
        attack.mod.onHit = [{ target:target, eff: [effDamage.factory(5,'fire')]}];
        attack.mod.onCrit = [{ target:target, eff: [effDamage.factory(10,'fire')]}];
        /*let weapon=this.caster.Outfit.getItemForSlot(this.data.weapon);
        attack.mod= new SkillMod();
        if(weapon && weapon.attackMod){ //get damage info
            attack.mod=weapon.attackMod(target);
        }*/
        return(attack);
    }
}
class SkillSpark extends SkillAttack {
    static dataPrototype(){ return({style:''}); }
    static factory(id){
        let obj =  new SkillSpark();
        obj.setStyle(id);
        return(obj);
    }
    constructor(){
        super();
        this.id=this.name='Spark';
        this.data = SkillSpark.dataPrototype();
        this.msg = ''
        this.cost.energy=20,this.cost.will=20;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillSpark", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillSpark, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    setStyle(id){
        this.data.style = id;
        switch(id){
            case 'spark': 
            case 0:
                this.id=this.name="SkillSpark";
                //this.startDelay=0,this.defCoolDown=1;
                break;
            default:
                throw new Error("unknown "+id);
        }
    }
    getStyle(){ return this.data.style; }
    get desc(){ return("Cast a spark. "+this.getCost().asText());}
    __estimateAttack(target){
        let attack =window.gm.combat.defaultAttackData();
        attack.mod = new SkillMod();
        attack.mod.onHit = [{ target:target, eff: [effDamage.factory(5,'spark')]}];
        attack.mod.onCrit = [{ target:target, eff: [effDamage.factory(10,'spark')]}];
        return(attack);
    }
}
class SkillChainLightning  extends Skill {
    constructor(){
        super('ChainLightning');
        this.msg = '';
        this.cost.energy=20,this.cost.will=10;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillChainLightning", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillChainLightning, value.data));}
    get desc(){ return("Throw some sparks at your foes.");}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)){
            result.OK = true;
            let target = targets[0];
            let attack =window.gm.combat.defaultAttackData();
            // attack.effects.push(effDamage.factory(15,'spark'))
            //calc hit-chance
            //cause spark-dmg
            //chance to hit secondary target
            let secTarget = window.story.state.combat.playerParty.concat(window.story.state.combat.enemyParty);
            secTarget = this.targetFilterEnemy(this.targetFilterAlive(secTarget));
            let secTarget2=[];

            while(secTarget.length>_i){
                let target2 = secTarget.pop()[0]; //[[mob1]]
                if(target2!==target){
                    secTarget2.push(target2);
                }
                if(secTarget2.length>=2) break;
            }
            //spark-dmg to secondary target
            let result2 = window.gm.combat.calcAttack(this.caster,target,attack);
            this.msg+=result2.msg;
            result.effects = result.effects.concat(attack.effects); 
        }
        return result;
    }
    getCastDescription(result){
        return(this.msg);
    }
}
class SkillTease extends Skill {
    constructor(){
        super("Tease");
        this.msg = '',this.style=0;
        this.cost.energy=15;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillTease", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillTease, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    set style(style){ //skilllevel
        this._style = style;
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ="Tease Lv"+this.style;
        return(msg);
    }
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        let fconv =window.gm.util.descFixer(this.parent.parent),_tmp='';
        if(this.isValidTarget(targets)){
            result.OK = true;
            let dmg =5*(1+this.style/5); //teaseproficiency +20%/level
            //tease depends on clothing slutiness/nudeness,own arousal
            let lewds=this.caster.Outfit.getLewdness();
            if(this.parent.parent.Stats.getItem('arousal').value>40) dmg *=1.5;
            //dmg*=Math.max(0,0.5+this.level*0.15);
            this.msg = fconv('Shaking $[my]$ hips, $[I]$ $[try]$ to arouse the audience.'); //todo
            for(var target of targets){
                let attack =window.gm.combat.defaultAttackData();
                attack.mod= new SkillMod();
                _tmp = fconv(target.name+" gets aroused by $[my]$ lewd display. ");
                attack.mod.onHit=[{target:target, eff:[effTeaseDamage.factory(dmg,'slut',lewds,_tmp)]}];
                attack.mod.onCrit=[{target:target, eff:[effTeaseDamage.factory(dmg*2,'slut',lewds,_tmp)]}];
                let result2 = window.gm.combat.calcTeaseAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        }
        return result
    }
    getCastDescription(result){
        return(this.msg);
    }
}
class SkillStun extends Skill {
    //execute stun attack
    constructor(){  super("Stun");  
    this.cost.energy =25;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillStun", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillStun, value.data));}
    targetFilter(targets){
        var possibletarget = this.targetFilterFighting(this.targetFilterEnemy(targets));
        //[[mole1],[mole2]]
        var n,multi = [];
        multi.name = "all";
        for(var n of possibletarget){
            if(n.length===1)   //dont stack multi-targets
                multi.push(n[0]);
        }
        if(multi.length>1) possibletarget.push(multi);  //if there is only [[mole]] we dont want [[mole],[mole]]
        return(possibletarget);//[[mole1],[mole2],[mole1,mole2]]
    }
    get desc(){ return("A successful stun lowers the foes chance to evade and might disable them for some time. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                result.effects.push( {target:target,
                    eff:[new effStunned()]})
                }
        }
        return result
    }
    getCastDescription(result){
        //update msg after sucessful cast
        return(this.caster.name +" stunned " + ((result.targets.length>1)?result.targets.name:result.targets[0].name)+".");
    }
}

/**
 * 
 *
 * @class SkillDetermined
 * @extends {Skill}
 */
class SkillDetermined extends Skill {
    static factory(coolDown=7){
        let sk = new SkillDetermined();
        sk.startDelay=sk.defCoolDown=coolDown;
        return(sk);
    }
    constructor(){  super("Determined");  
    this.cost.energy =5;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillDetermined", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillDetermined, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    get desc(){ return("Increases recovery of will and energy for some turns. Long cooldown. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                result.effects.push( {target:target,
                    eff:[new effDetermined.factory(10,10,25,4)]})
                }
        }
        return result
    }
    getCastDescription(result){
        //update msg after sucessful cast
        return(this.caster.name +" stunned " + ((result.targets.length>1)?result.targets.name:result.targets[0].name)+".");
    }
}
class SkillPoisonCloud extends Skill {
    constructor(){  super("PoisonCloud");
        this.cost.energy =20;
        this.amount=4;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillPoisonCloud", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillPoisonCloud, value.data));}
    targetFilter(targets){
        return(this.targetFilterFighting(this.targetFilterEnemy(targets)));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        //if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                let attack =window.gm.combat.defaultAttackData();
                attack.mod= new SkillMod();//todo blok damage if airfilter
                attack.mod.onHit = [{ target:target, eff: [effDamage.factory(this.amount,'poison')]}];
                let result2 = window.gm.combat.calcAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        //}
        return result
    }
    getCastDescription(result){
        return(this.caster.name +" poisons " + result.targets.name+".");
    }
}
class SkillHeal extends Skill {
    constructor(){ super("Heal");   
    this.cost.will =25; 
    }
    toJSON(){return window.storage.Generic_toJSON("SkillHeal", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillHeal, value.data));}
    targetFilter(targets){
        return(this.targetFilterAlly(this.targetFilterAlive(targets)));
    }
    get desc(){ return("Restore some health. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                result.effects.push( {target:target,
                    eff:[effHeal.factory(15)]})
                }
        }
        return result
    }
}
class SkillFlee extends Skill {
    constructor(){ 
        super("Flee"); 
        this.msg = '';   
        this.cost.energy =10; this.cost.will =10;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillFlee", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillFlee, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    isEnabled(){
        let res= super.isEnabled();
        if(res.OK===false) return(res);
        if(!window.gm.Encounter.enableFlee) 
            return({OK:false,msg:'cant flee from this fight'});
        return(res);
    }
    previewCast(targets){
        var result = new SkillResult()
        this.msg = '';
        result.skill =this,result.source = this.caster, result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            let rnd = _.random(1,100);
            if(rnd >40){ //Todo fleeing chance calculation
              result.msg += "You escaped the fight.";
              window.story.state.combat.playerFleeing = true;  //just setting the flag, you have to take care of handling!
            } else {
              result.msg += "Your attempts to escape failed.";
              //result.OK=false;
            }
            this.msg = result.msg;
        }
        return result
    }
    get desc(){ return("Try to flee from combat. "+this.getCost().asText());}
    getCastDescription(result){
        return(this.msg);
    }
}
class SkillSubmit extends Skill {
    constructor(){ 
        super("Submit"); 
        this.msg = '';   }
    toJSON(){return window.storage.Generic_toJSON("SkillSubmit", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillSubmit, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    previewCast(targets){
        var result = new SkillResult()
        this.msg = '';
        result.skill =this,result.source = this.caster, result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            let rnd = _.random(1,100);
            if(rnd >0){ //Todo fleeing chance calculation
                result.msg += "You submit to your foe.";
                window.story.state.combat.playerSubmitting = true;  //just setting the flag, you have to take care of handling!
            } else {
                result.msg += "Your attempts to submit failed.";
                //result.OK=false;
            }
            this.msg = result.msg;
        }
        return result
    }
    getCastDescription(result){
        return(this.msg);
    }
}
class SkillGrapple extends Skill {
    constructor(){ super("Grapple"); this.msg = ''; }
    toJSON(){return window.storage.Generic_toJSON("SkillGrapple", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillGrapple, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc(){ return("Grapple the opponent to restrict its movement.");}
    previewCast(targets){
        var result = new SkillResult();
        this.msg = '';
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            var target=targets[0];
            var rnd = _.random(0,100);
            if(rnd>30){ //todo chance to grapple depends on?
                let x = effGrappled.factory(); //target get grappled effect and caster grappling until the grapple is undone
                result.effects.push( {target:this.caster,eff:[x.sourceEff]});
                result.effects.push( {target:target,eff:[x.targetEff]});
            } 
        }
        this.msg = result.msg;
        return result
    }
    getCastDescription(result){
        return(this.msg);
    }
}
//char attaches itself to target and sucks health
class SkillLeechHealth extends Skill {
    constructor(){ 
        super("Leech");
        this.msg = ''; }
    toJSON(){return window.storage.Generic_toJSON("SkillLeechHealth", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillLeechHealth, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc(){ return("Grapple the opponent and suck the life from him.");}
    previewCast(targets){
        var result = new SkillResult();
        this.msg = '';
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            var target=targets[0];
            var rnd = _.random(0,100);
            if(rnd>30){ //todo chance to grapple depends on?
                let x = effGrappled.factory();
                this.__combineGrabAndLeech(x.targetEff,x.sourceEff);
                result.effects.push( {target:this.caster,eff:[x.sourceEff]});//,heal,leeching]
                result.effects.push( {target:target,eff:[x.targetEff]}); //im
            } 
        }
        this.msg = result.msg;
        return result
    }
    __combineGrabAndLeech(grabEff,grapplingEff){
        grapplingEff.onTurnStart = (function(me){
            let eff = grapplingEff;
            let _old = eff.onTurnStart.bind(eff); 
            let foo = function(){
                _old(); //override  but call orignial fct
                eff.parent.parent.Stats.increment('health',5);  //todo scale by ??
                return({OK:true,msg:''});
            }
            return(foo);
        } (this));
        grabEff.onTurnStart = (function(me){
            let eff = grabEff;
            let _old = eff.onTurnStart.bind(eff); 
            let foo = function(){
                _old(); //override  but call orignial fct
                eff.parent.parent.Stats.increment('health',-5);
                return({OK:true,msg:''});
            }
            return(foo);
        } (this));
    }
    getCastDescription(result){
        return(this.msg);
    }
}
//try to ungrapple
class SkillStruggle extends Skill {
    //todo improves defense
    constructor(){ 
        super("Struggle");
        this.msg = '';}
    toJSON(){return window.storage.Generic_toJSON("SkillStruggle", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillStruggle, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    get desc(){ return("Try to escape a grapple.");}
    isEnabled(){
        let res= super.isEnabled();
        if(res.OK===false) return(res);
        if(this.parent.parent.Effects.countItem(effGrappled.name)<=0) 
            return({OK:false,msg:'no need to struggle'});
        return(res);
    }
    previewCast(targets){
        var result = new SkillResult();
        this.msg = '';
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                if(target.Effects.countItem(effGrappled.name)>0){
                var rnd = _.random(0,100);
                var eff = target.Effects.get(effGrappled.name);
                result.msg = "Attempts to escape the grapple failed.";
                if(rnd>30){ //todo chance to ungrapple increase over time
                    result.effects.push( {target:target,
                      eff:[new effUngrappling(eff)]});
                    result.msg = this.caster.name+" was able to escape from "+eff.source.parent.parent.name+".";
                }
                }
                
            }
        }
        this.msg = result.msg;
        return result
    }
    getCastDescription(result){
        return(this.msg);
    }
}
class SkillGuard extends Skill { //todo guard improves defense and evade for some rounds (each hit has a chance to reduce duration)
    constructor(){ super("Guard"); this.style=0;}
    toJSON(){return window.storage.Generic_toJSON("SkillGuard", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillGuard, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    set style(style){ //skilllevel
        this._style = style;
        //this.id=this.name="Guard Lv"+style;
    }
    get style(){return this._style;}
    get desc(){ return("Lv"+this.style+": Boosts your defense.");}  
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;result.source = this.caster; result.targets = targets;
        result.OK = true;
        for(var target of targets){
            result.effects.push( {target:target,
                //weapResist,eRecover,duration
                eff:[effGuard.factory(10*Math.min(5,1+this.style),Math.min(5,this.style*20),this.style+1)]});
        }
        
        return result
    }
}
//cast light to repell dark
class SkillFairyLight extends Skill { 
    constructor(){ super("FairyLight"); this.style=0;this.cost.will =15;}
    toJSON(){return window.storage.Generic_toJSON("SkillFairyLight", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillFairyLight, value.data));}
    targetFilter(targets){
        let x=this.targetMultiple(this.targetFilterFighting(this.targetFilterEnemy(targets)));
        if(x) return([x[x.length-1]]); //there should be "all" add end of collection
        return(x);
    }
    set style(style){ //skilllevel
        this._style = style;
        //this.id=this.name="Guard Lv"+style;
    }
    get style(){return this._style;}
    get desc(){ return("Creates a magic light that weakens or repell creatures of the dark. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;result.source = this.caster; result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK=true;
            for(var target of targets){
                result.effects.push( {target:target,
                    //weapResist,eRecover,duration
                    eff:[effFairyLight.factory(this.style+1)]});
            }
        }
        return result
    }
}
class SkillFly extends Skill {
    constructor(){
        super();
        this.id=this.name='Fly'
        this.msg = '';
        this.cost.energy =20;
    }
    toJSON(){return window.storage.Generic_toJSON("SkillFly", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillFly, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    isActive(){
        let res={OK:false,msg:''};
        res.OK = (this.parent.parent.Effects.countItem(effFlying.name)>0);
        return (res);
    }
    get desc(){ return((!this.isActive().OK)?"Fly around to increase dodge chance. "+this.getCost().asText():'Stop flying.');}
    //onCombatStart(){} Todo birds start combat flying
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            var target = targets[0];
            result.effects.push( {target:target, eff:[new effFlying()]});
        }
        return result
    }
    getCastDescription(result){
        return(this.msg);
    }
}
class SkillUseItem extends Skill {
    constructor(){super("UseItem");
        this.item='';this.msg = '';
    }
    toJSON(){return window.storage.Generic_toJSON("SkillUseItem", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillUseItem, value.data));}
// first item has to be set
// then when targetFilter is called, forward the filterrequest to the item
// the item has to implement targetFilter and also check if the item is valid for use in combat    
    targetFilter(targets){
        return(this.caster.Inv.getItem(this.item).targetFilter(targets,this));
    }
    get item(){return this._item;}
    set item(item){
        this._item=item;
        this.msg = '';
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            this.msg = result.msg = this.caster.Inv.use(this.item,targets).msg;    //Todo preview shouldnt call use !
        }
        return result
    }
    getCastDescription(result){
        return(this.msg);
    }
}
//calls reinforcement; set item-string before casting to the mob-name to spawn
class SkillCallHelp extends Skill {
    static factory(item,cooldown=3){
        let sk = new SkillCallHelp();
        sk.item = item,sk.id+=item,sk.name+=' '+item;
        sk.cost.will =25; 
        //todo delay and cooldown
        return(sk);
    }
    constructor(){
        super("CallHelp");this.item='';
    }
    get desc(){ return("Summon "+this.item);}
    toJSON(){return window.storage.Generic_toJSON("SkillCallHelp", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillCallHelp, value.data));}
    targetFilter(targets){return(this.targetFilterSelf(targets));}
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this,result.source = this.caster,result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                let eff = new effCallHelp();
                eff.configureSpawn(this.item,this.caster.faction);
                result.effects.push( {target:target,eff:[eff]});
            }
        }
        return result
    }
    getCastDescription(result){
        return(this.parent.parent.name+" calls some "+this.item+" as reinforcement.");
    }
}
//replaces a combatant with a different mob. item is [mob-class], see effTransformSelf
class SkillTransformSelf extends Skill {
    static factory(item,cooldown=3){
        let sk = new SkillTransformSelf();
        sk.item = item,sk.id+=item[0],sk.name+=' '+item[0];
        sk.cost.will =25; 
        //todo delay and cooldown
        return(sk);
    }
    constructor(){
        super("TransformSelf");this.item=[''];
    }
    get desc(){ return("Transform into "+this.item[0]);}
    toJSON(){return window.storage.Generic_toJSON("SkillTransformSelf", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(SkillTransformSelf, value.data));}
    targetFilter(targets){return(this.targetFilterSelf(targets));}
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this,result.source = this.caster,result.targets = targets;
        if(this.isValidTarget(targets)){
            result.OK = true;
            for(var target of targets){
                let eff = new effTransformSelf();
                eff.configureSpawn(this.item);
                result.effects.push( {target:target,eff:[eff]});
            }
        }
        return result
    }
    getCastDescription(result){
        return(this.parent.parent.name+" transforms into "+this.item[0]+((this.item.length>1)?" and some friends":"")+".");
    }
}
window.gm.SkillsLib = (function (Lib){
    window.storage.registerConstructor(SkillAttack);
    window.storage.registerConstructor(SkillBite);
    window.storage.registerConstructor(SkillCallHelp);
    window.storage.registerConstructor(SkillDetermined);
    window.storage.registerConstructor(SkillGrapple);
    window.storage.registerConstructor(SkillFairyLight);
    window.storage.registerConstructor(SkillFlee);
    window.storage.registerConstructor(SkillFireball);
    window.storage.registerConstructor(SkillSpark);
    window.storage.registerConstructor(SkillFly);
    window.storage.registerConstructor(SkillGuard);
    window.storage.registerConstructor(SkillHeal);
    window.storage.registerConstructor(SkillInspect);
    window.storage.registerConstructor(SkillKick);
    window.storage.registerConstructor(SkillLeechHealth);
    window.storage.registerConstructor(SkillPoisonCloud);
    window.storage.registerConstructor(SkillShoot);
    window.storage.registerConstructor(SkillSlobber);
    window.storage.registerConstructor(SkillStrongHit);
    window.storage.registerConstructor(SkillStun);
    window.storage.registerConstructor(SkillSubmit);
    window.storage.registerConstructor(SkillSting);
    window.storage.registerConstructor(SkillStruggle);
    window.storage.registerConstructor(SkillTailWhip);
    window.storage.registerConstructor(SkillTease);
    window.storage.registerConstructor(SkillUltraKill);
    window.storage.registerConstructor(SkillUseItem);
    //    Lib['SkillAttack'] = function (){ return new SkillAttack();};
    return Lib; 
}(window.gm.SkillsLib || {}));

/*todo 
//Todo: disarm/disrobe  ArmorMelting
//Enrage +50%damage -25% armor

Slash: (weapontype) causes slash-damage; chance to cause bleed on critical (on non-constructs/conjuration)

Stoneskin: (passive) if a slash-attack would cause bleed; attackers weapon gets blunted for rest of fight

GolemCrusher: increased blunt-damage against golems

LifeDrain: soul-damage; restores health equal to fraction of damage caused on living

Supraconductor: incoming ice-damage has chance to increase spark-damage output for some turns; but fire-damage has the oposite effect

BladeMace: deals slash or blunt-damage depending which would cause more damage

Charge: Anrempeln des Gegners bringt ihn aus dem Gleichgewicht oder wirft ihn um

ShieldBoost: lädt ein Shield um 50% auf so lange es nicht komplett leer ist, cooldown=8

ShieldRestore: wenn das Shield komplett leer ist kann es wiederhergestellt werden 33-75%; cd=99

CoolDownReset: for any ally: if there are skills in cooldown, pick a random one and reset cooldown; cd=20

Leader: an ally using this is marked as a leader; as long as he is ingame, all allys except him receive bonus armor/regeneration/damage
        but if he is defeated, everyone gets mallus; can only be cast once per battle

Swift Drinker / Swift ...: you can, in one turn, drink a potion and then do something else. You can only do one swift action and have to choose it before the other action.
Anger Point	9	Maxes Attack after taking a critical hit.
Aura Break	2	Reduces power of Dark- and Fairy-type moves.
Battle Armor	11	The Pokémon is protected against critical hits.
Berserk	2	Raises Special Attack when HP drops below half.
Big Pecks	14	Protects the Pokémon from Defense-lowering attacks.
Blaze	28	Powers up Fire-type moves in a pinch.
Fluffy	4	Halves damage from contact moves, but doubles damage from Fire-type moves.
Friend Guard	8	Reduces damage done to allies.
Gooey	5	Contact with the Pokémon lowers the attacker's Speed stat.
Heatproof	3	Weakens the power of Fire-type moves.
Immunity	3	Prevents the Pokémon from getting poisoned.
Intimidate	37	Lowers the foe's Attack stat.
Klutz	10	The Pokémon can't use any held items.
Limber	14	The Pokémon is protected from paralysis.
Merciless	2	The Pokémon's attacks become critical hits if the target is poisoned.
Moxie	13	Boosts Attack after knocking out any Pokémon.
Pickpocket	10	Steals an item when hit by another Pokémon.
Poison Heal	3	Restores HP if the Pokémon is poisoned.
Poison Touch	11	May poison targets when a Pokémon makes contact.
Rattled	18	Bug, Ghost or Dark type moves scare it and boost its Speed.
Rivalry	18	Deals more damage to a Pokémon of same gender.
Scrappy	13	Enables moves to hit Ghost-type Pokémon.
Soul-Heart	1	Raises Special Attack when an ally faints.
Telepathy	26	Anticipates an ally's attack and dodges it.
Unnerve	26	Makes the foe nervous and unable to eat Berries.
*/
