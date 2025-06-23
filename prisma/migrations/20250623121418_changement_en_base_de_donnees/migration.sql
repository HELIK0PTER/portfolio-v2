-- CreateTable
CREATE TABLE "contact_settings" (
    "id" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT NOT NULL DEFAULT 'France',
    "availability" TEXT NOT NULL DEFAULT 'Lun - Ven, 9h - 18h',
    "response_time" TEXT NOT NULL DEFAULT 'Je réponds généralement dans les 24h',
    "preferred_contact" TEXT NOT NULL DEFAULT 'email',
    "auto_reply" BOOLEAN NOT NULL DEFAULT true,
    "auto_reply_message" TEXT,
    "smtp_host" TEXT NOT NULL DEFAULT 'smtp.gmail.com',
    "smtp_port" INTEGER NOT NULL DEFAULT 587,
    "smtp_secure" BOOLEAN NOT NULL DEFAULT false,
    "smtp_user" TEXT NOT NULL DEFAULT '',
    "smtp_password" TEXT NOT NULL DEFAULT '',
    "smtp_from_name" TEXT NOT NULL DEFAULT 'Portfolio Contact',
    "smtp_from_email" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_currently" BOOLEAN NOT NULL DEFAULT false,
    "grade" TEXT,
    "skills" TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_currently" BOOLEAN NOT NULL DEFAULT false,
    "skills" TEXT[],
    "company_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);
