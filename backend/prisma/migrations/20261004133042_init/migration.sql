BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id_user] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(255) NOT NULL,
    [password] VARCHAR(225) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [users_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id_user])
);

-- CreateTable
CREATE TABLE [dbo].[sampah] (
    [id_sampah] INT NOT NULL IDENTITY(1,1),
    [id_user] INT NOT NULL,
    [nama_tabel] VARCHAR(255) NOT NULL,
    [record_id] INT NOT NULL,
    [delete_data] NVARCHAR(max) NOT NULL,
    [aksi] NVARCHAR(1000) NOT NULL,
    [delete_at] DATETIME2 NOT NULL CONSTRAINT [sampah_delete_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [sampah_pkey] PRIMARY KEY CLUSTERED ([id_sampah])
);

-- CreateTable
CREATE TABLE [dbo].[activity_log] (
    [id_activity_log] INT NOT NULL IDENTITY(1,1),
    [id_user] INT NOT NULL,
    [aksi] VARCHAR(255) NOT NULL,
    [nama_tabel] VARCHAR(255) NOT NULL,
    [record_id] INT NOT NULL,
    [deskripsi] VARCHAR(255) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [activity_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [activity_log_pkey] PRIMARY KEY CLUSTERED ([id_activity_log])
);

-- CreateTable
CREATE TABLE [dbo].[siswas] (
    [nis] INT NOT NULL,
    [nama_siswa] VARCHAR(25) NOT NULL,
    [tgl_lahir] DATE NOT NULL,
    [tempat_lahir] VARCHAR(20) NOT NULL,
    [jk] NVARCHAR(1000) NOT NULL,
    [alamat] NVARCHAR(max) NOT NULL,
    [status_aktif] NVARCHAR(1000) NOT NULL,
    [status_hapus] INT NOT NULL CONSTRAINT [siswas_status_hapus_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [siswas_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [siswas_pkey] PRIMARY KEY CLUSTERED ([nis])
);

-- CreateTable
CREATE TABLE [dbo].[pelanggaran_siswas] (
    [id_pelanggaran_siswa] INT NOT NULL IDENTITY(1,1),
    [tgl] DATE NOT NULL,
    [id_tahun_ajaran] BIGINT NOT NULL,
    [id_user] INT NOT NULL,
    [nama_pelapor] VARCHAR(255) NOT NULL,
    [nis] INT NOT NULL,
    [nama_siswa] VARCHAR(255) NOT NULL,
    [id_kelas] VARCHAR(10) NOT NULL,
    [nama_kelas] VARCHAR(255) NOT NULL,
    [id_kategori_pelanggaran] INT NOT NULL,
    [id_pelanggaran] INT NOT NULL,
    [nama_pelanggaran] VARCHAR(255) NOT NULL,
    [point] INT NOT NULL,
    [catatan] VARCHAR(255) NOT NULL,
    [sanksi] VARCHAR(255) NOT NULL,
    [status_sanksi] NVARCHAR(1000) NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [pelanggaran_siswas_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [pelanggaran_siswas_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [pelanggaran_siswas_pkey] PRIMARY KEY CLUSTERED ([id_pelanggaran_siswa])
);

-- CreateTable
CREATE TABLE [dbo].[riwayat_kelas] (
    [id_riwayat_kelas] INT NOT NULL IDENTITY(1,1),
    [id_tahun_ajaran] BIGINT NOT NULL,
    [kd_kelas] VARCHAR(10) NOT NULL,
    [nis] INT NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [riwayat_kelas_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [riwayat_kelas_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [riwayat_kelas_pkey] PRIMARY KEY CLUSTERED ([id_riwayat_kelas])
);

-- CreateTable
CREATE TABLE [dbo].[tahun_ajaran] (
    [id_tahun_ajaran] BIGINT NOT NULL IDENTITY(1,1),
    [nama] VARCHAR(255) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [tahun_ajaran_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [tahun_ajaran_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [tahun_ajaran_pkey] PRIMARY KEY CLUSTERED ([id_tahun_ajaran])
);

-- CreateTable
CREATE TABLE [dbo].[kelas] (
    [id_kelas] VARCHAR(10) NOT NULL,
    [id_jurusan] VARCHAR(10) NOT NULL,
    [nama_kelas] VARCHAR(15) NOT NULL,
    [angkatan] INT NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [kelas_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kelas_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [kelas_pkey] PRIMARY KEY CLUSTERED ([id_kelas])
);

-- CreateTable
CREATE TABLE [dbo].[jurusans] (
    [id_jurusan] VARCHAR(10) NOT NULL,
    [nama_jurusan] VARCHAR(25) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [jurusans_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [jurusans_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [jurusans_pkey] PRIMARY KEY CLUSTERED ([id_jurusan])
);

-- CreateTable
CREATE TABLE [dbo].[pelanggarans] (
    [id_pelanggaran] INT NOT NULL IDENTITY(1,1),
    [id_kategori_pelanggaran] INT NOT NULL,
    [nama_pelanggaran] VARCHAR(255) NOT NULL,
    [tingkatan] NVARCHAR(1000) NOT NULL,
    [bobot_point] INT NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [pelanggarans_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [pelanggarans_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [pelanggarans_pkey] PRIMARY KEY CLUSTERED ([id_pelanggaran])
);

-- CreateTable
CREATE TABLE [dbo].[kategori_pelanggaran] (
    [id_kategori_pelanggaran] INT NOT NULL IDENTITY(1,1),
    [nama] VARCHAR(255) NOT NULL,
    [status_delete] INT NOT NULL CONSTRAINT [kategori_pelanggaran_status_delete_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kategori_pelanggaran_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [kategori_pelanggaran_pkey] PRIMARY KEY CLUSTERED ([id_kategori_pelanggaran])
);

-- AddForeignKey
ALTER TABLE [dbo].[sampah] ADD CONSTRAINT [sampah_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[users]([id_user]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[activity_log] ADD CONSTRAINT [activity_log_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[users]([id_user]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] ADD CONSTRAINT [pelanggaran_siswas_id_tahun_ajaran_fkey] FOREIGN KEY ([id_tahun_ajaran]) REFERENCES [dbo].[tahun_ajaran]([id_tahun_ajaran]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] ADD CONSTRAINT [pelanggaran_siswas_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[users]([id_user]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] ADD CONSTRAINT [pelanggaran_siswas_nis_fkey] FOREIGN KEY ([nis]) REFERENCES [dbo].[siswas]([nis]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] ADD CONSTRAINT [pelanggaran_siswas_id_kelas_fkey] FOREIGN KEY ([id_kelas]) REFERENCES [dbo].[kelas]([id_kelas]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] ADD CONSTRAINT [pelanggaran_siswas_id_pelanggaran_fkey] FOREIGN KEY ([id_pelanggaran]) REFERENCES [dbo].[pelanggarans]([id_pelanggaran]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggaran_siswas] ADD CONSTRAINT [pelanggaran_siswas_id_kategori_pelanggaran_fkey] FOREIGN KEY ([id_kategori_pelanggaran]) REFERENCES [dbo].[kategori_pelanggaran]([id_kategori_pelanggaran]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[riwayat_kelas] ADD CONSTRAINT [riwayat_kelas_id_tahun_ajaran_fkey] FOREIGN KEY ([id_tahun_ajaran]) REFERENCES [dbo].[tahun_ajaran]([id_tahun_ajaran]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[riwayat_kelas] ADD CONSTRAINT [riwayat_kelas_kd_kelas_fkey] FOREIGN KEY ([kd_kelas]) REFERENCES [dbo].[kelas]([id_kelas]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[riwayat_kelas] ADD CONSTRAINT [riwayat_kelas_nis_fkey] FOREIGN KEY ([nis]) REFERENCES [dbo].[siswas]([nis]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[kelas] ADD CONSTRAINT [kelas_id_jurusan_fkey] FOREIGN KEY ([id_jurusan]) REFERENCES [dbo].[jurusans]([id_jurusan]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[pelanggarans] ADD CONSTRAINT [pelanggarans_id_kategori_pelanggaran_fkey] FOREIGN KEY ([id_kategori_pelanggaran]) REFERENCES [dbo].[kategori_pelanggaran]([id_kategori_pelanggaran]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
