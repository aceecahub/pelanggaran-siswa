/*
  Warnings:

  - You are about to alter the column `id_jurusan` on the `kelas` table. The data in that column could be lost. The data in that column will be cast from `Int` to `VarChar(10)`.
  - The primary key for the `jurusans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_jurusan` on the `jurusans` table. The data in that column could be lost. The data in that column will be cast from `Int` to `String`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[kelas] DROP CONSTRAINT [kelas_id_jurusan_fkey];

-- AlterTable
ALTER TABLE [dbo].[kelas] ALTER COLUMN [id_jurusan] VARCHAR(10) NOT NULL;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'jurusans'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_jurusans] (
    [id_jurusan] VARCHAR(10) NOT NULL,
    [nama_jurusan] VARCHAR(25) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [jurusans_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [jurusans_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [jurusans_pkey] PRIMARY KEY CLUSTERED ([id_jurusan])
);
IF EXISTS(SELECT * FROM [dbo].[jurusans])
    EXEC('INSERT INTO [dbo].[_prisma_new_jurusans] ([created_at],[id_jurusan],[nama_jurusan],[status],[status_delete],[updated_at]) SELECT [created_at],[id_jurusan],[nama_jurusan],[status],[status_delete],[updated_at] FROM [dbo].[jurusans] WITH (holdlock tablockx)');
DROP TABLE [dbo].[jurusans];
EXEC SP_RENAME N'dbo._prisma_new_jurusans', N'jurusans';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[kelas] ADD CONSTRAINT [kelas_id_jurusan_fkey] FOREIGN KEY ([id_jurusan]) REFERENCES [dbo].[jurusans]([id_jurusan]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
