CREATE TABLE [dbo].[Lote] (
    [IdLote]        INT           IDENTITY (1, 1) NOT NULL,
    [FechaCreacion] DATE          NOT NULL,
    [Estado]        VARCHAR (50)  NULL,
    [Nombre]        VARCHAR (100) DEFAULT ('Lote sin nombre') NOT NULL,
    [IdProceso]     INT           NULL,
    PRIMARY KEY CLUSTERED ([IdLote] ASC),
    FOREIGN KEY ([IdProceso]) REFERENCES [dbo].[Proceso] ([IdProceso])
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
    [IdMateriaPrima] INT             IDENTITY (1, 1) NOT NULL,
    [Nombre]         VARCHAR (100)   NOT NULL,
    [FechaRecepcion] DATE            NOT NULL,
    [Proveedor]      VARCHAR (100)   NULL,
    [Cantidad]       DECIMAL (10, 2) NULL,
    PRIMARY KEY CLUSTERED ([IdMateriaPrima] ASC)
);

CREATE TABLE [dbo].[Operador] (
    [IdOperador]   INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]       VARCHAR (100) NOT NULL,
    [Cargo]        VARCHAR (50)  NULL,
    [Usuario]      VARCHAR (60)  NOT NULL,
    [PasswordHash] VARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdOperador] ASC),
    UNIQUE NONCLUSTERED ([Usuario] ASC)
);

CREATE TABLE [dbo].[OperadorMaquina] (
    [IdOperador] INT NOT NULL,
    [IdMaquina]  INT NOT NULL,
    PRIMARY KEY CLUSTERED ([IdOperador] ASC, [IdMaquina] ASC),
    FOREIGN KEY ([IdMaquina]) REFERENCES [dbo].[Maquina] ([IdMaquina]) ON DELETE CASCADE,
    FOREIGN KEY ([IdOperador]) REFERENCES [dbo].[Operador] ([IdOperador]) ON DELETE CASCADE
);

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


-- Cambios

-- 1. Crear tabla de Proveedores
CREATE TABLE [dbo].[Proveedor] (
    [IdProveedor] INT IDENTITY(1,1) NOT NULL,
    [Nombre] VARCHAR(100) NOT NULL,
    [Contacto] VARCHAR(100) NULL,
    [Telefono] VARCHAR(20) NULL,
    [Email] VARCHAR(100) NULL,
    [Direccion] VARCHAR(255) NULL,
    [FechaCreacion] DATETIME DEFAULT GETDATE(),
    PRIMARY KEY CLUSTERED ([IdProveedor] ASC)
);

-- 2. Modificar tabla Operador (solo agregar Email)
ALTER TABLE [dbo].[Operador]
ADD [Email] VARCHAR(100) NULL;

-- 3. Crear tabla de Pedidos
CREATE TABLE [dbo].[Pedido] (
    [IdPedido] INT IDENTITY(1,1) NOT NULL,
    [IdCliente] INT NOT NULL,
    [FechaCreacion] DATETIME DEFAULT GETDATE(),
    [Estado] VARCHAR(50) DEFAULT 'pendiente',
    [Observaciones] NVARCHAR(MAX) NULL,
    PRIMARY KEY CLUSTERED ([IdPedido] ASC),
    FOREIGN KEY ([IdCliente]) REFERENCES [dbo].[Operador] ([IdOperador])
);

-- 4. Modificar tabla MateriaPrima
ALTER TABLE [dbo].[MateriaPrima]
ADD [Estado] VARCHAR(50) DEFAULT 'solicitado',
    [Unidad] VARCHAR(10) NULL,
    [RecepcionConforme] BIT NULL,
    [FirmaRecepcion] VARCHAR(MAX) NULL,
    [IdProveedor] INT NULL,
    [IdPedido] INT NULL,
    FOREIGN KEY ([IdProveedor]) REFERENCES [dbo].[Proveedor] ([IdProveedor]),
    FOREIGN KEY ([IdPedido]) REFERENCES [dbo].[Pedido] ([IdPedido]);

-- 5. Crear tabla de Almacenaje
CREATE TABLE [dbo].[Almacenaje] (
    [IdAlmacenaje] INT IDENTITY(1,1) NOT NULL,
    [IdLote] INT NOT NULL,
    [Ubicacion] VARCHAR(100) NOT NULL,
    [Condicion] VARCHAR(100) NOT NULL,
    [FechaAlmacenaje] DATETIME DEFAULT GETDATE(),
    PRIMARY KEY CLUSTERED ([IdAlmacenaje] ASC),
    FOREIGN KEY ([IdLote]) REFERENCES [dbo].[Lote] ([IdLote])
);

-- 6. Modificar tabla Lote
ALTER TABLE [dbo].[Lote]
ADD [IdCliente] INT NULL,
    [EntregaConforme] BIT NULL,
    [FirmaEntrega] VARCHAR(MAX) NULL,
    FOREIGN KEY ([IdCliente]) REFERENCES [dbo].[Operador] ([IdOperador]);

-- 7. Crear índices para mejorar el rendimiento
CREATE INDEX IX_MateriaPrima_Estado ON [dbo].[MateriaPrima] ([Estado]);
CREATE INDEX IX_Lote_Estado ON [dbo].[Lote] ([Estado]);
CREATE INDEX IX_Pedido_Estado ON [dbo].[Pedido] ([Estado]);
CREATE INDEX IX_Operador_Cargo ON [dbo].[Operador] ([Cargo]);