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
      const scene = new Scene(description);
      Scene.current = scene;
      var keys = Object.keys(description);
      //console.log(description);
      for (var i = 0; i < keys.length; i++) {
          var masterEntity: Entity;
          masterEntity = new Entity();
          this.current._object.set(keys[i], masterEntity);
          this.sceneFn(description[keys[i]], masterEntity);
      }
      return new Promise((resolve => { resolve(scene); })); 
  }

  private constructor(description: ISceneDesc) {
      this._description = description;
  }

  static sceneFn(description: IEntityDesc, currentEntity: IEntity) {
      console.log("Description :")
      console.log(description);
      for (var j = 0; j < Object.keys(description.children).length; j++) {  //Children loop
          //console.log(Object.keys(description[currentScene].children));
          var child: Entity;
          child = new Entity();
          var entitySuiv: IEntityDesc;
          /*console.log("-----Test-----");
          console.log(Object.keys(description.children)[j]);
          console.log(description.children[Object.keys(description.children)[j]]);
          console.log("-----Fin Test-----");*/
          entitySuiv = description.children[j];
          currentEntity.addChild(Object.keys(description.children)[j], child);
          console.log("Ajout de Child:");
          console.log(Object.keys(description.children)[j]);
          this.sceneFn(description.children[Object.keys(description.children)[j]], child);
      }
      for (var k = 0; k < Object.keys(description.components).length; k++) {  //Components loop
          console.log("Ajout de Component:");
          console.log(Object.keys(description.components)[k]);
          currentEntity.addComponent(Object.keys(description.components)[k]);
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
      return new Promise((resolve) => {
          this._object.forEach((value: IEntity, key: string) => {
              fn(value, key);
          });
      });
  }
}
