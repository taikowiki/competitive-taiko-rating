package main

import (
	"html/template"
	"log"
	"os"

	"github.com/galacticeye/competitive-taiko-rating/site/db"
	"github.com/galacticeye/competitive-taiko-rating/site/handlers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	godotenv.Load()
}

func main() {
	// Initialize Database
	db.InitDB()

	r := gin.Default()

	// Custom template functions
	r.SetFuncMap(template.FuncMap{
		"add": func(a, b int) int {
			return a + b
		},
	})

	// Load templates
	r.LoadHTMLGlob("templates/*")

	// Serve static files
	r.Static("/static", "./static")

	// Routes
	r.GET("/", handlers.IndexHandler)
	r.GET("/ranking", handlers.RankingHandler)
	r.GET("/ranking/season", handlers.RankingSeasonListHandler)
	r.GET("/ranking/season/:season", handlers.SeasonRankingHandler)
	r.GET("/history", handlers.SeasonListHandler)
	r.GET("/history/:season", handlers.SessionListHandler)
	r.GET("/history/:season/:session", handlers.ScoresHandler)
	r.GET("/player/:taikoNo", handlers.PlayerHandler)
	r.GET("/about", handlers.AboutHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on :%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
