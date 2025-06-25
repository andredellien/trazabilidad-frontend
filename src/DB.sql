CREATE TABLE [dbo].[Almacenaje] (
    [IdAlmacenaje]    INT           IDENTITY (1, 1) NOT NULL,
    [IdLote]          INT           NOT NULL,
    [Ubicacion]       VARCHAR (100) NOT NULL,
    [Condicion]       VARCHAR (100) NOT NULL,
    [FechaAlmacenaje] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([IdAlmacenaje] ASC),
    FOREIGN KEY ([IdLote]) REFERENCES [dbo].[Lote] ([IdLote])
);

CREATE TABLE [dbo].[Lote] (
    [IdLote]        INT           IDENTITY (1, 1) NOT NULL,
    [FechaCreacion] DATE          NOT NULL,
    [Estado]        VARCHAR (50)  NULL,
    [Nombre]        VARCHAR (100) DEFAULT ('Lote sin nombre') NOT NULL,
    [IdProceso]     INT           NULL,
    [IdPedido]      INT           NULL,
    PRIMARY KEY CLUSTERED ([IdLote] ASC),
    FOREIGN KEY ([IdProceso]) REFERENCES [dbo].[Proceso] ([IdProceso]),
    CONSTRAINT [FK_Lote_Pedido] FOREIGN KEY ([IdPedido]) REFERENCES [dbo].[Pedido] ([IdPedido])
);


GO
CREATE NONCLUSTERED INDEX [IX_Lote_Estado]
    ON [dbo].[Lote]([Estado] ASC);



CREATE TABLE [dbo].[LoteMateriaPrimaBase] (
    [IdLoteMateriaPrimaBase] INT             IDENTITY (1, 1) NOT NULL,
    [IdLote]                 INT             NOT NULL,
    [IdMateriaPrimaBase]     INT             NOT NULL,
    [Cantidad]               DECIMAL (10, 2) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdLoteMateriaPrimaBase] ASC),
    FOREIGN KEY ([IdLote]) REFERENCES [dbo].[Lote] ([IdLote]) ON DELETE CASCADE,
    FOREIGN KEY ([IdMateriaPrimaBase]) REFERENCES [dbo].[MateriaPrimaBase] ([IdMateriaPrimaBase]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[LoteMateriaPrima] (
    [IdLote]         INT             NOT NULL,
    [IdMateriaPrima] INT             NOT NULL,
    [Cantidad]       DECIMAL (10, 2) DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdLote] ASC, [IdMateriaPrima] ASC),
    CONSTRAINT [FK_LMP_Lote] FOREIGN KEY ([IdLote]) REFERENCES [dbo].[Lote] ([IdLote]) ON DELETE CASCADE,
    CONSTRAINT [FK_LMP_Materia] FOREIGN KEY ([IdMateriaPrima]) REFERENCES [dbo].[MateriaPrima] ([IdMateriaPrima]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[Maquina] (
    [IdMaquina] INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]    VARCHAR (100) NOT NULL,
    [ImagenUrl] VARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([IdMaquina] ASC)
);

CREATE TABLE [dbo].[MaquinaVariable] (
    [IdVariable] INT             IDENTITY (1, 1) NOT NULL,
    [IdMaquina]  INT             NULL,
    [Nombre]     VARCHAR (100)   NULL,
    [ValorMin]   DECIMAL (10, 2) NULL,
    [ValorMax]   DECIMAL (10, 2) NULL,
    PRIMARY KEY CLUSTERED ([IdVariable] ASC)
);

CREATE TABLE [dbo].[MateriaPrima] (
    [IdMateriaPrima]     INT             IDENTITY (1, 1) NOT NULL,
    [Nombre]             VARCHAR (100)   NOT NULL,
    [FechaRecepcion]     DATE            NOT NULL,
    [Proveedor]          VARCHAR (100)   NULL,
    [Cantidad]           DECIMAL (10, 2) NULL,
    [Estado]             VARCHAR (50)    DEFAULT ('solicitado') NULL,
    [Unidad]             VARCHAR (10)    NULL,
    [RecepcionConforme]  BIT             NULL,
    [FirmaRecepcion]     VARCHAR (MAX)   NULL,
    [IdProveedor]        INT             NULL,
    [IdPedido]           INT             NULL,
    [IdMateriaPrimaBase] INT             NULL,
    PRIMARY KEY CLUSTERED ([IdMateriaPrima] ASC),
    FOREIGN KEY ([IdPedido]) REFERENCES [dbo].[Pedido] ([IdPedido]),
    FOREIGN KEY ([IdProveedor]) REFERENCES [dbo].[Proveedor] ([IdProveedor]),
    CONSTRAINT [FK_MateriaPrima_MateriaPrimaBase] FOREIGN KEY ([IdMateriaPrimaBase]) REFERENCES [dbo].[MateriaPrimaBase] ([IdMateriaPrimaBase])
);

GO
CREATE NONCLUSTERED INDEX [IX_MateriaPrima_Estado]
    ON [dbo].[MateriaPrima]([Estado] ASC);


CREATE TABLE [dbo].[Operador] (
    [IdOperador]   INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]       VARCHAR (100) NOT NULL,
    [Cargo]        VARCHAR (50)  NULL,
    [Usuario]      VARCHAR (60)  NOT NULL,
    [PasswordHash] VARCHAR (255) NOT NULL,
    [Email]        VARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([IdOperador] ASC),
    UNIQUE NONCLUSTERED ([Usuario] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_Operador_Cargo]
    ON [dbo].[Operador]([Cargo] ASC);


