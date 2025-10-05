/*==============================================================*/
/* DBMS name:      Sybase SQL Anywhere 12                       */
/* Created on:     4/10/2025 16:32:12                           */
/*==============================================================*/


if exists(select 1 from sys.sysforeignkey where role='FK_INDICADO_PRESENTA_EJES') then
    alter table INDICADORES
       delete foreign key FK_INDICADO_PRESENTA_EJES
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_REPORTEP_GENERA_USUARIO') then
    alter table REPORTEPROYECTO
       delete foreign key FK_REPORTEP_GENERA_USUARIO
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TIENE_TIENE_REPORTEP') then
    alter table TIENE
       delete foreign key FK_TIENE_TIENE_REPORTEP
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TIENE_TIENE2_EJES') then
    alter table TIENE
       delete foreign key FK_TIENE_TIENE2_EJES
end if;

drop index if exists EJES.EJES_PK;

drop table if exists EJES;

drop index if exists INDICADORES.PRESENTA_FK;

drop index if exists INDICADORES.INDICADORES_PK;

drop table if exists INDICADORES;

drop index if exists REPORTEPROYECTO.GENERA_FK;

drop index if exists REPORTEPROYECTO.REPORTEPROYECTO_PK;

drop table if exists REPORTEPROYECTO;

drop index if exists TIENE.TIENE_FK;

drop index if exists TIENE.TIENE2_FK;

drop index if exists TIENE.TIENE_PK;

drop table if exists TIENE;

drop index if exists USUARIO.USUARIO_PK;

drop table if exists USUARIO;

/*==============================================================*/
/* Table: EJES                                                  */
/*==============================================================*/
create table EJES 
(
   EJES_ID              integer                        not null,
   EJES_NOMBRE          varchar(124)                   not null,
   EJES_DESCRIPCION     varchar(124)                   not null,
   constraint PK_EJES primary key (EJES_ID)
);

/*==============================================================*/
/* Index: EJES_PK                                               */
/*==============================================================*/
create unique index EJES_PK on EJES (
EJES_ID ASC
);

/*==============================================================*/
/* Table: INDICADORES                                           */
/*==============================================================*/
create table INDICADORES 
(
   INDICADORES_ID       integer                        not null,
   EJES_ID              integer                        not null,
   INDICADORES_NOMBRE   varchar(124)                   not null,
   INDICADORES_DESCRIPCION varchar(124)                   not null,
   INDICADORES_VALOR    varchar(124)                   not null,
   constraint PK_INDICADORES primary key (INDICADORES_ID)
);

/*==============================================================*/
/* Index: INDICADORES_PK                                        */
/*==============================================================*/
create unique index INDICADORES_PK on INDICADORES (
INDICADORES_ID ASC
);

/*==============================================================*/
/* Index: PRESENTA_FK                                           */
/*==============================================================*/
create index PRESENTA_FK on INDICADORES (
EJES_ID ASC
);

/*==============================================================*/
/* Table: REPORTEPROYECTO                                       */
/*==============================================================*/
create table REPORTEPROYECTO 
(
   REPORTEPROYECTO_ID   integer                        not null,
   USUARIO_ID           integer                        not null,
   REPORTEPROYECTO_NOMBRE varchar(124)                   not null,
   REPORTEPROYECTO_FECHAINICIO date                           not null,
   REPORTEPROYECTO_FECHAFIN date                           not null,
   REPORTEPROYECTO_PERIODOSUBIRREPORTES varchar(124)                   not null,
   REPORTEPROYECTO_ACCIONESDESTACADAS varchar(124)                   not null,
   REPORTEPROYECTO_PRIMERHITO varchar(124)                   not null,
   REPORTEPROYECTO_SEGUNDOHITO varchar(124)                   not null,
   REPORTEPROYECTO_TERCERHITO varchar(124)                   not null,
   REPORTEPROYECTO_NOMBREHITO varchar(124)                   not null,
   REPORTEPROYECTO_LUGAR varchar(128)                   not null,
   REPORTEPROYECTO_DESCRIPCION varchar(128)                   not null,
   REPORTEPROYECTO_INDICADORLARGOPLAZO varchar(128)                   not null,
   REPORTEPROYECTO_MATERIALAUDIOVISUAL varchar(128)                   not null,
   REPORTEPROYECTO_INDICADORPREVENCION varchar(128)                   not null,
   REPORTEPROYECTO_ESTADO varchar(128)                   not null,
   constraint PK_REPORTEPROYECTO primary key (REPORTEPROYECTO_ID)
);

/*==============================================================*/
/* Index: REPORTEPROYECTO_PK                                    */
/*==============================================================*/
create unique index REPORTEPROYECTO_PK on REPORTEPROYECTO (
REPORTEPROYECTO_ID ASC
);

