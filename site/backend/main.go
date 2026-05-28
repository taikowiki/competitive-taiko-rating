package main

import (
	"log"
	"os"

	"c-rating-backend/db"
	"c-rating-backend/server"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	_ = godotenv.Load()

	// Initialize Database
	database, err := db.NewDB()
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Initialize Server
	s := server.NewServer(database)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Starting server on :%s\n", port)
	if err := s.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
