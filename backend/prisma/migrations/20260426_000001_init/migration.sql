CREATE TABLE `admin_users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(80) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `assets` (
    `id` VARCHAR(191) NOT NULL,
    `kind` ENUM('IMAGE', 'PROJECT_PDF', 'RESUME') NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `mime_type` VARCHAR(120) NOT NULL,
    `size` INTEGER NOT NULL,
    `storage_provider` VARCHAR(40) NOT NULL DEFAULT 'local',
    `object_key` VARCHAR(500) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `preview_url` VARCHAR(500) NULL,
    `checksum` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `assets_kind_idx`(`kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `site_profiles` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(120) NOT NULL,
    `tagline` VARCHAR(240) NOT NULL,
    `resume_asset_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_profiles_resume_asset_id_key`(`resume_asset_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `site_contact_items` (
    `id` VARCHAR(191) NOT NULL,
    `site_profile_id` INTEGER NOT NULL,
    `label` VARCHAR(80) NOT NULL,
    `value` VARCHAR(160) NOT NULL,
    `href` VARCHAR(500) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 100,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `site_contact_items_site_profile_id_order_idx`(`site_profile_id`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `excerpt` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `period` VARCHAR(80) NOT NULL,
    `role` VARCHAR(160) NULL,
    `highlights` JSON NOT NULL,
    `notes` JSON NOT NULL,
    `cover_asset_id` VARCHAR(191) NULL,
    `pdf_asset_id` VARCHAR(191) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 100,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_slug_key`(`slug`),
    INDEX `projects_status_sort_order_idx`(`status`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `project_images` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `asset_id` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(240) NULL,
    `order` INTEGER NOT NULL DEFAULT 100,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `project_images_project_id_order_idx`(`project_id`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `project_links` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(80) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 100,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `project_links_project_id_order_idx`(`project_id`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `admin_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `admin_user_id` VARCHAR(191) NOT NULL,
    `session_token_hash` VARCHAR(64) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `last_used_at` DATETIME(3) NULL,
    `ip` VARCHAR(120) NULL,
    `user_agent` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_sessions_session_token_hash_key`(`session_token_hash`),
    INDEX `admin_sessions_admin_user_id_idx`(`admin_user_id`),
    INDEX `admin_sessions_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `site_profiles`
    ADD CONSTRAINT `site_profiles_resume_asset_id_fkey`
    FOREIGN KEY (`resume_asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `site_contact_items`
    ADD CONSTRAINT `site_contact_items_site_profile_id_fkey`
    FOREIGN KEY (`site_profile_id`) REFERENCES `site_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `projects`
    ADD CONSTRAINT `projects_cover_asset_id_fkey`
    FOREIGN KEY (`cover_asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT `projects_pdf_asset_id_fkey`
    FOREIGN KEY (`pdf_asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `project_images`
    ADD CONSTRAINT `project_images_project_id_fkey`
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `project_images_asset_id_fkey`
    FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `project_links`
    ADD CONSTRAINT `project_links_project_id_fkey`
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `admin_sessions`
    ADD CONSTRAINT `admin_sessions_admin_user_id_fkey`
    FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