CREATE TABLE [dbo].[OperadorMaquina] (
    [IdOperador] INT NOT NULL,
    [IdMaquina]  INT NOT NULL,
    PRIMARY KEY CLUSTERED ([IdOperador] ASC, [IdMaquina] ASC),
    FOREIGN KEY ([IdMaquina]) REFERENCES [dbo].[Maquina] ([IdMaquina]) ON DELETE CASCADE,
    FOREIGN KEY ([IdOperador]) REFERENCES [dbo].[Operador] ([IdOperador]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[Pedido] (
    [IdPedido]      INT            IDENTITY (1, 1) NOT NULL,
    [IdCliente]     INT            NOT NULL,
    [FechaCreacion] DATETIME       DEFAULT (getdate()) NULL,
    [Estado]        VARCHAR (50)   DEFAULT ('pendiente') NULL,
    [Observaciones] NVARCHAR (MAX) NULL,
    [Descripcion]   NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([IdPedido] ASC),
    FOREIGN KEY ([IdCliente]) REFERENCES [dbo].[Operador] ([IdOperador])
);


GO
CREATE NONCLUSTERED INDEX [IX_Pedido_Estado]
    ON [dbo].[Pedido]([Estado] ASC);


CREATE TABLE [dbo].[Proceso] (
    [IdProceso] INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]    VARCHAR (100) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdProceso] ASC)
);

CREATE TABLE [dbo].[ProcesoEvaluacionFinal] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [IdLote]          INT            NOT NULL,
    [EstadoFinal]     VARCHAR (50)   NOT NULL,
    [Motivo]          NVARCHAR (255) NULL,
    [FechaEvaluacion] DATETIME       DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([IdLote]) REFERENCES [dbo].[Lote] ([IdLote])
);

CREATE TABLE [dbo].[ProcesoMaquina] (
    [IdProcesoMaquina] INT           IDENTITY (1, 1) NOT NULL,
    [IdProceso]        INT           NOT NULL,
    [IdMaquina]        INT           NOT NULL,
    [Numero]           INT           NOT NULL,
    [Nombre]           VARCHAR (100) NOT NULL,
    [Imagen]           VARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([IdProcesoMaquina] ASC),
    FOREIGN KEY ([IdMaquina]) REFERENCES [dbo].[Maquina] ([IdMaquina]),
    FOREIGN KEY ([IdProceso]) REFERENCES [dbo].[Proceso] ([IdProceso])
);

CREATE TABLE [dbo].[ProcesoMaquinaRegistro] (
    [Id]                  INT            IDENTITY (1, 1) NOT NULL,
    [IdLote]              INT            NOT NULL,
    [NumeroMaquina]       INT            NOT NULL,
    [NombreMaquina]       VARCHAR (100)  NOT NULL,
    [VariablesIngresadas] NVARCHAR (MAX) NOT NULL,
    [CumpleEstandar]      BIT            NOT NULL,
    [FechaRegistro]       DATETIME       DEFAULT (getdate()) NULL,
    [IdProcesoMaquina]    INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([IdLote]) REFERENCES [dbo].[Lote] ([IdLote]),
    CONSTRAINT [FK_PMR_ProcesoMaquina] FOREIGN KEY ([IdProcesoMaquina]) REFERENCES [dbo].[ProcesoMaquina] ([IdProcesoMaquina])
);

CREATE TABLE [dbo].[ProcesoMaquinaVariable] (
    [IdVariable]       INT             IDENTITY (1, 1) NOT NULL,
    [IdProcesoMaquina] INT             NOT NULL,
    [Nombre]           VARCHAR (100)   NOT NULL,
    [ValorMin]         DECIMAL (10, 2) NOT NULL,
    [ValorMax]         DECIMAL (10, 2) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdVariable] ASC),
    FOREIGN KEY ([IdProcesoMaquina]) REFERENCES [dbo].[ProcesoMaquina] ([IdProcesoMaquina])
);

CREATE TABLE [dbo].[Proveedor] (
    [IdProveedor]   INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]        VARCHAR (100) NOT NULL,
    [Contacto]      VARCHAR (100) NULL,
    [Telefono]      VARCHAR (20)  NULL,
    [Email]         VARCHAR (100) NULL,
    [Direccion]     VARCHAR (255) NULL,
    [FechaCreacion] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([IdProveedor] ASC)
);

-- === BLOQUE 9: Migración para nueva gestión de Materia Prima ===

-- 1. Crear tabla MateriaPrimaBase
CREATE TABLE [dbo].[MateriaPrimaBase] (
    [IdMateriaPrimaBase] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Nombre] VARCHAR(100) NOT NULL,
    [Unidad] VARCHAR(10) NOT NULL,
    [Cantidad] DECIMAL(10,2) NOT NULL DEFAULT(0)
);

-- 2. Crear tabla LogMateriaPrima
CREATE TABLE [dbo].[LogMateriaPrima] (
    [IdLog] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [IdMateriaPrimaBase] INT NOT NULL,
    [Fecha] DATETIME NOT NULL DEFAULT(getdate()),
    [TipoMovimiento] VARCHAR(20) NOT NULL, -- 'adicion' o 'sustraccion'
    [Cantidad] DECIMAL(10,2) NOT NULL,
    [Descripcion] NVARCHAR(255) NULL,
    FOREIGN KEY ([IdMateriaPrimaBase]) REFERENCES [dbo].[MateriaPrimaBase]([IdMateriaPrimaBase])
);

-- === FIN BLOQUE 9 ===

