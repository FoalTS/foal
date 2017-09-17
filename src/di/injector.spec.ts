import { Injectable, Injector } from './injector';

@Injectable()
class Titi {
  constructor() {}
}

@Injectable()
class Toto {
  constructor(public titi: Titi) {}
}

const injector = new Injector();
injector.inject(Titi);
injector.inject(Toto);
const toto = injector.get(Toto);
const titi = injector.get(Titi);
injector.inject(Toto);
injector.inject(Titi);
console.log(toto === injector.get(Toto));
console.log(titi === injector.get(Titi));
console.log(toto.titi === titi);
console.log(injector.get(Toto));
console.log(injector.get(Titi));
