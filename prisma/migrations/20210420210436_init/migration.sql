-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "flags" TEXT NOT NULL,
    "registered_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "games" (
    "game_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "short_name" TEXT NOT NULL,
    "link" TEXT,

    PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "areas" (
    "area_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,

    PRIMARY KEY ("area_id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "room_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT,
    "area_id" INTEGER NOT NULL,

    PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "glitched" INTEGER NOT NULL,

    PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "strats" (
    "strat_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "difficulty" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "area_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,

    PRIMARY KEY ("strat_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- AddForeignKey
ALTER TABLE "areas" ADD FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD FOREIGN KEY ("area_id") REFERENCES "areas"("area_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strats" ADD FOREIGN KEY ("area_id") REFERENCES "areas"("area_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strats" ADD FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strats" ADD FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strats" ADD FOREIGN KEY ("room_id") REFERENCES "rooms"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strats" ADD FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;
