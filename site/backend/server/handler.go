package server

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (s *Server) currentSession(c *gin.Context) {
	session_db, err := s.db.GetCurrentSession()
	if err != nil {
		c.Status(500)
		return
	}

	if session_db == nil {
		c.JSON(200, nil)
		return
	}

	diff1, _ := strconv.Atoi(session_db.Diff1)
	diff2, _ := strconv.Atoi(session_db.Diff2)
	diff3, _ := strconv.Atoi(session_db.Diff3)

	song1Title, song1Level := s.cache.GetSongInfo(session_db.SongNo1, diff1)
	song2Title, song2Level := s.cache.GetSongInfo(session_db.SongNo2, diff2)
	song3Title, song3Level := s.cache.GetSongInfo(session_db.SongNo3, diff3)

	songs := []Song{
		{
			SongNo: session_db.SongNo1,
			Title:  song1Title,
			Level:  song1Level,
			Diff:   session_db.Diff1,
		},
		{
			SongNo: session_db.SongNo2,
			Title:  song2Title,
			Level:  song2Level,
			Diff:   session_db.Diff2,
		},
		{
			SongNo: session_db.SongNo3,
			Title:  song3Title,
			Level:  song3Level,
			Diff:   session_db.Diff3,
		},
	}

	session := Session{
		Season:  session_db.Season,
		Session: session_db.Session,
		Songs:   songs,
		Start:   session_db.StartDate,
		End:     session_db.EndDate,
	}
	c.JSON(200, session)
}

func (s *Server) currentHirobaCompeIds(c *gin.Context) {
	compeIds, err := s.db.GetCurrentHirobaCompeIds()
	if err != nil {
		c.Status(500)
		return
	}

	c.JSON(200, compeIds)
}

func (s *Server) seasons(c *gin.Context) {
	seasons, err := s.db.GetSeasons()
	if err != nil {
		c.Status(500)
		return
	}

	c.JSON(200, seasons)
}

func (s *Server) ranking(c *gin.Context) {
	ratings, err := s.db.GetCurrentRatings()
	if err != nil {
		c.Status(500)
		return
	}

	maskedRatings := []map[string]any{}
	for _, rating := range ratings {
		maskedRating := map[string]any{
			"taikoNo": rating.TaikoNo,
			"rating":  rating.Rating,
			"ranking": rating.Ranking,
		}
		maskedRatings = append(maskedRatings, maskedRating)
	}
	c.JSON(200, maskedRatings)
}

func (s *Server) seasonRanking(c *gin.Context) {
	season_, ok := c.Params.Get("season")
	if !ok {
		c.Status(404)
		return
	}

	season, err := strconv.Atoi(season_)
	if err != nil {
		c.Status(500)
		return
	}

	ratings, err := s.db.GetSeasonRatings(season)
	if err != nil {
		c.Status(500)
		return
	}

	maskedRatings := []map[string]any{}
	for _, rating := range ratings {
		maskedRating := map[string]any{
			"taikoNo": rating.TaikoNo,
			"rating":  rating.Rating,
			"ranking": rating.Ranking,
		}
		maskedRatings = append(maskedRatings, maskedRating)
	}
	c.JSON(200, maskedRatings)
}

func (s *Server) history(c *gin.Context) {
	seasonNo := c.Query("season")
	sessionNo := c.Query("session")
	season, err1 := strconv.Atoi(seasonNo)
	session, err2 := strconv.Atoi(sessionNo)

	if seasonNo == "" || sessionNo == "" || err1 != nil || err2 != nil {
		currentSession, err := s.db.GetCurrentSession()
		if err != nil {
			log.Println(err)
			c.Status(500)
			return
		}
		histories, err := s.db.GetCompeHistories(currentSession.Season, currentSession.Session)
		if err != nil {
			log.Println(err)
			c.Status(500)
			return
		}
		c.JSON(200, gin.H{
			"season":    currentSession.Season,
			"session":   currentSession.Session,
			"histories": histories,
		})
	} else {
		histories, err := s.db.GetCompeHistories(season, session)
		if err != nil {
			log.Println(err)
			c.Status(500)
			return
		}
		c.JSON(200, gin.H{
			"season":    season,
			"session":   session,
			"histories": histories,
		})
	}
}

func (s *Server) sessionsBySeason(c *gin.Context) {
	season_ := c.Query("season")
	if season_ == "" {
		c.Status(400)
		return
	}

	season, err := strconv.Atoi(season_)
	if err != nil {
		c.Status(500)
		return
	}

	sessions, err := s.db.GetSessionsBySeason(season)
	if err != nil {
		c.Status(500)
		return
	}
	c.JSON(200, sessions)
}

func (s *Server) playerDetail(c *gin.Context) {
	taikoNo, ok := c.Params.Get("taikoNo")
	if !ok {
		c.Status(400)
		return
	}

	rating, err := s.db.GetPlayerRating(taikoNo)
	if err != nil {
		c.Status(500)
		return
	}

	log.Println(taikoNo, rating)

	history, err := s.db.GetPlayerHistory(taikoNo)
	if err != nil {
		c.Status(500)
		return
	}

	playerHistory := []PlayerRatingHistory{}
	for _, h := range history {
		playerHistory = append(playerHistory, PlayerRatingHistory{
			Season:  h.Season,
			Rating:  h.Rating,
			Ranking: h.Ranking,
		})
	}

	var currentRating float64
	var currentRanking int
	if rating != nil {
		currentRating = rating.Rating
		currentRanking = rating.Ranking
	} else if len(playerHistory) > 0 {
		// If not in current rating but has history, maybe show last known?
		// Or just 0.
	}

	detail := PlayerDetail{
		TaikoNo:        taikoNo,
		CurrentRating:  currentRating,
		CurrentRanking: currentRanking,
		History:        playerHistory,
	}

	c.JSON(200, detail)
}
