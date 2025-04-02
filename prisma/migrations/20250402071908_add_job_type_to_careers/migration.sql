/*
  Warnings:

  - Added the required column `jobType` to the `Careers` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Careers] ALTER COLUMN [shortdescription] TEXT NULL;
ALTER TABLE [dbo].[Careers] ADD CONSTRAINT [Careers_positionCount_df] DEFAULT 1 FOR [positionCount];
ALTER TABLE [dbo].[Careers] ADD [jobType] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
