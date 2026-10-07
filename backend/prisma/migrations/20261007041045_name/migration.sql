/*
  Warnings:

  - You are about to alter the column `id_jurusan` on the `kelas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `id_tahun_ajaran` on the `pelanggaran_siswas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id_tahun_ajaran` on the `riwayat_kelas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `tahun_ajaran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_tahun_ajaran` on the `tahun_ajaran` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `jurusans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_jurusan` on the `jurusans` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[kelas] DROP CONSTRAINT [kelas_id_jurusan_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] DROP CONSTRAINT [pelanggaran_siswas_id_tahun_ajaran_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[riwayat_kelas] DROP CONSTRAINT [riwayat_kelas_id_tahun_ajaran_fkey];

-- AlterTable
ALTER TABLE [dbo].[kelas] ALTER COLUMN [id_jurusan] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pelanggaran_siswas] ALTER COLUMN [id_tahun_ajaran] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[riwayat_kelas] ALTER COLUMN [id_tahun_ajaran] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[tahun_ajaran] DROP CONSTRAINT [tahun_ajaran_pkey];
ALTER TABLE [dbo].[tahun_ajaran] ALTER COLUMN [id_tahun_ajaran] INT NOT NULL;
ALTER TABLE [dbo].[tahun_ajaran] ADD CONSTRAINT tahun_ajaran_pkey PRIMARY KEY CLUSTERED ([id_tahun_ajaran]);

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
    [id_jurusan] INT NOT NULL IDENTITY(1,1),
    [nama_jurusan] VARCHAR(25) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [jurusans_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [jurusans_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [jurusans_pkey] PRIMARY KEY CLUSTERED ([id_jurusan])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_jurusans] ON;
IF EXISTS(SELECT * FROM [dbo].[jurusans])
    EXEC('INSERT INTO [dbo].[_prisma_new_jurusans] ([created_at],[id_jurusan],[nama_jurusan],[status],[status_delete],[updated_at]) SELECT [created_at],[id_jurusan],[nama_jurusan],[status],[status_delete],[updated_at] FROM [dbo].[jurusans] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_jurusans] OFF;
DROP TABLE [dbo].[jurusans];
EXEC SP_RENAME N'dbo._prisma_new_jurusans', N'jurusans';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] ADD CONSTRAINT [pelanggaran_siswas_id_tahun_ajaran_fkey] FOREIGN KEY ([id_tahun_ajaran]) REFERENCES [dbo].[tahun_ajaran]([id_tahun_ajaran]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[riwayat_kelas] ADD CONSTRAINT [riwayat_kelas_id_tahun_ajaran_fkey] FOREIGN KEY ([id_tahun_ajaran]) REFERENCES [dbo].[tahun_ajaran]([id_tahun_ajaran]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
