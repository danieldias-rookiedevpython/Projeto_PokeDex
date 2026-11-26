-- AlterTable
ALTER TABLE "pokemons" ADD COLUMN     "ability id" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "id trainer" INTEGER NOT NULL,
ADD COLUMN     "type id" INTEGER NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Trainer";

-- CreateTable
CREATE TABLE "trainers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "gender" TEXT NOT NULL,
    "user id" INTEGER NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ability" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainers_cpf_key" ON "trainers"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ability_name_key" ON "Ability"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pokemons_name_key" ON "pokemons"("name");

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_id trainer_fkey" FOREIGN KEY ("id trainer") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_type id_fkey" FOREIGN KEY ("type id") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_ability id_fkey" FOREIGN KEY ("ability id") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