/*==============================================================*/
/* Index: GENERA_FK                                             */
/*==============================================================*/
create index GENERA_FK on REPORTEPROYECTO (
USUARIO_ID ASC
);

/*==============================================================*/
/* Table: TIENE                                                 */
/*==============================================================*/
create table TIENE 
(
   REPORTEPROYECTO_ID   integer                        not null,
   EJES_ID              integer                        not null,
   constraint PK_TIENE primary key (REPORTEPROYECTO_ID, EJES_ID)
);

/*==============================================================*/
/* Index: TIENE_PK                                              */
/*==============================================================*/
create unique index TIENE_PK on TIENE (
REPORTEPROYECTO_ID ASC,
EJES_ID ASC
);

/*==============================================================*/
/* Index: TIENE2_FK                                             */
/*==============================================================*/
create index TIENE2_FK on TIENE (
EJES_ID ASC
);

/*==============================================================*/
/* Index: TIENE_FK                                              */
/*==============================================================*/
create index TIENE_FK on TIENE (
REPORTEPROYECTO_ID ASC
);

/*==============================================================*/
/* Table: USUARIO                                               */
/*==============================================================*/
-- create_usuario_postgres.sql (Corregido)
CREATE TABLE IF NOT EXISTS usuario (
  usuario_id SERIAL PRIMARY KEY,
  usuario_nombreong VARCHAR(124) NOT NULL,
  usuario_user VARCHAR(124) NOT NULL UNIQUE,
  usuario_contrasena VARCHAR(256) NOT NULL,
  usuario_role VARCHAR(32) NOT NULL DEFAULT 'ong',
  usuario_descripcion VARCHAR(124) NOT NULL -- Corregido
);

/*==============================================================*/
/* Index: USUARIO_PK                                            */
/*==============================================================*/
create unique index USUARIO_PK on USUARIO (
USUARIO_ID ASC
);

alter table INDICADORES
   add constraint FK_INDICADO_PRESENTA_EJES foreign key (EJES_ID)
      references EJES (EJES_ID)
      on update restrict
      on delete restrict;

alter table REPORTEPROYECTO
   add constraint FK_REPORTEP_GENERA_USUARIO foreign key (USUARIO_ID)
      references USUARIO (USUARIO_ID)
      on update restrict
      on delete restrict;

alter table TIENE
   add constraint FK_TIENE_TIENE_REPORTEP foreign key (REPORTEPROYECTO_ID)
      references REPORTEPROYECTO (REPORTEPROYECTO_ID)
      on update restrict
      on delete restrict;

alter table TIENE
   add constraint FK_TIENE_TIENE2_EJES foreign key (EJES_ID)
      references EJES (EJES_ID)
      on update restrict
      on delete restrict;

/*==============================================================*/
/* Templates and Responses (for admin-defined formats)          */
/*==============================================================*/

/* Table: PLANTILLA_REPORTE (report template defined by admin) */
create table PLANTILLA_REPORTE
(
   PLANTILLA_ID         integer                        not null,
   USUARIO_ID           integer                        not null,
   PLANTILLA_NOMBRE     varchar(124)                   not null,
   PLANTILLA_FECHAINICIO date                           not null,
   PLANTILLA_FECHAFIN   date                           not null,
   PLANTILLA_PERIODOSUBIRREPORTES varchar(124)           not null,
   PLANTILLA_DESCRIPCION varchar(256)                   not null,
   constraint PK_PLANTILLA primary key (PLANTILLA_ID)
);

create unique index PLANTILLA_REPORTE_PK on PLANTILLA_REPORTE (
PLANTILLA_ID ASC
);

create index PLANTILLA_GENERA_FK on PLANTILLA_REPORTE (
USUARIO_ID ASC
);

/* Table: PLANTILLA_TIENE (which EJES apply to a template) */
create table PLANTILLA_TIENE
(
  PLANTILLA_ID         integer                        not null,
  EJES_ID              integer                        not null,
  constraint PK_PLANTILLA_TIENE primary key (PLANTILLA_ID, EJES_ID)
);

create unique index PLANTILLA_TIENE_PK on PLANTILLA_TIENE (
PLANTILLA_ID ASC,
EJES_ID ASC
);

create index PLANTILLA_TIENE_EJES_FK on PLANTILLA_TIENE (
EJES_ID ASC
);

/* Table: PLANTILLA_INDICADORES (which indicators from each eje appear in the template) */
create table PLANTILLA_INDICADORES
(
  PLANTILLA_ID         integer                        not null,
  EJES_ID              integer                        not null,
  INDICADORES_ID       integer                        not null,
  constraint PK_PLANTILLA_INDIC primary key (PLANTILLA_ID, INDICADORES_ID)
);

