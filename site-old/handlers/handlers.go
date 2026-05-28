package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/galacticeye/competitive-taiko-rating/site/db"
	"github.com/galacticeye/competitive-taiko-rating/site/services"
	"github.com/gin-gonic/gin"
)

func IndexHandler(c *gin.Context) {
	comp, err := db.GetLatestCompetition()
	if err != nil {
		log.Printf("[INDEX] Error fetching latest competition: %v", err)
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "데이터베이스 오류가 발생했습니다."})
		return
	}

	var song1, song2, song3 string
	if comp != nil {
		song1, _ = services.GetSongTitle(comp.SongNo1)
		song2, _ = services.GetSongTitle(comp.SongNo2)
		song3, _ = services.GetSongTitle(comp.SongNo3)
	}

	if comp == nil {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"competition":  nil,
			"hirobaCompes": nil,
		})
		return
	}

	hirobaCompes, err := db.GetHirobaCompetitions(comp.Season, comp.Session)
	if err != nil {
		log.Printf("[INDEX] Error fetching hiroba competitions: %v", err)
	}

	if len(hirobaCompes) == 0 {
		fallbackCompes, fSeason, fSession, fErr := db.GetLatestHirobaCompetitions()
		if fErr == nil && len(fallbackCompes) > 0 {
			log.Printf("[INDEX] Found fallback links from S%d #%d", fSeason, fSession)
			hirobaCompes = fallbackCompes
		}
	}

	c.HTML(http.StatusOK, "index.html", gin.H{
		"competition":  comp,
		"song1":        song1,
		"song2":        song2,
		"song3":        song3,
		"hirobaCompes": hirobaCompes,
	})
}

func RankingHandler(c *gin.Context) {
	rankings, err := db.GetRankings()
	if err != nil {
		log.Printf("[RANKING] Error fetching current rankings: %v", err)
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "랭킹 정보를 가져올 수 없습니다."})
		return
	}

	c.HTML(http.StatusOK, "ranking.html", gin.H{
		"rankings": rankings,
	})
}

func RankingSeasonListHandler(c *gin.Context) {
	seasons, err := db.GetSeasons()
	if err != nil {
		log.Printf("[RANKING_SEASONS] Error fetching seasons: %v", err)
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "시즌 목록을 가져올 수 없습니다."})
		return
	}

	c.HTML(http.StatusOK, "ranking_seasons.html", gin.H{
		"seasons": seasons,
	})
}

func SeasonRankingHandler(c *gin.Context) {
	seasonStr := c.Param("season")
	season, _ := strconv.Atoi(seasonStr)

	rankings, err := db.GetRankingsBySeason(season)
	if err != nil {
		log.Printf("[SEASON_RANKING] Error fetching rankings for season %d: %v", season, err)
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "시즌 랭킹 정보를 가져올 수 없습니다."})
		return
	}

	c.HTML(http.StatusOK, "ranking_season_detail.html", gin.H{
		"season":   season,
		"rankings": rankings,
	})
}

func PlayerHandler(c *gin.Context) {
	taikoNo := c.Param("taikoNo")
	seasonRatings, err := db.GetPlayerSeasonRatings(taikoNo)
	if err != nil {
		log.Printf("[PLAYER] Error fetching player season ratings: %v", err)
	}

	c.HTML(http.StatusOK, "player.html", gin.H{
		"taikoNo":       taikoNo,
		"seasonRatings": seasonRatings,
	})
}

func ScoresHandler(c *gin.Context) {
	seasonStr := c.Param("season")
	sessionStr := c.Param("session")

	season, _ := strconv.Atoi(seasonStr)
	session, _ := strconv.Atoi(sessionStr)

	scores, err := db.GetSessionScores(season, session)
	if err != nil {
		log.Printf("[SCORES] Error fetching session scores: %v", err)
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "점수 정보를 가져올 수 없습니다."})
		return
	}

	c.HTML(http.StatusOK, "scores.html", gin.H{
		"season":  season,
		"session": session,
		"scores":  scores,
	})
}

func SeasonListHandler(c *gin.Context) {
	seasons, err := db.GetSeasons()
	if err != nil {
		log.Printf("[SEASONS] Error fetching seasons: %v", err)
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "시즌 목록을 가져올 수 없습니다."})
		return
	}

	c.HTML(http.StatusOK, "seasons.html", gin.H{
		"seasons": seasons,
	})
}

func SessionListHandler(c *gin.Context) {
	seasonStr := c.Param("season")
	season, _ := strconv.Atoi(seasonStr)

	sessions, err := db.GetSessionsBySeason(season)
	if err != nil {
		log.Printf("[SESSIONS] Error fetching sessions for season %d: %v", season, err)
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "세션 목록을 가져올 수 없습니다."})
		return
	}

	c.HTML(http.StatusOK, "sessions.html", gin.H{
		"season":   season,
		"sessions": sessions,
	})
}

func AboutHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "about.html", nil)
}
