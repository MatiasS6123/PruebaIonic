import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './Component/registro/registro.component';
import { LoginComponent } from './Component/login/login.component';
import { ListaEstudianteComponent } from './Component/lista-estudiante/lista-estudiante.component';
import { AuthGuard } from './guard/auth';
import { GestionUsuarioComponent } from './Component/gestion-usuario/gestion-usuario.component';
import { ListEstudentComponent } from './Component/list-estudent/list-estudent.component';
import { ListaUsuarioComponent } from './Component/lista-usuario/lista-usuario.component';
import { BuscarCursoComponent } from './Component/buscar-curso/buscar-curso.component';
import { BitacoraComponent } from './Component/bitacora/bitacora.component';
import { GestionNotaComponent } from './Component/gestion-nota/gestion-nota.component';
import { ListaCursoComponent } from './Component/lista-curso/lista-curso.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },   
  {
    path: 'estudiantes',
    loadChildren: () => import('./Page/estudiantes/estudiantes.module').then( m => m.EstudiantesPageModule),
    canActivate:[AuthGuard]
  },
  {path: 'busqueda-estudiante',component:ListaEstudianteComponent,
  canActivate:[AuthGuard]},
  {
    path: 'salida-estudiante',
    loadChildren: () => import('./Page/salida-estudiante/salida-estudiante.module').then( m => m.SalidaEstudiantePageModule),
    canActivate:[AuthGuard]

  },
  {
    path: 'asistencia',
    loadChildren: () => import('./Page/asistencia/asistencia.module').then( m => m.AsistenciaPageModule),
    canActivate:[AuthGuard]
  },
  {
    path:'gestion-usuario',
    component:GestionUsuarioComponent,
    canActivate:[AuthGuard  ]
  },
  {
    path:'lista-estudiante',
    component:ListEstudentComponent
  },
  {
    path:'lista-usuario',
    component:ListaUsuarioComponent
  },
  {
    path: 'gestion-curso',
    loadChildren: () => import('./Page/gestion-curso/gestion-curso.module').then( m => m.GestionCursoPageModule)
  },
  {
    path:'buscar-curso',
    component:BuscarCursoComponent
  },
  {
    path:'bitacora',
    component:BitacoraComponent

  },
  {
    path: 'nota',
    loadChildren: () => import('./Page/nota/nota.module').then( m => m.NotaPageModule)
  },
  {
    path:'gestion-nota',
    component:GestionNotaComponent
  },
  {
    path:'lista-curso',
    component:ListaCursoComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
