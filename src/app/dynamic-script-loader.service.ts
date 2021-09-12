// src\app\services\dynamic-script-loader.service.ts
import {Injectable} from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  {name: 'square-sandbox', src: 'https://sandbox.web.squarecdn.com/v1/square.js'},
  {name: 'square', src: 'https://web.squarecdn.com/v1/square.js'}
];

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  loadScripts(...scripts: string[]): Promise<any> {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        // @ts-ignore
        if (script.readyState) {  // IE
          // @ts-ignore
          script.onreadystatechange = () => {
            // @ts-ignore
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              // @ts-ignore
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({script: name, loaded: true, status: 'Loaded'});
            }
          };
        } else {  // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({script: name, loaded: true, status: 'Loaded'});
          };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script); // <--- !!!
      } else {
        console.warn('Already Loaded...')
        resolve({script: name, loaded: true, status: 'Already Loaded'});
      }
    });
  }

  isAlreadyLoaded(name: string): boolean {
    return this.scripts[name]?.loaded;
  }
}
