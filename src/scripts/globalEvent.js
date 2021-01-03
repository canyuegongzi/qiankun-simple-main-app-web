/**
 * 发布订阅（主要用于发布订阅的全局事件）
 */
export class PubEvent {
    constructor(){
        this.clientList = {}
    }
    listen(key,fn){
        if(!this.clientList[key]){
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    }
    trigger(key,...args){
        let fns = this.clientList[key]
        if(!fns || fns.length === 0){
            return false
        }
        fns.forEach(fn=>{
            fn(...args)
        })
    }
    remove(key, fn){
        let fns = this.clientList[key]
        if(!fns){
            return false
        }
        if(!fn){
            fns && fns(fns.length = 0)
        }else{
            for ( let l = fns.length - 1; l >= 0; l-- ){
                let _fn = fns[ l ]
                if ( _fn === fn ){
                    fns.splice( l, 1 )
                }
            }
        }
    }
}
