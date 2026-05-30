package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"c-rating-backend/db"

	"github.com/gin-gonic/gin"
)

type SongCache struct {
	data map[string]struct {
		Title string
		Level int
	}
	mu sync.RWMutex
}

func NewSongCache() *SongCache {
	return &SongCache{
		data: make(map[string]struct {
			Title string
			Level int
		}),
	}
}

func (sc *SongCache) GetSongInfo(songNo string, diff int) (string, int) {
	if songNo == "" {
		return "", 0
	}

	sc.mu.RLock()
	if info, exists := sc.data[songNo]; exists {
		sc.mu.RUnlock()
		return info.Title, info.Level
	}
	sc.mu.RUnlock()

	url := fmt.Sprintf("https://taiko.wiki/api/v1/song/no/%s", songNo)
	resp, err := http.Get(url)
	if err != nil {
		return "", 0
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", 0
	}

	// Try to decode into a generic structure to find level
	var raw map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		fmt.Printf("DEBUG: Failed to decode JSON for song %s: %v\n", songNo, err)
		return "", 0
	}

	title, _ := raw["title"].(string)

	level := 0
	// Log raw data to debug structure
	// fmt.Printf("DEBUG: Raw API response for song %s: %+v\n", songNo, raw)
	var difficulty string
	if diff == 5 {
		difficulty = "ura"
	} else {
		difficulty = "oni"
	}
	courses, ok := raw["courses"].(map[string]any)
	if ok {
		course, ok := courses[difficulty].(map[string]any)
		if ok {
			level = int(course["level"].(float64))
		}
	}

	sc.mu.Lock()
	sc.data[songNo] = struct {
		Title string
		Level int
	}{Title: title, Level: level}
	sc.mu.Unlock()

	return title, level
}

type Server struct {
	engine *gin.Engine
	db     *db.DB
	cache  *SongCache
}

func NewServer(database *db.DB) *Server {
	s := &Server{
		engine: gin.Default(),
		db:     database,
		cache:  NewSongCache(),
	}
	s.setupRoutes()
	return s
}

func (s *Server) setupRoutes() {
	v1 := s.engine.Group("/api/v1")
	{
		v1.GET("/current/session", s.currentSession)
		v1.GET("/current/compeid", s.currentHirobaCompeIds)
		v1.GET("/seasons", s.seasons)
		v1.GET("/ranking", s.ranking)
		v1.GET("/ranking/:season", s.seasonRanking)
		v1.GET("/history", s.history)
		v1.GET("/sessions", s.sessionsBySeason)
		v1.GET("/player/:taikoNo", s.playerDetail)
	}
	s.engine.Static("/favicon.png", "./static/favicon.png")
	s.engine.NoRoute(func(c *gin.Context) {
		c.File("./static/index.html")
	})
}

func (s *Server) Run(addr string) error {
	return s.engine.Run(addr)
}
