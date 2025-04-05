BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[YouTubeVideo] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] TEXT,
    [youtubeUrl] NVARCHAR(1000) NOT NULL,
    [thumbnailUrl] NVARCHAR(1000) NOT NULL,
    [views] INT,
    [duration] NVARCHAR(1000),
    [publishedAt] DATETIME2,
    [featured] BIT NOT NULL CONSTRAINT [YouTubeVideo_featured_df] DEFAULT 0,
    [order] INT NOT NULL CONSTRAINT [YouTubeVideo_order_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [YouTubeVideo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [YouTubeVideo_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