create unique index PLANTILLA_INDICADORES_PK on PLANTILLA_INDICADORES (
PLANTILLA_ID ASC,
INDICADORES_ID ASC
);

/* Table: REPORTE_RESPUESTAS (responses submitted by ONG when filling a report) */
create table REPORTE_RESPUESTAS
(
  RESPUESTA_ID         integer                        not null,
  REPORTEPROYECTO_ID   integer                        not null,
  USUARIO_ID           integer                        not null,
  EJES_ID              integer                        not null,
  INDICADORES_ID       integer                        not null,
  RESPUESTA_VALOR      varchar(512)                   not null,
  RESPUESTA_FECHA      timestamp                      not null,
  constraint PK_REPORTE_RESP primary key (RESPUESTA_ID)
);

create unique index REPORTE_RESPUESTAS_PK on REPORTE_RESPUESTAS (
RESPUESTA_ID ASC
);

/* Foreign keys for new tables */
alter table PLANTILLA_REPORTE
   add constraint FK_PLANTILLA_GENERA_USUARIO foreign key (USUARIO_ID)
      references USUARIO (USUARIO_ID)
      on update restrict
      on delete restrict;

alter table PLANTILLA_TIENE
   add constraint FK_PLANTILLA_TIENE_EJES foreign key (EJES_ID)
      references EJES (EJES_ID)
      on update restrict
      on delete restrict;

alter table PLANTILLA_TIENE
   add constraint FK_PLANTILLA_TIENE_PLANTILLA foreign key (PLANTILLA_ID)
      references PLANTILLA_REPORTE (PLANTILLA_ID)
      on update restrict
      on delete restrict;

alter table PLANTILLA_INDICADORES
   add constraint FK_PLANTILLA_INDIC_EJES foreign key (EJES_ID)
      references EJES (EJES_ID)
      on update restrict
      on delete restrict;

alter table PLANTILLA_INDICADORES
   add constraint FK_PLANTILLA_INDIC_INDIC foreign key (INDICADORES_ID)
      references INDICADORES (INDICADORES_ID)
      on update restrict
      on delete restrict;

alter table PLANTILLA_INDICADORES
   add constraint FK_PLANTILLA_INDIC_PLANTILLA foreign key (PLANTILLA_ID)
      references PLANTILLA_REPORTE (PLANTILLA_ID)
      on update restrict
      on delete restrict;

alter table REPORTE_RESPUESTAS
   add constraint FK_RESPUESTA_REPORTE foreign key (REPORTEPROYECTO_ID)
      references REPORTEPROYECTO (REPORTEPROYECTO_ID)
      on update restrict
      on delete restrict;

alter table REPORTE_RESPUESTAS
   add constraint FK_RESPUESTA_USUARIO foreign key (USUARIO_ID)
      references USUARIO (USUARIO_ID)
      on update restrict
      on delete restrict;

alter table REPORTE_RESPUESTAS
   add constraint FK_RESPUESTA_EJES foreign key (EJES_ID)
      references EJES (EJES_ID)
      on update restrict
      on delete restrict;

alter table REPORTE_RESPUESTAS
   add constraint FK_RESPUESTA_INDICADORES foreign key (INDICADORES_ID)
      references INDICADORES (INDICADORES_ID)
      on update restrict
      on delete restrict;

/* Table: REPORTE_INDICADORES (indicators copied into an instantiated report) */
create table REPORTE_INDICADORES
(
  REPORTEPROYECTO_ID   integer                        not null,
  EJES_ID              integer                        not null,
  INDICADORES_ID       integer                        not null,
  constraint PK_REPORTE_IND primary key (REPORTEPROYECTO_ID, INDICADORES_ID)
);

create unique index REPORTE_INDICADORES_PK on REPORTE_INDICADORES (
REPORTEPROYECTO_ID ASC,
INDICADORES_ID ASC
);

alter table REPORTE_INDICADORES
   add constraint FK_REPORTE_IND_EJES foreign key (EJES_ID)
      references EJES (EJES_ID)
      on update restrict
      on delete restrict;

alter table REPORTE_INDICADORES
   add constraint FK_REPORTE_IND_INDIC foreign key (INDICADORES_ID)
      references INDICADORES (INDICADORES_ID)
      on update restrict
      on delete restrict;

alter table REPORTE_INDICADORES
   add constraint FK_REPORTE_IND_REPORTE foreign key (REPORTEPROYECTO_ID)
      references REPORTEPROYECTO (REPORTEPROYECTO_ID)
      on update restrict
      on delete restrict;


ALTER TABLE REPORTEPROYECTO
ADD COLUMN REPORTEPROYECTO_FECHAAPROBACION TIMESTAMP WITH TIME ZONE,
ADD COLUMN REPORTEPROYECTO_APROBADOPOR INTEGER REFERENCES USUARIO(USUARIO_ID);