import { Injectable } from '@angular/core';
import { env } from './env';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  get backendUrl() {
    let port = env.backend_port && env.backend_port!='80' ? env.backend_port : undefined;
    return `${env.backend_prot}://${env.backend_host}${ port ? `:${port}` : '' }/`;
  }

}