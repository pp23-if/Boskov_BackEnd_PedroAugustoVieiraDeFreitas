-- CreateTable
CREATE TABLE `avaliacao` (
    `id_usuario` INTEGER NOT NULL,
    `id_filme` INTEGER NOT NULL,
    `nota` INTEGER NOT NULL,
    `comentário` TEXT NOT NULL,

    INDEX `fk_filme_avaliacao`(`id_filme`),
    PRIMARY KEY (`id_usuario`, `id_filme`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(300) NOT NULL,
    `diretor` VARCHAR(255) NOT NULL,
    `ano_lancamento` DATE NOT NULL,
    `duracao` INTEGER NOT NULL,
    `produtora` VARCHAR(255) NOT NULL,
    `classificacao` VARCHAR(50) NOT NULL,
    `poster` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genero_filme` (
    `id_genero` INTEGER NOT NULL,
    `id_filme` INTEGER NOT NULL,

    INDEX `fk_filme`(`id_filme`),
    PRIMARY KEY (`id_genero`, `id_filme`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `token` VARCHAR(1024) NOT NULL,

    INDEX `fk_usuario`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(1024) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `apelido` VARCHAR(255) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `data_criacao` DATETIME(0) NOT NULL,
    `data_atualizacao` DATETIME(0) NOT NULL,
    `tipo_usuario` ENUM('cliente', 'admin') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `fk_filme_avaliacao` FOREIGN KEY (`id_filme`) REFERENCES `filme`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `fk_usuario_avaliacao` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genero_filme` ADD CONSTRAINT `fk_filme` FOREIGN KEY (`id_filme`) REFERENCES `filme`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genero_filme` ADD CONSTRAINT `fk_genero` FOREIGN KEY (`id_genero`) REFERENCES `genero`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
