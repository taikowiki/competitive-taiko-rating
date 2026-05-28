package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
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
		v1.GET("/competition/latest", s.getLatestCompetition)
		v1.GET("/ranking/current", s.getCurrentRanking)
		v1.GET("/ranking/season/:season", s.getSeasonRanking)
		v1.GET("/history/seasons", s.getSeasons)
		v1.GET("/history/seasons/:season/sessions", s.getSessionsBySeason)
		v1.GET("/history/seasons/:season/sessions/:session/scores", s.getSessionScores)
		v1.GET("/player/:taikoNo", s.getPlayerDetails)
	}
}

func (s *Server) Run(addr string) error {
	return s.engine.Run(addr)
}

func (s *Server) getLatestCompetition(c *gin.Context) {
	comp, err := s.db.GetLatestCompetition()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if comp == nil {
		c.JSON(http.StatusOK, gin.H{"competition": nil, "hirobaCompes": nil})
		return
	}

	hirobaCompes, err := s.db.GetHirobaCompetitions(comp.Season, comp.Session)
	if err != nil {
		// Log error
	}

	if len(hirobaCompes) == 0 {
		fallback, _, _, _ := s.db.GetLatestHirobaCompetitions()
		hirobaCompes = fallback
	}

	diff1, _ := strconv.Atoi(comp.Diff1)
	diff2, _ := strconv.Atoi(comp.Diff2)
	diff3, _ := strconv.Atoi(comp.Diff3)

	song1Title, song1Level := s.cache.GetSongInfo(comp.SongNo1, diff1)
	song2Title, song2Level := s.cache.GetSongInfo(comp.SongNo2, diff2)
	song3Title, song3Level := s.cache.GetSongInfo(comp.SongNo3, diff3)

	c.JSON(http.StatusOK, gin.H{
		"competition":  comp,
		"song1":        song1Title,
		"song1Level":   song1Level,
		"song2":        song2Title,
		"song2Level":   song2Level,
		"song3":        song3Title,
		"song3Level":   song3Level,
		"hirobaCompes": hirobaCompes,
	})
}

func (s *Server) getCurrentRanking(c *gin.Context) {
	rankings, err := s.db.GetRankings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rankings)
}

func (s *Server) getSeasonRanking(c *gin.Context) {
	season, _ := strconv.Atoi(c.Param("season"))
	rankings, err := s.db.GetRankingsBySeason(season)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rankings)
}

func (s *Server) getSeasons(c *gin.Context) {
	seasons, err := s.db.GetSeasons()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, seasons)
}

func (s *Server) getSessionsBySeason(c *gin.Context) {
	season, _ := strconv.Atoi(c.Param("season"))
	sessions, err := s.db.GetSessionsBySeason(season)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sessions)
}

func (s *Server) getSessionScores(c *gin.Context) {
	season, _ := strconv.Atoi(c.Param("season"))
	session, _ := strconv.Atoi(c.Param("session"))
	scores, err := s.db.GetSessionScores(season, session)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, scores)
}

func (s *Server) getPlayerDetails(c *gin.Context) {
	taikoNo := c.Param("taikoNo")
	seasonRatings, err := s.db.GetPlayerSeasonRatings(taikoNo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"taikoNo":       taikoNo,
		"seasonRatings": seasonRatings,
	})
}
