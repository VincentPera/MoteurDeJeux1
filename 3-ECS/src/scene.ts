import { IEntity, Entity } from './entity';
import { IComponent } from './components';

// # Interface *ISceneWalker*
// Définit le prototype de fonction permettant d'implémenter
// le patron de conception [visiteur](https://fr.wikipedia.org/wiki/Visiteur_(patron_de_conception))
// sur les différentes entités de la scène.
export interface ISceneWalker {
  (entity: IEntity, name: string): Promise<any>;
}

// # Interfaces de description
// Ces interfaces permettent de définir la structure de
// description d'une scène, telle que normalement chargée
// depuis un fichier JSON.
export interface IComponentDesc {
  [key: string]: any;
}

export interface IEntityDesc {
  components: IComponentDesc;
  children: ISceneDesc;
}

export interface ISceneDesc {
  [key: string]: IEntityDesc;
}

// # Classe *Scene*
// La classe *Scene* représente la hiérarchie d'objets contenus
// simultanément dans la logique du jeu.
export class Scene {
    static current: Scene;
    _description: ISceneDesc;
    _object: Map<string,IEntity> = new Map<string,IEntity>(); 
  // ## Fonction statique *create*
  // La fonction *create* permet de créer une nouvelle instance
  // de la classe *Scene*, contenant tous les objets instanciés
  // et configurés. Le paramètre `description` comprend la
  // description de la hiérarchie et ses paramètres. La fonction
  // retourne une promesse résolue lorsque l'ensemble de la
  // hiérarchie est configurée correctement.
    static create(description: ISceneDesc): Promise<Scene> {
        var objects: IComponent[] = [];
        var desc: string[] = [];
        var promises : Promise<any>[] = [];
      const scene = new Scene(description);
      Scene.current = scene;
      var keys = Object.keys(description);
      for (var i = 0; i < keys.length; i++) {
          var masterEntity: IEntity;
          masterEntity = new Entity();
          this.current._object.set(keys[i], masterEntity);
          this.sceneFn(description[keys[i]], masterEntity, objects, desc);
      }


      for (var ii = 0; ii < objects.length; ii++){
          var promise = objects[ii].setup(desc[ii]) as Promise<any>;

          if (promise != undefined) {
              promises.push(promise as Promise<any>);
              console.log(typeof (promise));
              console.log((promise));
          }
      }


      return Promise.all(promises).then(scene => { return Scene.current });
      //return Promise.all(promises).then(scene => { return Scene.current });
      }

    /*static handlePromise(obj: IComponent[], indice: any): Promise<any> {
        return new Promise((resolve => {
            obj[indice].setup();
            resolve(handlePromise(obj, indice + 1));
        }));
        }*/
    

    /*static createScene(description: ISceneDesc): Promise<Scene> {
     const scene = new Scene(description);
     Scene.current = scene;
    var objects = [];
    var keys = Object.keys(description);
    for (var i = 0; i < keys.length; ++i) {
        var e_courant = new Entity();
        e_courant.
        scene._object.s
        objects.push(new Entity(description[keys[i]]));
        // où le constructeur crée les composants
    }

    return Promise.each(objects, function (obj, index) {
        return obj.setup(description[keys[index]]);
        // la méthode "setup" retourne une promesse
    });
}
    */
  private constructor(description: ISceneDesc) {
      this._description = description;
  }

  static sceneFn(description: IEntityDesc, currentEntity: IEntity, obj: IComponent[], desc:string[]) {
      for (var j = 0; j < Object.keys(description.children).length; j++) {  //Children loop
          var child: IEntity;
          child = new Entity();
          var entitySuiv: IEntityDesc;
          entitySuiv = description.children[j];
          currentEntity.addChild(Object.keys(description.children)[j], child);
          this.current._object.set(Object.keys(description.children)[j], child);
          this.sceneFn(description.children[Object.keys(description.children)[j]], child, obj,desc);
      }
      for (var k = 0; k < Object.keys(description.components).length; k++) {  //Components loop
          var current_component = currentEntity.addComponent(Object.keys(description.components)[k]);
          desc.push(Object.keys(description.components)[k]);
          obj.push(current_component);
      }
  }

  // ## Fonction *findObject*
  // La fonction *findObject* retourne l'objet de la scène
  // portant le nom spécifié.
  findObject(objectName: string): IEntity {
      return this._object.get(objectName) as IEntity;
  }

  // ## Méthode *walk*
  // Cette méthode parcourt l'ensemble des entités de la
  // scène et appelle la fonction `fn` pour chacun, afin
  // d'implémenter le patron de conception [visiteur](https://fr.wikipedia.org/wiki/Visiteur_(patron_de_conception)).
  walk(fn: ISceneWalker): Promise<any> {
      return new Promise((resolve => {
          this._object.forEach((value: IEntity, key: string) => {
              resolve(fn(value, key));
          });
      }));
  }
}
