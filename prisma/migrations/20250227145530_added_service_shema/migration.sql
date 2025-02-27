BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Service] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [shortDescription] TEXT NOT NULL,
    [tagline] TEXT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Service_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Service_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ServicePoint] (
    [id] NVARCHAR(1000) NOT NULL,
    [text] TEXT NOT NULL,
    [serviceId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ServicePoint_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Service_createdAt_idx] ON [dbo].[Service]([createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ServicePoint_serviceId_idx] ON [dbo].[ServicePoint]([serviceId]);

-- AddForeignKey
ALTER TABLE [dbo].[ServicePoint] ADD CONSTRAINT [ServicePoint_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[Service]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
